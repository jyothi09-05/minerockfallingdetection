import React, { useState } from 'react';
import { Settings as SettingsIcon, Server, Database, ShieldAlert, Cpu, HardDrive } from 'lucide-react';

export const Settings: React.FC = () => {
  const [telemetryRate, setTelemetryRate] = useState(5);
  const [autoAck, setAutoAck] = useState(false);
  const [offlineSync, setOfflineSync] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
          SYSTEM PARAMETERS & OFFLINE STORAGE
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          AIR-GAPPED HARDWARE PROFILE, LOCAL RETENTION & EDGE INFERENCE INTERVALS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telemetry Node Configuration */}
        <div className="bg-[#121824] border border-mine-border rounded-xl p-6 shadow-industrial">
          <div className="flex items-center space-x-2 pb-4 border-b border-mine-border mb-4">
            <Server className="w-5 h-5 text-mine-amber" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              ON-PREMISE EDGE GATEWAY
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Telemetry Sampling Interval (Seconds)
              </label>
              <input
                type="number"
                value={telemetryRate}
                onChange={(e) => setTelemetryRate(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0B0F17] border border-mine-border rounded-lg">
              <div>
                <div className="text-xs font-bold text-slate-200">Offline Air-Gapped Mode</div>
                <div className="text-[10px] text-slate-400">Zero external cloud telemetry dispatch</div>
              </div>
              <input
                type="checkbox"
                checked={offlineSync}
                onChange={(e) => setOfflineSync(e.target.checked)}
                className="w-4 h-4 accent-mine-amber"
              />
            </div>
          </div>
        </div>

        {/* Local Storage & Cache */}
        <div className="bg-[#121824] border border-mine-border rounded-xl p-6 shadow-industrial">
          <div className="flex items-center space-x-2 pb-4 border-b border-mine-border mb-4">
            <HardDrive className="w-5 h-5 text-mine-cyan" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              LOCAL VOLUME STORAGE
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs text-slate-300">
            <div className="flex justify-between py-2 border-b border-mine-border/60">
              <span className="text-slate-400">PostgreSQL Schema:</span>
              <span className="text-slate-100 font-bold">16.3-alpine (Normalized)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-mine-border/60">
              <span className="text-slate-400">Redis Cache Allocation:</span>
              <span className="text-slate-100 font-bold">2.0 GB Allocated</span>
            </div>
            <div className="flex justify-between py-2 border-b border-mine-border/60">
              <span className="text-slate-400">Local Vector Embeddings Path:</span>
              <span className="text-mine-amber">./data/models/faiss</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Telemetry Log Path:</span>
              <span className="text-mine-amber">./data/telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
