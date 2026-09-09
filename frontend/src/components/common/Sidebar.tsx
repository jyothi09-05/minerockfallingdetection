import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Layers, 
  Truck, 
  Car, 
  Users, 
  Activity, 
  ShieldCheck, 
  UserCog, 
  ScrollText, 
  Settings,
  Cpu,
  Layers3,
  BrainCircuit,
  Mountain,
  Gauge,
  Eye,
  Radio
} from 'lucide-react';

const AI_NAV_ITEMS = [
  { label: 'AI Risk Command', icon: BrainCircuit, path: '/ai-overview' },
  { label: 'Geotechnical & Rockfall', icon: Mountain, path: '/geotech-risk' },
  { label: 'Collision Avoidance', icon: Radio, path: '/collision-avoidance' },
  { label: 'Predictive Maintenance', icon: Gauge, path: '/predictive-maintenance' },
  { label: 'Worker Safety AI', icon: Users, path: '/worker-safety-ai' },
  { label: 'Computer Vision', icon: Eye, path: '/computer-vision' },
  { label: 'ML Model Registry', icon: Cpu, path: '/model-registry' },
];

const OPS_NAV_ITEMS = [
  { label: 'Operations HUD', icon: LayoutDashboard, path: '/' },
  { label: 'Digital Twin (2D/3D)', icon: Layers3, path: '/digital-twin' },
  { label: 'Simulation Studio', icon: Activity, path: '/simulation-studio' },
  { label: 'Mines Registry', icon: Map, path: '/mines' },
  { label: 'Zone Operations', icon: Layers, path: '/zones' },
  { label: 'Machinery & Fleet', icon: Truck, path: '/equipment' },
  { label: 'Vehicle Telemetry', icon: Car, path: '/vehicles' },
  { label: 'Workforce Hub', icon: Users, path: '/workers' },
  { label: 'IoT Sensors', icon: Activity, path: '/sensors' },
  { label: 'User & RBAC Access', icon: UserCog, path: '/users' },
  { label: 'Audit Trail', icon: ScrollText, path: '/audit-logs' },
  { label: 'System Settings', icon: Settings, path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0B0F17] border-r border-mine-border flex flex-col justify-between h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-mine-border space-x-3 sticky top-0 bg-[#0B0F17] z-10">
          <div className="w-9 h-9 rounded-lg bg-mine-amber/10 border border-mine-amber/30 flex items-center justify-center text-mine-amber shadow-amber-glow">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-wider text-slate-100 font-mono">
              MINEMIND<span className="text-mine-amber">.AI</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 tracking-tight">SAFETY INTELLIGENCE v3.0</div>
          </div>
        </div>

        {/* AI Intelligence Navigation Section */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <BrainCircuit className="w-3 h-3" /> AI INTELLIGENCE SUITE
          </div>
          {AI_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-mine-hover'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Operational Twin Navigation Section */}
          <div className="px-3 pt-3 pb-1 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            DIGITAL TWIN & OPERATIONS
          </div>
          {OPS_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-mine-amber text-black font-semibold shadow-amber-glow'
                    : 'text-slate-300 hover:text-white hover:bg-mine-hover'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Offline Status Footer */}
      <div className="p-4 border-t border-mine-border bg-[#070A0F]/60 m-3 rounded-lg border">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-mono text-[10px]">SYSTEM STATUS</span>
          <span className="flex items-center text-mine-emerald font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-mine-emerald mr-1 animate-pulse"></span>
            100% OFFLINE
          </span>
        </div>
        <div className="w-full bg-mine-surface h-1.5 rounded-full overflow-hidden">
          <div className="bg-mine-emerald h-full w-full"></div>
        </div>
        <div className="text-[9px] font-mono text-slate-400 mt-2 text-center">
          AIR-GAPPED MINE SITE SERVER #01
        </div>
      </div>
    </aside>
  );
};
