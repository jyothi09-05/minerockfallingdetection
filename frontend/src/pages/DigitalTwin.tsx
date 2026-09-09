import React, { useState, useEffect, useRef } from 'react';
import { ClientSimulationEngine } from '../services/simulationEngine';
import { MineCanvas2D } from '../components/digitaltwin/MineCanvas2D';
import { MineScene3D } from '../components/digitaltwin/MineScene3D';
import { SimulationControls } from '../components/digitaltwin/SimulationControls';
import { EntityInspector } from '../components/digitaltwin/EntityInspector';
import {
  SimulationStateSnapshot,
  SimulationScenario,
} from '../types/simulation';
import {
  Layers,
  Eye,
  Box,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  CloudRain,
  Sun,
  Activity,
  Zap,
} from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const simEngineRef = useRef<ClientSimulationEngine>(new ClientSimulationEngine(42));
  const [snapshot, setSnapshot] = useState<SimulationStateSnapshot>(() =>
    simEngineRef.current.getSnapshot()
  );

  // View Mode: '2D' or '3D'
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');

  // Layer Toggles
  const [layers, setLayers] = useState({
    benches: true,
    roads: true,
    vehicles: true,
    workers: true,
    sensors: true,
    heatmap: true,
    weatherParticles: true,
    wireframe: false,
  });

  // Entity Selection for Inspector
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'vehicle' | 'worker' | 'sensor' | 'bench';
    id: string;
  } | null>(null);

  // Simulation Animation / Tick Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const updatedSnap = simEngineRef.current.tick(dt > 0 ? Math.min(dt, 0.1) : 0.016);
      setSnapshot({ ...updatedSnap });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleTogglePlay = () => {
    const running = !snapshot.isRunning;
    simEngineRef.current.setRunning(running);
    setSnapshot(simEngineRef.current.getSnapshot());
  };

  const handleStep = () => {
    const snap = simEngineRef.current.tick(0.5);
    setSnapshot({ ...snap });
  };

  const handleReset = () => {
    simEngineRef.current.reset();
    setSnapshot(simEngineRef.current.getSnapshot());
  };

  const handleChangeSpeed = (speed: number) => {
    simEngineRef.current.setSpeedMultiplier(speed);
    setSnapshot(simEngineRef.current.getSnapshot());
  };

  const handleChangeScenario = (scenario: SimulationScenario) => {
    simEngineRef.current.setScenario(scenario);
    setSnapshot(simEngineRef.current.getSnapshot());
  };

  const handleChangeSeed = (seed: number) => {
    simEngineRef.current.reset(seed);
    setSnapshot(simEngineRef.current.getSnapshot());
  };

  const handleSelectEntity = (type: 'vehicle' | 'worker' | 'sensor' | 'bench', id: string) => {
    setSelectedEntity({ type, id });
  };

  return (
    <div className="space-y-4 h-[calc(100vh-5rem)] flex flex-col">
      {/* Top Header & Real-time Digital Twin HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Box className="w-5 h-5 text-cyan-400" />
            Digital Twin Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Real-time physics simulation of Prometheus Pit #4 • Deterministic Seed: {snapshot.terrainSeed}
          </p>
        </div>

        {/* Real-time Status HUD Stats */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Mine Safety Index</span>
            <span
              className={`text-base font-bold font-mono ${
                snapshot.overallMineSafetyScore < 0.7
                  ? 'text-rose-400'
                  : snapshot.overallMineSafetyScore < 0.85
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {(snapshot.overallMineSafetyScore * 100).toFixed(0)}%
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Fleet Output</span>
            <span className="text-base font-bold font-mono text-cyan-400">
              {snapshot.fleetProductionRateTph.toFixed(0)} <span className="text-xs text-slate-400">TPH</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Incidents</span>
            <span
              className={`text-base font-bold font-mono ${
                snapshot.activeIncidentsCount > 0 ? 'text-rose-400' : 'text-slate-300'
              }`}
            >
              {snapshot.activeIncidentsCount}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Microclimate</span>
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1 justify-end">
              {snapshot.weather.condition === 'HEAVY_STORM' ? (
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              {snapshot.weather.ambientTempC}°C
            </span>
          </div>

          {/* 2D / 3D Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === '2D' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Tactical
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === '3D' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D WebGL
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport & Layer Controls */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Layer Controls Bar (Floating Left) */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl space-y-2 text-xs">
          <p className="font-semibold text-slate-200 flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Layer Visibility
          </p>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={layers.benches}
              onChange={(e) => setLayers({ ...layers, benches: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Benches & Topography</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={layers.roads}
              onChange={(e) => setLayers({ ...layers, roads: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Haul Road Network</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={layers.vehicles}
              onChange={(e) => setLayers({ ...layers, vehicles: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Haul Fleet ({snapshot.vehicles.length})</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={layers.sensors}
              onChange={(e) => setLayers({ ...layers, sensors: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Sensors & Radar ({snapshot.sensors.length})</span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={layers.workers}
              onChange={(e) => setLayers({ ...layers, workers: e.target.checked })}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Workers ({snapshot.workers.length})</span>
          </label>
          {viewMode === '2D' ? (
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={layers.heatmap}
                onChange={(e) => setLayers({ ...layers, heatmap: e.target.checked })}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Hazard Heatmap</span>
            </label>
          ) : (
            <>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.weatherParticles}
                  onChange={(e) => setLayers({ ...layers, weatherParticles: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Weather FX Particles</span>
              </label>
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.wireframe}
                  onChange={(e) => setLayers({ ...layers, wireframe: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Wireframe Mesh</span>
              </label>
            </>
          )}
        </div>

        {/* Viewport Canvas (2D or 3D) */}
        <div className="flex-1 h-full min-h-0">
          {viewMode === '2D' ? (
            <MineCanvas2D
              terrain={simEngineRef.current.terrain}
              vehicles={snapshot.vehicles}
              workers={snapshot.workers}
              sensors={snapshot.sensors}
              selectedEntityId={selectedEntity?.id}
              onSelectEntity={handleSelectEntity}
              layers={layers}
            />
          ) : (
            <MineScene3D
              terrain={simEngineRef.current.terrain}
              vehicles={snapshot.vehicles}
              workers={snapshot.workers}
              sensors={snapshot.sensors}
              weather={snapshot.weather}
              selectedEntityId={selectedEntity?.id}
              onSelectEntity={handleSelectEntity}
              layers={layers}
            />
          )}
        </div>

        {/* Selected Entity Inspector (Right Panel) */}
        {selectedEntity && (
          <EntityInspector
            entityType={selectedEntity.type}
            entityId={selectedEntity.id}
            vehicles={snapshot.vehicles}
            workers={snapshot.workers}
            sensors={snapshot.sensors}
            benches={simEngineRef.current.terrain.benches}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </div>

      {/* Simulation Controls Toolbar */}
      <SimulationControls
        isRunning={snapshot.isRunning}
        speedMultiplier={snapshot.speedMultiplier}
        scenario={snapshot.scenario}
        seed={snapshot.terrainSeed}
        simulationTimeSec={snapshot.simulationTimeSec}
        tickIndex={snapshot.tickIndex}
        onTogglePlay={handleTogglePlay}
        onStep={handleStep}
        onReset={handleReset}
        onChangeSpeed={handleChangeSpeed}
        onChangeScenario={handleChangeScenario}
        onChangeSeed={handleChangeSeed}
      />
    </div>
  );
};
