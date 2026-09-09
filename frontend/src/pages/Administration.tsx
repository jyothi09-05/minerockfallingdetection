import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  Sliders,
  Bell,
  Database,
  CheckCircle2,
  Key,
  Lock,
  RefreshCw
} from 'lucide-react';

export const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'RBAC' | 'THRESHOLDS' | 'SIMULATION' | 'NOTIFICATIONS'>('RBAC');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <Settings className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Enterprise System Administration</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">
                SECURITY & CONFIGURATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Role-Based Access Control &bull; Alert Thresholds &bull; Simulation Parameters &bull; Notifications
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
        >
          {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Settings className="w-4 h-4" />}
          {savedSuccess ? 'Settings Saved' : 'Save System Config'}
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-[#0B0F17] border border-slate-800 rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab('RBAC')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'RBAC' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          👥 Users & RBAC Roles
        </button>
        <button
          onClick={() => setActiveTab('THRESHOLDS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'THRESHOLDS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎛️ Safety Thresholds
        </button>
        <button
          onClick={() => setActiveTab('SIMULATION')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'SIMULATION' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🕹️ Digital Twin Simulation Tuning
        </button>
        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'NOTIFICATIONS' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🔔 Broadcast & Alerts
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        {activeTab === 'RBAC' && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Role-Based Access Control (RBAC) Policies</h2>
            <div className="space-y-2">
              {[
                { role: 'SYSTEM_ADMIN', desc: 'Full unrestricted platform configuration, user provisioning, and audit access.', count: 2 },
                { role: 'MINE_MANAGER', desc: 'Operational control room oversight, report sign-off, and emergency declaration.', count: 4 },
                { role: 'SAFETY_OFFICER', desc: 'TARP escalation, hazard investigation, biometric tracking, and evacuation triggers.', count: 6 },
                { role: 'DISPATCHER', desc: 'Vehicle speed monitoring, truck-shovel routing, and radio communication clearance.', count: 8 },
                { role: 'GEOTECHNICAL_LEAD', desc: 'Radar interferometry tuning, highwall slope models, and bore-hole dewatering.', count: 3 }
              ].map((r, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-300">{r.role}</span>
                    <p className="text-slate-400 mt-0.5">{r.desc}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300 font-mono font-semibold">{r.count} Active Users</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'THRESHOLDS' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">TARP Trigger & Sensor Alert Thresholds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-emerald-400">Geotechnical Radar InSAR Velocity</div>
                <div>
                  <label className="block text-slate-400 mb-1">TARP Yellow Advisory Limit (mm/day)</label>
                  <input type="number" defaultValue={5.0} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">TARP Red Evacuation Limit (mm/day)</label>
                  <input type="number" defaultValue={15.0} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="font-bold text-cyan-400">Mobile Fleet & Tire TKPH Limit</div>
                <div>
                  <label className="block text-slate-400 mb-1">CAT 797F Speed Throttle Threshold (TKPH)</label>
                  <input type="number" defaultValue={650} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Brake Cooling Oil Alarm Temp (°C)</label>
                  <input type="number" defaultValue={120} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SIMULATION' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Digital Twin Multi-Agent Physics Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Autonomous Haul Speed Multiplier</div>
                <input type="number" defaultValue={1.0} step={0.1} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Weather Infiltration Rate (mm/h)</div>
                <input type="number" defaultValue={2.5} step={0.5} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-slate-400 mb-1">Worker Fatigue Accumulation Factor</div>
                <input type="number" defaultValue={1.2} step={0.1} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4 text-xs">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Control Room Audio & Dispatch Integrations</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-emerald-500 rounded" />
                <div>
                  <span className="font-semibold text-white">Automated VHF Channel 4 Dispatch Override Broadcasts</span>
                  <p className="text-slate-400 text-[11px]">Triggers spoken alert synthesis directly across heavy equipment cabin transceivers.</p>
                </div>
              </label>
              <label className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-emerald-500 rounded" />
                <div>
                  <span className="font-semibold text-white">Emergency Siren Interlock Activation</span>
                  <p className="text-slate-400 text-[11px]">Enables automatic high-low tone siren broadcast upon TARP Level 3/4 detection.</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
