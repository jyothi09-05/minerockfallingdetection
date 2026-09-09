import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Shield,
  AlertTriangle,
  Flame,
  Activity,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sliders,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  RefreshCw,
  Video,
  Layers,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';
import {
  CameraConfig,
  CameraFrameAnalysis,
  CCTVEvent,
  CameraHealthSummary,
  VirtualSafetyZone,
  IncidentCCTVReplay
} from '../types/cctv';
import { cctvService } from '../services/cctvService';

export const SurveillanceCenter: React.FC = () => {
  // Cameras & Active View State
  const [cameras, setCameras] = useState<CameraConfig[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-PIT-01');
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '3x2'>('1x1');
  const [healthSummary, setHealthSummary] = useState<CameraHealthSummary | null>(null);
  const [events, setEvents] = useState<CCTVEvent[]>([]);
  const [zones, setZones] = useState<VirtualSafetyZone[]>([]);

  // Simulation / Injection States
  const [injectViolation, setInjectViolation] = useState<boolean>(false);
  const [injectSmoke, setInjectSmoke] = useState<boolean>(false);
  const [injectIncursion, setInjectIncursion] = useState<boolean>(false);

  // Overlay Controls
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [showTrajectories, setShowTrajectories] = useState<boolean>(true);
  const [showVelocities, setShowVelocities] = useState<boolean>(true);

  // Live Frame Telemetry State
  const [frameAnalysis, setFrameAnalysis] = useState<CameraFrameAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Incident Replay Modal State
  const [replayModalOpen, setReplayModalOpen] = useState<boolean>(false);
  const [replayData, setReplayData] = useState<IncidentCCTVReplay | null>(null);
  const [replayFrameIndex, setReplayFrameIndex] = useState<number>(5);
  const [isReplayPlaying, setIsReplayPlaying] = useState<boolean>(false);

  // Canvas Ref for Primary Stream
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load initial cameras, health, zones & events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cams, health, evts, znList] = await Promise.all([
          cctvService.getCameras(),
          cctvService.getHealthSummary(),
          cctvService.getEvents({ limit: 30 }),
          cctvService.getZones()
        ]);
        setCameras(cams);
        setHealthSummary(health);
        setEvents(evts);
        setZones(znList);
      } catch (err) {
        console.error('Failed to load CCTV data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Periodic Frame Inference Polling (Every 1.2s for simulated real-time CV)
  useEffect(() => {
    let isMounted = true;

    const pollFrame = async () => {
      if (!selectedCameraId) return;
      try {
        const analysis = await cctvService.getCameraFrame(selectedCameraId, {
          injectViolation,
          injectSmoke,
          injectIncursion
        });
        if (isMounted) {
          setFrameAnalysis(analysis);
        }
      } catch (err) {
        console.error('Frame inference error:', err);
      }
    };

    pollFrame();
    const interval = setInterval(pollFrame, 1200);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCameraId, injectViolation, injectSmoke, injectIncursion]);

  // Periodic Events & Health Refresh (Every 5s)
  useEffect(() => {
    const refreshData = async () => {
      try {
        const [health, evts] = await Promise.all([
          cctvService.getHealthSummary(),
          cctvService.getEvents({ limit: 30 })
        ]);
        setHealthSummary(health);
        setEvents(evts);
      } catch (err) {
        console.error('Refresh error:', err);
      }
    };
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  // PTZ Action Handlers
  const handlePTZMove = async (panDelta: number, tiltDelta: number) => {
    const cam = cameras.find((c) => c.camera_id === selectedCameraId);
    if (!cam) return;
    const newPan = Math.max(-180, Math.min(180, cam.ptz.pan_deg + panDelta));
    const newTilt = Math.max(-90, Math.min(90, cam.ptz.tilt_deg + tiltDelta));
    try {
      const updated = await cctvService.updatePTZ(selectedCameraId, newPan, newTilt, cam.ptz.zoom_level);
      setCameras((prev) => prev.map((c) => (c.camera_id === updated.camera_id ? updated : c)));
    } catch (err) {
      console.error('PTZ update failed:', err);
    }
  };

  const handlePTZZoom = async (zoomDelta: number) => {
    const cam = cameras.find((c) => c.camera_id === selectedCameraId);
    if (!cam) return;
    const newZoom = Math.max(1.0, Math.min(10.0, Number((cam.ptz.zoom_level + zoomDelta).toFixed(1))));
    try {
      const updated = await cctvService.updatePTZ(selectedCameraId, cam.ptz.pan_deg, cam.ptz.tilt_deg, newZoom);
      setCameras((prev) => prev.map((c) => (c.camera_id === updated.camera_id ? updated : c)));
    } catch (err) {
      console.error('PTZ zoom failed:', err);
    }
  };

  const handleResetPTZ = async () => {
    try {
      const updated = await cctvService.updatePTZ(selectedCameraId, 0.0, -15.0, 1.0);
      setCameras((prev) => prev.map((c) => (c.camera_id === updated.camera_id ? updated : c)));
    } catch (err) {
      console.error('PTZ reset failed:', err);
    }
  };

  // Trigger Replay Modal
  const openReplay = async (incidentId: string) => {
    try {
      const data = await cctvService.getIncidentReplay(incidentId);
      setReplayData(data);
      setReplayFrameIndex(5);
      setIsReplayPlaying(false);
      setReplayModalOpen(true);
    } catch (err) {
      console.error('Failed to load incident replay:', err);
    }
  };

  // Replay Auto-Play Loop
  useEffect(() => {
    if (!isReplayPlaying || !replayData) return;
    const interval = setInterval(() => {
      setReplayFrameIndex((prev) => {
        if (prev >= replayData.replay_frames.length - 1) {
          setIsReplayPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isReplayPlaying, replayData]);

  // Render Canvas Feed for Selected Camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Simulated Background Mining Terrain & Environment
      ctx.fillStyle = '#0f172a'; // Deep slate background
      ctx.fillRect(0, 0, width, height);

      // Draw Pit Benches & Ramp Lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      for (let y = 100; y < height; y += 70) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width * 0.3, y + 20, width * 0.7, y - 20, width, y);
        ctx.stroke();
      }

      // Draw Bench Contour Shading
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1e293b33');
      grad.addColorStop(1, '#020617ee');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Virtual Safety Zones Geofences if enabled
      if (showGeofences) {
        const activeZones = zones.filter((z) => z.camera_id === selectedCameraId);
        activeZones.forEach((z) => {
          if (z.polygon_points.length >= 3) {
            ctx.beginPath();
            const startX = z.polygon_points[0][0] * width;
            const startY = z.polygon_points[0][1] * height;
            ctx.moveTo(startX, startY);
            for (let i = 1; i < z.polygon_points.length; i++) {
              ctx.lineTo(z.polygon_points[i][0] * width, z.polygon_points[i][1] * height);
            }
            ctx.closePath();

            // Fill & Stroke
            const pulse = (Math.sin(time * 3) + 1) * 0.1 + 0.15;
            ctx.fillStyle = z.severity === 'CRITICAL' ? `rgba(239, 68, 68, ${pulse})` : `rgba(249, 115, 22, ${pulse})`;
            ctx.fill();
            ctx.strokeStyle = z.severity === 'CRITICAL' ? '#ef4444' : '#f97316';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Label
            ctx.fillStyle = '#f8fafc';
            ctx.font = '10px "Inter", sans-serif';
            ctx.fillText(`🛡️ ${z.name}`, startX + 5, startY + 15);
          }
        });
      }

      // 3. Draw Tracked Trajectories if enabled
      if (showTrajectories && frameAnalysis?.tracked_objects) {
        frameAnalysis.tracked_objects.forEach((trk) => {
          if (trk.trajectory.length > 1) {
            ctx.beginPath();
            const [firstX, firstY] = trk.trajectory[0];
            ctx.moveTo(firstX * width, firstY * height);
            for (let i = 1; i < trk.trajectory.length; i++) {
              ctx.lineTo(trk.trajectory[i][0] * width, trk.trajectory[i][1] * height);
            }
            ctx.strokeStyle = trk.is_violation ? '#ef4444' : '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      // 4. Draw Simulated Mining Entities & Detections
      if (frameAnalysis?.detections) {
        frameAnalysis.detections.forEach((det) => {
          const [ymin, xmin, ymax, xmax] = det.box_2d;
          const bx = xmin * width;
          const by = ymin * height;
          const bw = (xmax - xmin) * width;
          const bh = (ymax - ymin) * height;

          // Physical Simulated Object Icons & Body
          if (det.class_name === 'EXCAVATOR') {
            ctx.fillStyle = '#f59e0b'; // Mining Yellow
            ctx.fillRect(bx + bw * 0.2, by + bh * 0.4, bw * 0.6, bh * 0.45);
            // Boom
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(bx + bw * 0.3, by + bh * 0.5);
            ctx.lineTo(bx + bw * 0.8, by + bh * 0.15);
            ctx.stroke();
          } else if (det.class_name === 'HAUL_TRUCK') {
            ctx.fillStyle = '#ea580c'; // Haul Truck Orange
            ctx.fillRect(bx + bw * 0.1, by + bh * 0.3, bw * 0.8, bh * 0.55);
            // Cab
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(bx + bw * 0.1, by + bh * 0.15, bw * 0.25, bh * 0.2);
            // Wheels
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(bx + bw * 0.25, by + bh * 0.85, bw * 0.12, 0, Math.PI * 2);
            ctx.arc(bx + bw * 0.75, by + bh * 0.85, bw * 0.12, 0, Math.PI * 2);
            ctx.fill();
          } else if (det.class_name === 'PERSON') {
            // Body
            ctx.fillStyle = det.is_violation ? '#ef4444' : '#10b981';
            ctx.beginPath();
            ctx.arc(bx + bw * 0.5, by + bh * 0.25, bw * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(bx + bw * 0.3, by + bh * 0.45, bw * 0.4, bh * 0.45);
          } else if (det.class_name === 'SMOKE_INDICATOR') {
            // Animated Smoke Cloud
            const sRadius = (Math.sin(time * 4) + 2) * 20;
            const sGrad = ctx.createRadialGradient(bx + bw / 2, by + bh / 2, 5, bx + bw / 2, by + bh / 2, sRadius);
            sGrad.addColorStop(0, 'rgba(239, 68, 68, 0.7)');
            sGrad.addColorStop(0.5, 'rgba(100, 116, 139, 0.4)');
            sGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.arc(bx + bw / 2, by + bh / 2, sRadius, 0, Math.PI * 2);
            ctx.fill();
          }

          // Bounding Box Overlays
          if (showBoxes && det.class_name !== 'HELMET' && det.class_name !== 'HIGH_VIS_VEST') {
            const isAlert = det.is_violation;
            ctx.strokeStyle = isAlert ? '#ef4444' : '#10b981';
            ctx.lineWidth = 2;
            ctx.strokeRect(bx, by, bw, bh);

            // Tag Header
            ctx.fillStyle = isAlert ? '#ef4444' : '#10b981';
            ctx.fillRect(bx, by - 18, Math.max(90, bw), 18);
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 10px "Inter", sans-serif';
            const trackStr = det.track_id ? `#${det.track_id}` : '';
            ctx.fillText(`${det.class_name} ${trackStr} ${(det.confidence * 100).toFixed(0)}%`, bx + 4, by - 5);

            if (isAlert && det.violation_reason) {
              ctx.fillStyle = '#fee2e2';
              ctx.font = '9px "Inter", sans-serif';
              ctx.fillText(det.violation_reason, bx, by + bh + 12);
            }
          }
        });
      }

      // 5. Draw Proximity Danger Lines
      if (frameAnalysis?.proximity_warnings) {
        frameAnalysis.proximity_warnings.forEach((warn) => {
          const wObj = frameAnalysis.tracked_objects.find((t) => t.track_id === warn.worker_track_id);
          const vObj = frameAnalysis.tracked_objects.find((t) => t.track_id === warn.vehicle_track_id);
          if (wObj && vObj) {
            ctx.beginPath();
            ctx.moveTo(wObj.center[0] * width, wObj.center[1] * height);
            ctx.lineTo(vObj.center[0] * width, vObj.center[1] * height);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Danger distance tag
            const midX = ((wObj.center[0] + vObj.center[0]) / 2) * width;
            const midY = ((wObj.center[1] + vObj.center[1]) / 2) * height;
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(midX - 25, midY - 10, 50, 18);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px "Inter", sans-serif';
            ctx.fillText(`⚠️ ${warn.distance_meters}m`, midX - 20, midY + 3);
          }
        });
      }

      // 6. Camera HUD Watermark
      const cam = cameras.find((c) => c.camera_id === selectedCameraId);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(10, 10, 260, 45);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px "Inter", sans-serif';
      ctx.fillText(`● REC [${cam?.resolution || '1080p'} @ ${cam?.fps || 30} FPS]`, 18, 28);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText(`${cam?.camera_name || selectedCameraId} | ${new Date().toISOString()}`, 18, 44);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedCameraId, frameAnalysis, showBoxes, showGeofences, showTrajectories, showVelocities, zones, cameras]);

  const activeCam = cameras.find((c) => c.camera_id === selectedCameraId);

  return (
    <div className="space-y-6">
      {/* Top Banner & Surveillance Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                CCTV Intelligence & Mine Surveillance
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  100% Offline AI Vision
                </span>
              </h1>
              <p className="text-sm text-slate-400">
                Multi-camera spatial intelligence, real-time PPE verification, polygonal geofences, and thermal hazard tracking
              </p>
            </div>
          </div>
        </div>

        {/* Global Surveillance KPI Badges */}
        {healthSummary && (
          <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-center">
              <div className="text-xs text-slate-400">Active Feeds</div>
              <div className="text-base font-bold text-emerald-400">
                {healthSummary.active_cameras} / {healthSummary.total_cameras}
              </div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-center">
              <div className="text-xs text-slate-400">Avg Latency</div>
              <div className="text-base font-bold text-sky-400">{healthSummary.average_latency_ms} ms</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-center">
              <div className="text-xs text-slate-400">Avg Health</div>
              <div className="text-base font-bold text-indigo-400">{healthSummary.average_health_score_pct}%</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-center">
              <div className="text-xs text-slate-400">Active Violations</div>
              <div
                className={`text-base font-bold ${
                  healthSummary.total_active_violations > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'
                }`}
              >
                {healthSummary.total_active_violations}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Left Video Stream & PTZ Controls, Right Timeline & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Video & Vision Matrix */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stream Toolbar & Grid Layout Selector */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Camera Selector:</span>
              <select
                value={selectedCameraId}
                onChange={(e) => setSelectedCameraId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500 font-medium"
              >
                {cameras.map((c) => (
                  <option key={c.camera_id} value={c.camera_id}>
                    {c.camera_id} — {c.camera_name} ({c.zone_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Layout & Overlays Switch */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setGridLayout('1x1')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    gridLayout === '1x1' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1x1 Main
                </button>
                <button
                  onClick={() => setGridLayout('2x2')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    gridLayout === '2x2' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2x2 Quad
                </button>
                <button
                  onClick={() => setGridLayout('3x2')}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition ${
                    gridLayout === '3x2' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3x2 Matrix
                </button>
              </div>
            </div>
          </div>

          {/* Video Stream Canvas or Multi-Grid */}
          {gridLayout === '1x1' ? (
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                width={960}
                height={540}
                className="w-full h-auto aspect-video block bg-slate-950"
              />

              {/* Live Overlay Status Tag */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {frameAnalysis?.hazard_detected && (
                  <div className="flex items-center gap-1.5 bg-rose-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-bounce">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {frameAnalysis.hazard_description || 'Active Hazard Detected'}
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-slate-900/80 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono border border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </div>
              </div>

              {/* Bottom Real-time Stream Metrics Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-4">
                  <span>
                    Personnel: <strong className="text-white">{frameAnalysis?.total_persons || 0}</strong>
                  </span>
                  <span>
                    Machinery: <strong className="text-white">{frameAnalysis?.total_vehicles || 0}</strong>
                  </span>
                  <span>
                    PPE Compliance:{' '}
                    <strong
                      className={
                        (frameAnalysis?.ppe_compliance_rate_pct || 100) < 100 ? 'text-rose-400' : 'text-emerald-400'
                      }
                    >
                      {frameAnalysis?.ppe_compliance_rate_pct || 100}%
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    Pan: <strong>{activeCam?.ptz.pan_deg}°</strong>
                  </span>
                  <span>
                    Tilt: <strong>{activeCam?.ptz.tilt_deg}°</strong>
                  </span>
                  <span>
                    Zoom: <strong>{activeCam?.ptz.zoom_level}x</strong>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-Grid Mode (2x2 or 3x2) */
            <div
              className={`grid gap-3 ${
                gridLayout === '2x2' ? 'grid-cols-2' : 'grid-cols-3'
              }`}
            >
              {cameras.slice(0, gridLayout === '2x2' ? 4 : 6).map((cam) => (
                <div
                  key={cam.camera_id}
                  onClick={() => {
                    setSelectedCameraId(cam.camera_id);
                    setGridLayout('1x1');
                  }}
                  className={`cursor-pointer group relative bg-slate-950 border rounded-lg overflow-hidden transition hover:border-sky-500 ${
                    selectedCameraId === cam.camera_id ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-800'
                  }`}
                >
                  <div className="aspect-video bg-slate-900/80 flex flex-col items-center justify-center p-4 text-center">
                    <Camera className="w-8 h-8 text-slate-600 group-hover:text-sky-400 transition mb-2" />
                    <span className="text-xs font-bold text-white">{cam.camera_name}</span>
                    <span className="text-[10px] text-slate-400">{cam.zone_name}</span>
                    <span className="mt-2 text-[9px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      {cam.resolution} @ {cam.fps} FPS
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded text-slate-300">
                    {cam.camera_id}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    ● ACTIVE
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PTZ & Vision Simulation Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PTZ Controller */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  PTZ Precision Gimbal
                </span>
                <button
                  onClick={handleResetPTZ}
                  className="text-[10px] text-slate-400 hover:text-sky-400 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Center
                </button>
              </h3>

              <div className="flex items-center justify-between gap-4">
                {/* D-Pad */}
                <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                  <div />
                  <button
                    onClick={() => handlePTZMove(0, 5)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"
                    title="Tilt Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div />
                  <button
                    onClick={() => handlePTZMove(-10, 0)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"
                    title="Pan Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleResetPTZ}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-sky-400 transition flex justify-center text-[10px] font-bold"
                    title="Center"
                  >
                    ●
                  </button>
                  <button
                    onClick={() => handlePTZMove(10, 0)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"
                    title="Pan Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div />
                  <button
                    onClick={() => handlePTZMove(0, -5)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"
                    title="Tilt Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div />
                </div>

                {/* Zoom Controls */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePTZZoom(0.2)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-sky-400" /> Zoom In (+0.2x)
                  </button>
                  <button
                    onClick={() => handlePTZZoom(-0.2)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-sky-400" /> Zoom Out (-0.2x)
                  </button>
                </div>
              </div>
            </div>

            {/* AI Vision & Anomaly Injection Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Live Vision Simulator & Injection
              </h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInjectViolation(!injectViolation)}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border transition ${
                      injectViolation
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ⚠️ PPE Violation {injectViolation ? '(Active)' : ''}
                  </button>
                  <button
                    onClick={() => setInjectIncursion(!injectIncursion)}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border transition ${
                      injectIncursion
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    🛡️ Zone Breach {injectIncursion ? '(Active)' : ''}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInjectSmoke(!injectSmoke)}
                    className={`flex-1 py-1.5 px-3 rounded text-xs font-medium border transition ${
                      injectSmoke
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    🔥 Smoke Anomaly {injectSmoke ? '(Active)' : ''}
                  </button>
                  <button
                    onClick={() => {
                      setInjectViolation(false);
                      setInjectSmoke(false);
                      setInjectIncursion(false);
                    }}
                    className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-xs font-medium border border-slate-700 transition"
                  >
                    Clear All
                  </button>
                </div>

                {/* Overlays Toggle Checkboxes */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBoxes}
                      onChange={(e) => setShowBoxes(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                    />
                    Boxes
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showGeofences}
                      onChange={(e) => setShowGeofences(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                    />
                    Geofences
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTrajectories}
                      onChange={(e) => setShowTrajectories(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
                    />
                    Trajectories
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Events Timeline & Camera Network Health */}
        <div className="space-y-6">
          {/* Real-time CCTV Event Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Surveillance Event Stream
              </h2>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">
                {events.length} Events
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
              {events.map((evt) => (
                <div
                  key={evt.event_id}
                  className={`p-3 rounded-lg border transition ${
                    evt.severity === 'CRITICAL'
                      ? 'bg-rose-950/30 border-rose-800/60'
                      : evt.severity === 'HIGH'
                      ? 'bg-amber-950/30 border-amber-800/60'
                      : 'bg-slate-850/50 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        evt.severity === 'CRITICAL'
                          ? 'bg-rose-500 text-white'
                          : evt.severity === 'HIGH'
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {evt.event_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 mb-2 leading-relaxed">{evt.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3 text-slate-500" />
                      {evt.camera_id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono">{(evt.confidence * 100).toFixed(0)}% Conf</span>
                      <button
                        onClick={() => openReplay(evt.incident_id || 'INC-2026-001')}
                        className="text-sky-400 hover:text-sky-300 font-semibold underline flex items-center gap-0.5"
                      >
                        Replay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera Health & Sensor Registry List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Surveillance Grid Health
            </h2>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cameras.map((c) => (
                <div
                  key={c.camera_id}
                  onClick={() => setSelectedCameraId(c.camera_id)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedCameraId === c.camera_id
                      ? 'bg-sky-950/40 border-sky-600 text-white'
                      : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        c.operational_status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{c.camera_id}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{c.camera_name}</div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[10px]">
                    <div className="text-slate-300">{c.health_score_pct}% HP</div>
                    <div className="text-slate-500">{c.latency_ms}ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident CCTV Replay Modal */}
      {replayModalOpen && replayData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">
                  CCTV Incident Visual Replay — {replayData.incident_id}
                </h3>
              </div>
              <button
                onClick={() => setReplayModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Simulated Replay Frame Box */}
              <div className="aspect-video bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="text-sky-400 font-mono text-xs mb-2">
                  [REPLAY FRAME {replayFrameIndex + 1} / {replayData.replay_frames.length}]
                </div>
                <div className="text-base font-bold text-white mb-1">{replayData.description}</div>
                <div className="text-xs text-slate-400 font-mono">
                  Offset: {replayData.replay_frames[replayFrameIndex]?.time_offset_seconds}s from trigger
                </div>
                {replayData.replay_frames[replayFrameIndex]?.is_incident_climax && (
                  <div className="mt-3 px-3 py-1 rounded bg-rose-500 text-white font-bold text-xs animate-bounce">
                    ⚡ TRIGGER EVENT CLIMAX
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsReplayPlaying(!isReplayPlaying)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  {isReplayPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isReplayPlaying ? 'Pause' : 'Play Sequence'}
                </button>

                <input
                  type="range"
                  min={0}
                  max={replayData.replay_frames.length - 1}
                  value={replayFrameIndex}
                  onChange={(e) => setReplayFrameIndex(Number(e.target.value))}
                  className="flex-1 accent-sky-500"
                />

                <span className="text-xs font-mono text-slate-400">
                  {replayFrameIndex + 1}/{replayData.replay_frames.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SurveillanceCenter;
