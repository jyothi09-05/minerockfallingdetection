import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Activity,
  Truck,
  Users,
  Mountain,
  Gauge,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  Bot,
  Layers,
  Search,
  Radio,
  Sliders,
  ChevronRight,
  Maximize2,
  Box
} from 'lucide-react';
import { ClientSimulationEngine } from '../services/simulationEngine';
import { MineCanvas2D } from '../components/digitaltwin/MineCanvas2D';
import { MineScene3D } from '../components/digitaltwin/MineScene3D';
import { EntityInspector } from '../components/digitaltwin/EntityInspector';
import { SimulationStateSnapshot } from '../types/simulation';
import { aiService } from '../services/aiService';
import { assistantService } from '../services/assistantService';
import { incidentService } from '../services/incidentService';
import { emergencyService } from '../services/emergencyService';
import { GlobalMineRiskResponse, SmartAlert } from '../types/ai';
import { Incident } from '../types/incidents';
import { SimulatedEmergency } from '../types/emergency';

export const UnifiedCommandCenter: React.FC = () => {
  const simEngineRef = useRef<ClientSimulationEngine>(new ClientSimulationEngine(42));
  const [snapshot, setSnapshot] = useState<SimulationStateSnapshot>(() =>
    simEngineRef.current.getSnapshot()
  );

  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [globalRisk, setGlobalRisk] = useState<GlobalMineRiskResponse | null>(null);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeEmergencies, setActiveEmergencies] = useState<SimulatedEmergency[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'vehicle' | 'worker' | 'sensor' | 'bench';
    id: string;
  } | null>(null);

  const [assistantDrawerOpen, setAssistantDrawerOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [assistantResponse, setAssistantResponse] = useState<string | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);

  // Active Layer Toggles
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

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [risk, smartAlerts, incList, emergList] = await Promise.all([
        aiService.getGlobalRisk(),
        aiService.getSmartAlerts(),
        incidentService.listIncidents(),
        emergencyService.getActiveEmergencies()
      ]);
      setGlobalRisk(risk);
      setAlerts(smartAlerts);
      setIncidents(incList);
      setActiveEmergencies(emergList);
    } catch {
      // offline local mode handled inside services
    }
  };

  const handleAskAssistant = async () => {
    if (!assistantQuery.trim() || assistantLoading) return;
    setAssistantLoading(true);
    try {
      const res = await assistantService.sendChatMessage(assistantQuery, 'safety_officer');
      setAssistantResponse(res.response);
    } catch {
      setAssistantResponse('Local assistant offline.');
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleSelectEntity = (type: 'vehicle' | 'worker' | 'sensor' | 'bench', id: string) => {
    setSelectedEntity({ type, id });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-hidden">
      {/* Top Mission HUD Strip */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">UNIFIED OPERATIONS COMMAND CENTER</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                LIVE DIGITAL TWIN
              </span>
              {activeEmergencies.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50 rounded-full animate-bounce">
                  🚨 {activeEmergencies.length} EMERGENCY ACTIVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Pit #1 Copper-Gold &bull; Real-Time Telemetry &bull; Grounded Geotechnical Safety Engine
            </p>
          </div>
        </div>

        {/* Global Key Metrics Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">Mine Risk Index</div>
              <div className="font-bold text-emerald-300">{globalRisk?.overall_mine_risk_score ?? '0.28'} (LOW)</div>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400">Fleet Active</div>
              <div className="font-bold text-white">{snapshot.vehicles.length} Units</div>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">Personnel</div>
              <div className="font-bold text-white">{snapshot.workers.length} On Shift</div>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[10px] text-slate-400">Active Alerts</div>
              <div className="font-bold text-rose-400">{alerts.length} Warnings</div>
            </div>
          </div>
        </div>

        {/* View Switcher & AI Assistant Drawer Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === '2D' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Map
            </button>
            <button
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === '3D' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Twin
            </button>
          </div>

          <button
            onClick={() => setAssistantDrawerOpen(!assistantDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium transition"
          >
            <Bot className="w-4 h-4" />
            AI Copilot
          </button>
        </div>
      </div>

      {/* Main Grid: Left Digital Twin (70%), Right Live Operations Stream (30%) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Digital Twin Canvas */}
        <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800 rounded-xl flex flex-col relative overflow-hidden shadow-inner">
          {/* Canvas Render Area */}
          <div className="flex-1 w-full h-full relative">
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
        </div>

        {/* Right Column: Live Triage, Alerts & Incident Feed */}
        <div className="lg:col-span-4 flex flex-col gap-3 overflow-hidden">
          {/* Selected Entity Inspector or Quick Summary */}
          {selectedEntity ? (
            <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3 shadow-lg">
              <EntityInspector
                entityType={selectedEntity.type}
                entityId={selectedEntity.id}
                vehicles={snapshot.vehicles}
                workers={snapshot.workers}
                sensors={snapshot.sensors}
                benches={simEngineRef.current.terrain.benches}
                onClose={() => setSelectedEntity(null)}
              />
            </div>
          ) : (
            <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-3 shadow-lg flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-200">Active High-Risk Zones</div>
                <div className="text-[11px] text-amber-400 mt-0.5">North Highwall: FoS = 1.24 &bull; 3.8 mm/day</div>
              </div>
              <Mountain className="w-5 h-5 text-amber-400" />
            </div>
          )}

          {/* Active Incidents Stream */}
          <div className="flex-1 bg-[#0B0F17] border border-slate-800 rounded-xl p-3 flex flex-col overflow-hidden shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Active Incidents ({incidents.length})</span>
              </div>
              <span className="text-[10px] text-slate-400">7-Stage Lifecycle</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-2.5 bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-lg text-xs space-y-1 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[180px]">{inc.title}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 rounded">
                      {inc.stage}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Zone: {inc.zone_name}</span>
                    <span className="text-rose-400 font-semibold">{inc.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Alerts Stream */}
          <div className="h-44 bg-[#0B0F17] border border-slate-800 rounded-xl p-3 flex flex-col overflow-hidden shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Smart Safety Alerts</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">TARP Engine</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-2 bg-slate-900/60 border border-slate-800/60 rounded-lg text-[11px] flex items-start gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-200">{alt.title}</div>
                    <div className="text-[10px] text-slate-400">{alt.description} &bull; {alt.source_model}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over AI Assistant Copilot Drawer */}
      {assistantDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0B0F17] border-l border-slate-800 shadow-2xl z-50 flex flex-col p-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Mining AI Copilot</h2>
            </div>
            <button
              onClick={() => setAssistantDrawerOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto my-3 text-xs leading-relaxed text-slate-300 space-y-3 whitespace-pre-wrap">
            {assistantResponse ? (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                {assistantResponse}
              </div>
            ) : (
              <div className="text-slate-500 italic p-4 text-center">
                Ask any operational question or inquiry regarding current pit status, slope factor of safety, or blast exclusion zones.
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 flex gap-2">
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
              placeholder="Ask AI Copilot..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={handleAskAssistant}
              disabled={assistantLoading}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium"
            >
              {assistantLoading ? '...' : 'Ask'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
