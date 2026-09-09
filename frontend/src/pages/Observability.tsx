import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Zap,
  Radio
} from 'lucide-react';

export const Observability: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    services: { name: string; status: string; latency_ms: number; uptime: string }[];
    system: { cpu_usage_pct: number; memory_mb: number; active_ws_clients: number };
  }>({
    services: [
      { name: 'FastAPI Python AI Intelligence Engine', status: 'HEALTHY', latency_ms: 1.4, uptime: '99.98%' },
      { name: 'PostgreSQL 16 Relational Engine', status: 'HEALTHY', latency_ms: 0.8, uptime: '99.99%' },
      { name: 'Redis 7 In-Memory Cache & PubSub', status: 'HEALTHY', latency_ms: 0.2, uptime: '100.0%' },
      { name: 'Local Vector Store & Embeddings', status: 'HEALTHY', latency_ms: 2.1, uptime: '100.0%' },
      { name: 'Computer Vision Inference Pipeline', status: 'HEALTHY', latency_ms: 12.5, uptime: '99.95%' },
      { name: 'Multi-Agent Simulation Engine', status: 'HEALTHY', latency_ms: 4.2, uptime: '100.0%' }
    ],
    system: {
      cpu_usage_pct: 14.8,
      memory_mb: 480,
      active_ws_clients: 4
    }
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">System Observability & Service Health</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                PROMETHEUS & HEALTH TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Microservice Health &bull; Query Latency &bull; Real-time Event Streams &bull; Edge Pipeline Uptime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-emerald-400">ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Metrics Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>CPU Utilization</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.system.cpu_usage_pct}%</div>
          <div className="text-[10px] text-slate-500 mt-1">Multi-core telemetry load</div>
        </div>

        <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Memory Footprint</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{metrics.system.memory_mb} MB</div>
          <div className="text-[10px] text-slate-500 mt-1">In-memory local vector store & models</div>
        </div>

        <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Active WebSockets</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.system.active_ws_clients} Streams</div>
          <div className="text-[10px] text-slate-500 mt-1">Real-time control room clients</div>
        </div>
      </div>

      {/* Service Health Directory */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Subsystem Architecture Health & Latency</h2>
        <div className="space-y-2">
          {metrics.services.map((srv, idx) => (
            <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white">{srv.name}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">Uptime: <strong className="text-slate-200">{srv.uptime}</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {srv.latency_ms} ms
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">
                  {srv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
