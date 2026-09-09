import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import { CameraFrameAnalysis } from '../types/ai';
import {
  Eye,
  Camera,
  AlertTriangle,
  ShieldCheck,
  Flame,
  CheckCircle2,
  RefreshCw,
  Video,
} from 'lucide-react';

export const ComputerVision: React.FC = () => {
  const [selectedCam, setSelectedCam] = useState('CAM-PIT-01');
  const [injectViolation, setInjectViolation] = useState(false);
  const [injectSmoke, setInjectSmoke] = useState(false);
  const [frameData, setFrameData] = useState<CameraFrameAnalysis | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchFrame = async () => {
    const data = await aiService.analyzeCameraFrame(selectedCam, injectViolation, injectSmoke);
    setFrameData(data);
  };

  useEffect(() => {
    fetchFrame();
  }, [selectedCam, injectViolation, injectSmoke]);

  // Draw bounding boxes on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !frameData) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Draw Simulated Dark Industrial Control Room Camera Background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, h);

    // Camera Scanline Pattern
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let y = 0; y < h; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Camera timestamp and OSD overlay
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`REC ● [${frameData.camera_id}] ${frameData.camera_name}`, 20, 30);
    ctx.fillText(new Date().toISOString(), 20, 48);

    // Draw Detection Bounding Boxes
    frameData.detections.forEach((d) => {
      const [ymin, xmin, ymax, xmax] = d.box_2d;
      const bx = xmin * w;
      const by = ymin * h;
      const bw = (xmax - xmin) * w;
      const bh = (ymax - ymin) * h;

      const isViol = d.is_violation;
      const color = isViol
        ? '#EF4444'
        : d.class_name === 'EXCAVATOR' || d.class_name === 'HAUL_TRUCK'
        ? '#38BDF8'
        : '#10B981';

      ctx.strokeStyle = color;
      ctx.lineWidth = isViol ? 3 : 2;
      ctx.strokeRect(bx, by, bw, bh);

      // Label badge
      ctx.fillStyle = color;
      ctx.fillRect(bx, by - 18, Math.max(120, d.class_name.length * 8 + 40), 18);
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${d.class_name} ${(d.confidence * 100).toFixed(0)}%`, bx + 4, by - 5);

      if (d.violation_reason) {
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(bx, by + bh, bw, 16);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(d.violation_reason, bx + 4, by + bh + 12);
      }
    });
  }, [frameData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            Local Computer Vision Safety & Hazard Analyzer
          </h1>
          <p className="text-xs text-slate-400">
            Edge-hosted video pipeline • Real-time detection of personnel, heavy trucks, PPE compliance, and smoke thermal anomalies.
          </p>
        </div>

        {/* Camera Selector & Triggers */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedCam}
            onChange={(e) => setSelectedCam(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="CAM-PIT-01">📹 Pit Floor Shovel CAM #01</option>
            <option value="CAM-RAMP-02">📹 Ramp 1 Incline Intersection CAM #02</option>
            <option value="CAM-CRUSH-03">📹 Gyratory Crusher Pocket CAM #03</option>
          </select>

          <button
            onClick={() => setInjectViolation(!injectViolation)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              injectViolation
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {injectViolation ? '⚠️ PPE Violation Active' : 'Inject PPE Violation'}
          </button>

          <button
            onClick={() => setInjectSmoke(!injectSmoke)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              injectSmoke
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {injectSmoke ? '🔥 Smoke Alert Active' : 'Inject Smoke'}
          </button>
        </div>
      </div>

      {/* Main Vision Canvas & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-2">
          <canvas
            ref={canvasRef}
            width={880}
            height={495}
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Vision Analytics Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-400" /> Live Detection Analytics
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Personnel Detected:</span>
              <span className="font-bold text-slate-100 font-mono text-sm">{frameData?.total_persons || 0}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Machinery Units:</span>
              <span className="font-bold text-slate-100 font-mono text-sm">{frameData?.total_vehicles || 0}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">PPE Compliance:</span>
              <span
                className={`font-bold font-mono text-sm ${
                  (frameData?.ppe_compliance_rate_pct || 100) < 100 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {frameData?.ppe_compliance_rate_pct}%
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Hazard Anomaly:</span>
              <span
                className={`font-bold font-mono text-xs ${
                  frameData?.hazard_detected ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {frameData?.hazard_detected ? 'HAZARD TRIGGERED' : 'CLEAR'}
              </span>
            </div>

            {frameData?.hazard_description && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-xs">
                ⚠️ {frameData.hazard_description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
