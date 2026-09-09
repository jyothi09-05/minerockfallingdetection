import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame,
  Waves,
  Mountain,
  Truck,
  Wrench,
  UserX,
  Wind,
  CheckCircle2,
  Navigation,
  Compass,
  FileText
} from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { SimulatedEmergency, EmergencyType } from '../types/emergency';

const SCENARIO_CARDS: { type: EmergencyType; label: string; icon: any; color: string; desc: string }[] = [
  { type: 'ROCKFALL', label: 'Highwall Rockfall', icon: Mountain, color: 'text-amber-400', desc: 'Loose boulder detachment on active bench crest' },
  { type: 'SLOPE_INSTABILITY', label: 'Slope Instability (InSAR)', icon: ShieldAlert, color: 'text-rose-400', desc: 'Critical multi-bench highwall sliding failure' },
  { type: 'FIRE', label: 'Heavy Equipment Fire', icon: Flame, color: 'text-orange-400', desc: 'Haul truck engine / hydraulic thermal breach' },
  { type: 'FLOOD', label: 'Pit Sump Flash Flood', icon: Waves, color: 'text-cyan-400', desc: 'Severe rainfall >25mm/hr pit floor inundation' },
  { type: 'VEHICLE_COLLISION', label: 'Haulway Collision Breach', icon: Truck, color: 'text-purple-400', desc: 'Blind-spot proximity hazard on active haul ramp' },
  { type: 'EQUIPMENT_FAILURE', label: 'Fixed Plant Crusher Seizure', icon: Wrench, color: 'text-blue-400', desc: 'Primary gyratory crusher eccentric thermal trip' },
  { type: 'WORKER_EMERGENCY', label: 'Worker Biometric Distress', icon: UserX, color: 'text-red-400', desc: 'Man-down / fall detected with heart rate spike' },
  { type: 'GAS_DUST_INCIDENT', label: 'Toxic Gas / Dust Outburst', icon: Wind, color: 'text-emerald-400', desc: 'Methane / respirable PM10 threshold breach' }
];

export const EmergencyResponse: React.FC = () => {
  const [activeEmergencies, setActiveEmergencies] = useState<SimulatedEmergency[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<SimulatedEmergency | null>(null);
  const [loading, setLoading] = useState(false);
  const [sirenMuted, setSirenMuted] = useState(false);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    const active = await emergencyService.getActiveEmergencies();
    setActiveEmergencies(active);
    if (active.length > 0 && !selectedEmergency) {
      setSelectedEmergency(active[0]);
    }
  };

  const handleTriggerScenario = async (type: EmergencyType) => {
    setLoading(true);
    try {
      const em = await emergencyService.triggerEmergency(type);
      setSelectedEmergency(em);
      loadEmergencies();
    } finally {
      setLoading(false);
    }
  };

  const handleResolveEmergency = async (id: string) => {
    await emergencyService.resolveEmergency(id);
    setSelectedEmergency(null);
    loadEmergencies();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <AlertOctagon className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Emergency Response & Evacuation Simulator</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                8 DISASTER SCENARIOS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live TARP Escalation &bull; Real-time Evacuation Corridors &bull; Automated Action Plans
            </p>
          </div>
        </div>

        {activeEmergencies.length > 0 && (
          <button
            onClick={() => setSirenMuted(!sirenMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              sirenMuted ? 'bg-slate-800 text-slate-400' : 'bg-rose-600 text-white animate-pulse'
            }`}
          >
            {sirenMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {sirenMuted ? 'Siren Muted' : 'Siren Active (Broadcasting)'}
          </button>
        )}
      </div>

      {/* Active Disaster Overview Banner */}
      {selectedEmergency && (
        <div className="bg-rose-950/40 border-2 border-rose-500/60 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-xl text-white shadow-lg animate-bounce">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500 text-white rounded">
                    {selectedEmergency.tarp_level}
                  </span>
                  <span className="text-xs font-mono text-rose-300">{selectedEmergency.emergency_id}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedEmergency.title}</h2>
                <p className="text-xs text-rose-200 mt-0.5">{selectedEmergency.primary_hazard}</p>
              </div>
            </div>

            <button
              onClick={() => handleResolveEmergency(selectedEmergency.emergency_id)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Declare All-Clear & Resolve
            </button>
          </div>

          {/* Evacuation Routing Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-4 rounded-xl border border-rose-500/30">
            <div>
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-1">
                <Navigation className="w-3.5 h-3.5" /> Primary Egress Route:
              </div>
              <div className="font-mono text-slate-100">{selectedEmergency.evacuation_corridor.primary_ramp}</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1 mb-1">
                <Compass className="w-3.5 h-3.5" /> Safe Assembly Area:
              </div>
              <div className="font-mono text-slate-100">{selectedEmergency.evacuation_corridor.safe_assembly_point}</div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Prohibited Zones:
              </div>
              <div className="font-mono text-slate-100">{selectedEmergency.evacuation_corridor.forbidden_zones.join(', ')}</div>
            </div>
          </div>

          {/* Action Plan Checklist */}
          <div>
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Automated TARP Action Plan</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedEmergency.action_plan.map((act, i) => (
                <div key={i} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-slate-200">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scenario Trigger Catalog Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Simulate Emergency Disaster Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCENARIO_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.type}
                className="bg-[#0B0F17] border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 bg-slate-900 rounded-lg border border-slate-800 ${card.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-900 text-slate-400 rounded">
                      {card.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-xs mb-1">{card.label}</h3>
                  <p className="text-[11px] text-slate-400 mb-4">{card.desc}</p>
                </div>

                <button
                  onClick={() => handleTriggerScenario(card.type)}
                  disabled={loading}
                  className="w-full py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded-lg text-xs font-semibold transition"
                >
                  Trigger Simulation
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
