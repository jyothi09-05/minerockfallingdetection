import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  TerrainMetadata,
  VehicleSimState,
  WorkerSimState,
  SensorSimState,
  Position3D,
} from '../../types/simulation';
import { Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface MineCanvas2DProps {
  terrain: TerrainMetadata;
  vehicles: VehicleSimState[];
  workers: WorkerSimState[];
  sensors: SensorSimState[];
  selectedEntityId?: string | null;
  onSelectEntity: (type: 'vehicle' | 'worker' | 'sensor' | 'bench', id: string) => void;
  layers: {
    benches: boolean;
    roads: boolean;
    vehicles: boolean;
    workers: boolean;
    sensors: boolean;
    heatmap: boolean;
  };
}

export const MineCanvas2D: React.FC<MineCanvas2DProps> = ({
  terrain,
  vehicles,
  workers,
  sensors,
  selectedEntityId,
  onSelectEntity,
  layers,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pan & Zoom state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1.4);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetView = () => {
    setOffset({ x: 0, y: 0 });
    setScale(1.4);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setScale((prev) => Math.min(4.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Convert world coordinates (x, z in meters) to canvas pixel coordinates
  const worldToCanvas = useCallback(
    (x: number, z: number, canvasWidth: number, canvasHeight: number) => {
      const centerX = canvasWidth / 2 + offset.x;
      const centerY = canvasHeight / 2 + offset.y;
      return {
        x: centerX + x * scale,
        y: centerY + z * scale,
      };
    },
    [offset, scale]
  );

  // Convert canvas pixel coordinates to world coordinates
  const canvasToWorld = useCallback(
    (px: number, py: number, canvasWidth: number, canvasHeight: number) => {
      const centerX = canvasWidth / 2 + offset.x;
      const centerY = canvasHeight / 2 + offset.y;
      return {
        x: (px - centerX) / scale,
        z: (py - centerY) / scale,
      };
    },
    [offset, scale]
  );

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const world = canvasToWorld(clickX, clickY, canvas.width, canvas.height);

    // Hit test vehicles (radius 15m)
    for (const v of vehicles) {
      const dx = v.position.x - world.x;
      const dz = v.position.z - world.z;
      if (Math.sqrt(dx * dx + dz * dz) < 18 / scale) {
        onSelectEntity('vehicle', v.id);
        return;
      }
    }

    // Hit test sensors (radius 12m)
    for (const s of sensors) {
      const dx = s.position.x - world.x;
      const dz = s.position.z - world.z;
      if (Math.sqrt(dx * dx + dz * dz) < 16 / scale) {
        onSelectEntity('sensor', s.id);
        return;
      }
    }

    // Hit test workers (radius 10m)
    for (const w of workers) {
      const dx = w.position.x - world.x;
      const dz = w.position.z - world.z;
      if (Math.sqrt(dx * dx + dz * dz) < 14 / scale) {
        onSelectEntity('worker', w.id);
        return;
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear Dark Tactical Control Room Background
      ctx.fillStyle = '#090D16';
      ctx.fillRect(0, 0, w, h);

      // Draw Grid Lines (100m world grid)
      ctx.strokeStyle = '#141D2E';
      ctx.lineWidth = 1;
      const gridSize = 100 * scale;
      const startX = (w / 2 + offset.x) % gridSize;
      const startY = (h / 2 + offset.y) % gridSize;

      for (let x = startX; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = startY; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 1. Draw Stepped Pit Benches
      if (layers.benches && terrain.benches) {
        const pitCenter = worldToCanvas(0, 0, w, h);
        const maxRadius = 180 * scale;

        terrain.benches.forEach((bench, i) => {
          const radius = maxRadius * (1 - (i * 0.14));
          const benchColors = ['#1E293B', '#273549', '#334155', '#475569', '#523E28', '#633B18'];
          const color = benchColors[i % benchColors.length];

          ctx.beginPath();
          ctx.ellipse(pitCenter.x, pitCenter.y, radius, radius * 0.75, 0, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#475569';
          ctx.stroke();

          // Bench elevation label
          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px Inter, monospace';
          ctx.fillText(`${bench.elevationM}m`, pitCenter.x + radius - 28, pitCenter.y - 4);
        });
      }

      // 2. Draw Hazard Heatmap Overlay
      if (layers.heatmap) {
        const blastCenter = worldToCanvas(-80, 40, w, h);
        const gradient = ctx.createRadialGradient(
          blastCenter.x,
          blastCenter.y,
          5,
          blastCenter.x,
          blastCenter.y,
          60 * scale
        );
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
        gradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blastCenter.x, blastCenter.y, 60 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Draw Roads and Waypoints
      if (layers.roads && terrain.roads) {
        const wpMap = new Map<string, Position3D>();
        terrain.waypoints.forEach((wp) => wpMap.set(wp.id, wp.position));

        ctx.strokeStyle = '#EAB308';
        ctx.lineWidth = 4 * Math.max(0.7, scale * 0.5);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        terrain.roads.forEach((road) => {
          const p1 = wpMap.get(road.startWaypointId);
          const p2 = wpMap.get(road.endWaypointId);
          if (p1 && p2) {
            const c1 = worldToCanvas(p1.x, p1.z, w, h);
            const c2 = worldToCanvas(p2.x, p2.z, w, h);
            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.stroke();
          }
        });

        // Waypoint nodes
        terrain.waypoints.forEach((wp) => {
          const c = worldToCanvas(wp.position.x, wp.position.z, w, h);
          ctx.fillStyle = wp.type === 'CRUSHER' ? '#EF4444' : wp.type === 'DUMP_POINT' ? '#F59E0B' : '#38BDF8';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 5 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Waypoint Name Label
          ctx.fillStyle = '#E2E8F0';
          ctx.font = 'bold 9px Inter, sans-serif';
          ctx.fillText(wp.name.slice(0, 14), c.x + 8, c.y + 3);
        });
      }

      // 4. Draw Sensors with pulsating radar circles
      if (layers.sensors) {
        sensors.forEach((s) => {
          const c = worldToCanvas(s.position.x, s.position.z, w, h);
          const isSelected = selectedEntityId === s.id;
          const isCrit = s.status === 'CRITICAL';
          const isWarn = s.status === 'WARNING';

          const color = isCrit ? '#EF4444' : isWarn ? '#F59E0B' : '#10B981';

          // Pulse circle
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const pulseR = 8 * scale + (isCrit ? Math.sin(Date.now() * 0.008) * 6 : 0);
          ctx.arc(c.x, c.y, pulseR, 0, Math.PI * 2);
          ctx.stroke();

          // Core sensor dot
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(c.x, c.y, isSelected ? 6 * scale : 4 * scale, 0, Math.PI * 2);
          ctx.fill();

          // Sensor code and value badge
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(c.x + 6, c.y - 14, 55, 12);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.strokeRect(c.x + 6, c.y - 14, 55, 12);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 8px monospace';
          ctx.fillText(`${s.currentValue} ${s.unit}`, c.x + 8, c.y - 5);
        });
      }

      // 5. Draw Workers
      if (layers.workers) {
        workers.forEach((wObj) => {
          const c = worldToCanvas(wObj.position.x, wObj.position.z, w, h);
          const isSelected = selectedEntityId === wObj.id;

          ctx.fillStyle = '#38BDF8';
          ctx.beginPath();
          ctx.arc(c.x, c.y, isSelected ? 5 * scale : 3 * scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // 6. Draw Mining Fleet Vehicles
      if (layers.vehicles) {
        vehicles.forEach((v) => {
          const c = worldToCanvas(v.position.x, v.position.z, w, h);
          const isSelected = selectedEntityId === v.id;
          const isLoaded = v.state === 'HAULING_LOADED';

          // Selection Halo
          if (isSelected) {
            ctx.strokeStyle = '#38BDF8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(c.x, c.y, 14 * scale, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Vehicle Body Rectangle with heading rotation
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((v.headingDeg * Math.PI) / 180);

          const bodyColor = v.type === 'EXCAVATOR' ? '#EC4899' : isLoaded ? '#06B6D4' : '#EAB308';
          ctx.fillStyle = bodyColor;
          ctx.fillRect(-6 * scale, -9 * scale, 12 * scale, 18 * scale);

          // Cab window / direction indicator
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(-4 * scale, 3 * scale, 8 * scale, 4 * scale);

          ctx.restore();

          // Vehicle code label
          ctx.fillStyle = '#F8FAFC';
          ctx.font = 'bold 10px Inter, monospace';
          ctx.fillText(v.code, c.x + 10, c.y + 4);

          // Payload & Speed indicator
          ctx.fillStyle = '#94A3B8';
          ctx.font = '9px monospace';
          const speedStr = `${(v.velocityMs * 3.6).toFixed(0)} km/h`;
          const loadStr = isLoaded ? `${v.payloadTonnes.toFixed(0)}t` : 'EMPTY';
          ctx.fillText(`${speedStr} • ${loadStr}`, c.x + 10, c.y + 15);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [terrain, vehicles, workers, sensors, selectedEntityId, layers, offset, scale, worldToCanvas]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 select-none">
      {/* 2D Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Floating Canvas Controls Overlay */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-xl">
        <button
          onClick={() => setScale((s) => Math.min(4.5, s * 1.2))}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.4, s * 0.8))}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center space-x-4">
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
          <span>Haul Truck (Empty)</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-cyan-400 rounded-sm" />
          <span>Haul Truck (Loaded)</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-pink-500 rounded-sm" />
          <span>Excavator</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span>Sensor</span>
        </span>
      </div>
    </div>
  );
};
