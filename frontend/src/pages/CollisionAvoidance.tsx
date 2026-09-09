import React, { useState } from 'react';
import {
  Truck,
  AlertTriangle,
  Radio,
  Activity,
  ShieldAlert,
  Gauge,
  Zap,
} from 'lucide-react';

export const CollisionAvoidance: React.FC = () => {
  const [pairs] = useState([
    {
      truckA: 'HT-101 (CAT 797F)',
      truckB: 'HT-102 (CAT 797F)',
      distanceM: 32.5,
      closingSpeedKmh: 24.8,
      ttcSec: 4.7,
      zone: 'Spiral Ramp 1 (485m)',
      status: 'WARNING',
      advisory: 'Reduce speed to 15 km/h; maintain 50m separation.',
    },
    {
      truckA: 'HT-103 (Komatsu 930E)',
      truckB: 'DZ-301 (CAT D11)',
      distanceM: 78.0,
      closingSpeedKmh: 8.2,
      ttcSec: 34.2,
      zone: 'North Waste Dump',
      status: 'SAFE',
      advisory: 'Clearance buffer nominal.',
    },
    {
      truckA: 'HT-102 (CAT 797F)',
      truckB: 'EX-201 (CAT 6060)',
      distanceM: 18.0,
      closingSpeedKmh: 4.5,
      ttcSec: 14.4,
      zone: 'Pit Bottom Load Face',
      status: 'SAFE',
      advisory: 'Loading bay docking protocol active.',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            Fleet Collision Avoidance & Proximity Matrix
          </h1>
          <p className="text-xs text-slate-400">
            High-frequency kinematic trajectory projection, blind-spot radar, and Time-To-Collision (TTC) early warnings.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Active Fleet Tracked</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">5 Units</div>
          <p className="text-[11px] text-slate-500 mt-2">100% telemetry coverage</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Minimum Fleet Separation</span>
          <div className="text-2xl font-bold font-mono text-amber-400">32.5 m</div>
          <p className="text-[11px] text-slate-500 mt-2">Buffer: 25.0m Minimum</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Lowest Time-To-Collision</span>
          <div className="text-2xl font-bold font-mono text-rose-400">4.7 s</div>
          <p className="text-[11px] text-slate-500 mt-2">HT-101 vs HT-102</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Detection Latency</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">1.4 ms</div>
          <p className="text-[11px] text-slate-500 mt-2">Edge Kinematic Bus</p>
        </div>
      </div>

      {/* Pairwise Radar & Proximity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4 text-cyan-400" /> Real-time Pairwise Proximity Radar
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Vehicle Pair</th>
                <th className="p-3">Location / Ramp</th>
                <th className="p-3">Separation (m)</th>
                <th className="p-3">Closing Velocity</th>
                <th className="p-3">Time-To-Collision (TTC)</th>
                <th className="p-3">Collision Risk Status</th>
                <th className="p-3">In-Cab Advisory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {pairs.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100 font-sans">
                    {p.truckA} <span className="text-slate-500 font-mono">↔</span> {p.truckB}
                  </td>
                  <td className="p-3 font-sans text-slate-300">{p.zone}</td>
                  <td className="p-3 font-bold text-cyan-400">{p.distanceM.toFixed(1)} m</td>
                  <td className="p-3 text-slate-200">{p.closingSpeedKmh.toFixed(1)} km/h</td>
                  <td className="p-3 font-bold text-rose-400">{p.ttcSec.toFixed(1)} s</td>
                  <td className="p-3 font-sans">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 font-sans text-cyan-300 text-[11px]">{p.advisory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
