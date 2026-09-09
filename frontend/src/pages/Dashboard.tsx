import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MineStats, Alert, Equipment, Zone } from '../types';
import { StatCard } from '../components/common/StatCard';
import { AlertBanner } from '../components/common/AlertBanner';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  MapPin, 
  Truck, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Compass, 
  Activity,
  Radio,
  Gauge
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [stats, setStats] = useState<MineStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const [sData, aData, eData, zData] = await Promise.all([
        api.getMineStats(),
        api.getAlerts(selectedMineId),
        api.getEquipment(selectedMineId),
        api.getZones(selectedMineId)
      ]);
      setStats(sData);
      setAlerts(aData);
      setEquipment(eData);
      setZones(zData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    const timer = setInterval(loadDashboard, 6000);
    return () => clearInterval(timer);
  }, [selectedMineId]);

  const handleAcknowledge = async (id: string) => {
    await api.acknowledgeAlert(id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isAcknowledged: true } : a));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100 flex items-center space-x-2">
            <span>OPERATIONAL COMMAND CENTER</span>
            <span className="w-2 h-2 rounded-full bg-mine-emerald animate-ping"></span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            REAL-TIME MINE SITE TELEMETRY & SPATIAL DIGITAL TWIN MESH
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-lg bg-mine-surface border border-mine-border text-xs font-mono text-slate-300">
            SYNC: <span className="text-mine-emerald font-bold">100% AIR-GAPPED</span>
          </span>
        </div>
      </div>

      {/* Critical Active Alerts Bar */}
      {alerts.filter(a => !a.isResolved).length > 0 && (
        <div className="space-y-2.5">
          {alerts.filter(a => !a.isResolved).map(alert => (
            <AlertBanner
              key={alert.id}
              level={alert.level}
              title={alert.title}
              message={alert.message}
              isAcknowledged={alert.isAcknowledged}
              onAcknowledge={() => handleAcknowledge(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Pit Sectors"
          value={stats?.totalZones || 5}
          subtitle="All zones clear of hazardous methane"
          icon={Layers}
          variant="amber"
          trend="+2 benches"
        />
        <StatCard
          title="Haulage & Shovel Fleet"
          value={stats?.operationalFleet || 18}
          subtitle="94% overall equipment efficiency"
          icon={Truck}
          variant="cyan"
          trend="94% OEE"
        />
        <StatCard
          title="Personnel On Site"
          value={stats?.activeWorkers || 34}
          subtitle="100% biometric check-in verified"
          icon={Users}
          variant="emerald"
          trend="0 SOS"
        />
        <StatCard
          title="Safety Index Score"
          value={`${stats?.averageSafetyScore || 98.4}%`}
          subtitle="Zero lost time injuries in 184 days"
          icon={ShieldCheck}
          variant="emerald"
          trend="GRADE A+"
        />
      </div>

      {/* Digital Twin Map / Radar Visualization & Live Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar & Spatial Grid View (2 cols) */}
        <div className="lg:col-span-2 bg-[#121824] border border-mine-border rounded-xl p-5 shadow-industrial">
          <div className="flex items-center justify-between pb-4 border-b border-mine-border mb-4">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-mine-amber" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                PROMETHEUS PIT #4 — SPATIAL RADAR & ASSET MESH
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-black/40 px-2.5 py-1 rounded border border-mine-border">
              LAT: -21.4532 | LON: 119.8214
            </span>
          </div>

          {/* Interactive Radar Arena */}
          <div className="relative h-80 rounded-lg bg-[#070A0F] border border-mine-border/80 overflow-hidden flex items-center justify-center">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#222F46_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
            
            {/* Radar Concentric Rings */}
            <div className="absolute w-72 h-72 rounded-full border border-mine-border/50"></div>
            <div className="absolute w-52 h-52 rounded-full border border-mine-border/40"></div>
            <div className="absolute w-32 h-32 rounded-full border border-mine-amber/30"></div>
            
            {/* Radar Sweep Animation */}
            <div className="absolute w-72 h-72 rounded-full border-t-2 border-mine-amber/60 radar-sweep pointer-events-none opacity-40"></div>

            {/* Pit Sectors Markers */}
            <div className="absolute top-12 left-16 p-2 rounded bg-blue-950/70 border border-blue-600/60 text-[10px] font-mono text-blue-300">
              <div className="font-bold">SECTOR ALPHA</div>
              <div className="text-[8px] text-slate-400">Bench 450 - Active Shovel</div>
            </div>

            <div className="absolute bottom-12 right-20 p-2 rounded bg-emerald-950/70 border border-emerald-600/60 text-[10px] font-mono text-emerald-300">
              <div className="font-bold">CRUSHER HUB</div>
              <div className="text-[8px] text-slate-400">4,500 TPH Throughput</div>
            </div>

            <div className="absolute top-16 right-16 p-2 rounded bg-red-950/70 border border-red-600/60 text-[10px] font-mono text-red-300 animate-pulse">
              <div className="font-bold">TAILINGS DAM</div>
              <div className="text-[8px] text-slate-400">Piezometer: 14.2m (Normal)</div>
            </div>

            {/* Haul Truck Live Position Icons */}
            <div className="absolute top-36 left-48 flex items-center space-x-1 bg-amber-950/90 border border-mine-amber px-2 py-1 rounded text-[10px] font-mono text-amber-300 shadow-amber-glow animate-bounce">
              <Truck className="w-3.5 h-3.5 text-mine-amber" />
              <span>EQ-TRK-101 (32 km/h)</span>
            </div>

            <div className="absolute bottom-28 left-64 flex items-center space-x-1 bg-cyan-950/90 border border-mine-cyan px-2 py-1 rounded text-[10px] font-mono text-cyan-300">
              <Truck className="w-3.5 h-3.5 text-mine-cyan" />
              <span>EQ-TRK-102 (Loading)</span>
            </div>
          </div>
        </div>

        {/* Live Environmental & Atmospheric Radar (1 col) */}
        <div className="bg-[#121824] border border-mine-border rounded-xl p-5 shadow-industrial flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-mine-border mb-4">
              <Activity className="w-5 h-5 text-mine-cyan" />
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                TELEMETRY TELEMETRY HEALTH
              </h3>
            </div>

            <div className="space-y-4">
              {/* Atmospheric Gas */}
              <div className="p-3 bg-[#0B0F17] border border-mine-border rounded-lg">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Methane (CH4) Level</span>
                  <span className="text-emerald-400 font-bold">42 PPM (SAFE)</span>
                </div>
                <div className="w-full bg-mine-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[15%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0 PPM</span>
                  <span>Threshold: 500 PPM</span>
                </div>
              </div>

              {/* Slope Radar Displacement */}
              <div className="p-3 bg-[#0B0F17] border border-mine-border rounded-lg">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Slope Radar Strain</span>
                  <span className="text-amber-400 font-bold">1.8 mm / 24h</span>
                </div>
                <div className="w-full bg-mine-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[25%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Normal: &lt;5mm</span>
                  <span>Alert: &gt;12mm</span>
                </div>
              </div>

              {/* Crusher Vibration */}
              <div className="p-3 bg-[#0B0F17] border border-mine-border rounded-lg">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Primary Crusher Vibration</span>
                  <span className="text-emerald-400 font-bold">4.2 mm/s</span>
                </div>
                <div className="w-full bg-mine-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[35%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-mine-border text-center">
            <span className="text-xs font-mono text-mine-amber font-semibold">
              LOCAL EDGE INFERENCE ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Fleet Live Readiness Table */}
      <div className="bg-[#121824] border border-mine-border rounded-xl p-5 shadow-industrial">
        <div className="flex items-center justify-between pb-4 border-b border-mine-border mb-4">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-mine-amber" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              HEAVY MACHINERY & HAUL FLEET TELEMETRY
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">5 Primary Units</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-mine-border text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-4 font-semibold">Asset Tag</th>
                <th className="py-2.5 px-4 font-semibold">Equipment Name</th>
                <th className="py-2.5 px-4 font-semibold">Type</th>
                <th className="py-2.5 px-4 font-semibold">Health Score</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Operating Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-border/60 text-xs text-slate-200">
              {equipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-mine-hover transition">
                  <td className="py-3 px-4 font-mono font-bold text-mine-amber">{eq.assetTag}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{eq.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{eq.type.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2 font-mono font-bold">
                      <span className={eq.healthScore > 85 ? 'text-emerald-400' : 'text-amber-400'}>
                        {eq.healthScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={eq.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{eq.operatingHours} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
