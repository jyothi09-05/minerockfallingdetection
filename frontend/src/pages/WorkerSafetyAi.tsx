import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Heart,
  Thermometer,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const WorkerSafetyAi: React.FC = () => {
  const [workers] = useState([
    {
      id: 'WRK-001',
      name: 'Marcus Vance',
      role: 'TRUCK_OPERATOR',
      safetyScore: 96.0,
      heartRateBpm: 78,
      fatiguePct: 22,
      heatStrain: 'LOW (0.14)',
      vehicleProximity: 'Mounted in CAT 797F (#101)',
      inExclusion: false,
      ppeStatus: true,
      zone: 'Main Pit Spiral Ramp',
    },
    {
      id: 'WRK-002',
      name: 'Elena Rostova',
      role: 'TRUCK_OPERATOR',
      safetyScore: 92.0,
      heartRateBpm: 82,
      fatiguePct: 35,
      heatStrain: 'LOW (0.14)',
      vehicleProximity: 'Mounted in CAT 797F (#102)',
      inExclusion: false,
      ppeStatus: true,
      zone: 'Main Pit Spiral Ramp',
    },
    {
      id: 'WRK-006',
      name: 'Liam Gallagher',
      role: 'BLAST_ENGINEER',
      safetyScore: 84.0,
      heartRateBpm: 88,
      fatiguePct: 30,
      heatStrain: 'MODERATE (0.28)',
      vehicleProximity: '28m to CAT D11 Dozer',
      inExclusion: false,
      ppeStatus: true,
      zone: 'Bench 3 Active Blast Face',
    },
    {
      id: 'WRK-007',
      name: 'Amina Al-Mansoor',
      role: 'SURVEYOR',
      safetyScore: 88.0,
      heartRateBpm: 84,
      fatiguePct: 25,
      heatStrain: 'LOW (0.18)',
      vehicleProximity: '45m to Haul Road 01',
      inExclusion: false,
      ppeStatus: true,
      zone: 'East Highwall Crest',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" />
            Worker Safety & Heat Strain Intelligence Center
          </h1>
          <p className="text-xs text-slate-400">
            Real-time biometric fatigue monitoring, pedestrian vehicle clearance zones, and exclusion boundary compliance.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Active Personnel Monitored</span>
          <div className="text-2xl font-bold font-mono text-sky-400">7 Miners</div>
          <p className="text-[11px] text-slate-500 mt-2">Day Shift Alpha (06:00 - 18:00)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Average Workforce Safety Score</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">90.0%</div>
          <p className="text-[11px] text-slate-500 mt-2">Zero Lost Time Injuries (LTI)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Exclusion Incursions</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">0 Active</div>
          <p className="text-[11px] text-slate-500 mt-2">100% Geofence Adherence</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">PPE Compliance Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">100.0%</div>
          <p className="text-[11px] text-slate-500 mt-2">Hard Hat & High-Vis Vests</p>
        </div>
      </div>

      {/* Workforce Safety Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" /> Personnel Safety & Physiological Telemetry
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Worker Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Safety Index</th>
                <th className="p-3">Heart Rate</th>
                <th className="p-3">Shift Fatigue</th>
                <th className="p-3">Heat Strain Index</th>
                <th className="p-3">Proximity to Heavy Fleet</th>
                <th className="p-3">PPE Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {workers.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100 font-sans">
                    {w.name} <span className="text-slate-500 font-mono block text-[11px]">{w.id}</span>
                  </td>
                  <td className="p-3 font-sans text-slate-300">{w.role}</td>
                  <td className="p-3 font-bold text-emerald-400">{w.safetyScore}%</td>
                  <td className="p-3 text-rose-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> {w.heartRateBpm} BPM
                  </td>
                  <td className="p-3 text-amber-400">{w.fatiguePct}%</td>
                  <td className="p-3 text-slate-200">{w.heatStrain}</td>
                  <td className="p-3 font-sans text-slate-300 text-[11px]">{w.vehicleProximity}</td>
                  <td className="p-3 font-sans">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> PASSED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
