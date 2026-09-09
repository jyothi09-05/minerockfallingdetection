import React, { useState } from 'react';
import {
  Gauge,
  Activity,
  AlertTriangle,
  Clock,
  Thermometer,
  Zap,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export const PredictiveMaintenance: React.FC = () => {
  const [equipment] = useState([
    {
      id: 'EQ-CRUSH-01',
      name: 'Primary 60-110 Gyratory Crusher',
      healthScore: 84.5,
      rulHours: 720.0,
      bearingTempC: 68.5,
      vibrationMms: 3.4,
      vibrationZone: 'ISO Zone B (Acceptable)',
      runtimeHours: 12450.0,
      urgency: 'MONITOR',
      nextAction: 'Lube filter replacement at 12,800 hrs',
    },
    {
      id: 'EQ-CONV-01',
      name: 'Overland Ore Conveyor CV-101',
      healthScore: 94.0,
      rulHours: 1850.0,
      bearingTempC: 54.0,
      vibrationMms: 1.8,
      vibrationZone: 'ISO Zone A (Good)',
      runtimeHours: 18900.0,
      urgency: 'NORMAL',
      nextAction: 'Drive pulley visual inspection scheduled',
    },
    {
      id: 'EQ-PUMP-01',
      name: 'Pit Sump Dewatering Pump DP-01',
      healthScore: 78.0,
      rulHours: 420.0,
      bearingTempC: 72.0,
      vibrationMms: 4.8,
      vibrationZone: 'ISO Zone C (Warning)',
      runtimeHours: 8740.0,
      urgency: 'SCHEDULED_SOON',
      nextAction: 'Impeller seal overhaul needed within 2 weeks',
    },
    {
      id: 'EQ-DRILL-01',
      name: 'Pit Viper 271 Rotary Drill',
      healthScore: 71.0,
      rulHours: 290.0,
      bearingTempC: 74.0,
      vibrationMms: 7.8,
      vibrationZone: 'ISO Zone D (High Wear)',
      runtimeHours: 6320.0,
      urgency: 'URGENT_INSPECTION',
      nextAction: 'Mast rotary head bearing replacement required',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            Equipment Predictive Maintenance & Health AI
          </h1>
          <p className="text-xs text-slate-400">
            Weibull degradation hazard modeling, ISO 10816 vibration spectra, and Remaining Useful Life (RUL) estimation.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Average Plant Health</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">81.9%</div>
          <p className="text-[11px] text-slate-500 mt-2">4 Major Plant Units Monitored</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Critical RUL Countdowns</span>
          <div className="text-2xl font-bold font-mono text-amber-400">1 Unit</div>
          <p className="text-[11px] text-slate-500 mt-2">PV-271 Rotary Drill (&lt;300 hrs)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Peak Bearing Thermals</span>
          <div className="text-2xl font-bold font-mono text-rose-400">74.0 °C</div>
          <p className="text-[11px] text-slate-500 mt-2">PV-271 Rotary Drill</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Model Accuracy (RUL)</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">96.1%</div>
          <p className="text-[11px] text-slate-500 mt-2">RMSE: ±14.2 Operating Hours</p>
        </div>
      </div>

      {/* Equipment Health Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" /> Monitored Machinery Health Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Equipment Name</th>
                <th className="p-3">Health Score</th>
                <th className="p-3">Remaining Useful Life</th>
                <th className="p-3">Bearing Temp</th>
                <th className="p-3">Vibration Velocity</th>
                <th className="p-3">Maintenance Urgency</th>
                <th className="p-3">Recommended Work Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {equipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100 font-sans">
                    {eq.name} <span className="text-slate-500 font-mono block text-[11px]">{eq.id}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{eq.healthScore}%</td>
                  <td className="p-3 font-bold text-cyan-400">{eq.rulHours.toFixed(0)} hrs</td>
                  <td className="p-3 text-slate-200">{eq.bearingTempC.toFixed(1)} °C</td>
                  <td className="p-3 text-slate-300">{eq.vibrationMms.toFixed(1)} mm/s</td>
                  <td className="p-3 font-sans">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        eq.urgency === 'URGENT_INSPECTION'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : eq.urgency === 'SCHEDULED_SOON'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {eq.urgency}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-cyan-300 text-[11px]">{eq.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
