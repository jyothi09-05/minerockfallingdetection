import React, { useState } from 'react';
import {
  Mountain,
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingUp,
  Gauge,
  Droplets,
  Zap,
} from 'lucide-react';

export const GeotechnicalRisk: React.FC = () => {
  const [params, setParams] = useState({
    slopeAngle: 68.0,
    displacementRate: 3.4,
    rainfall24h: 38.0,
    crackDilation: 6.5,
    seismicPpv: 14.2,
    rockMassRating: 62.0,
  });

  // Calculate live rockfall & FoS indicators
  const dispScore = 1.0 / (1.0 + Math.exp(-1.8 * (params.displacementRate - 2.5)));
  const rainScore = Math.min(1.0, params.rainfall24h / 45.0);
  const crackScore = Math.min(1.0, params.crackDilation / 8.0);
  const vibScore = Math.min(1.0, params.seismicPpv / 20.0);
  const rmrScore = Math.max(0.0, (80.0 - params.rockMassRating) / 60.0);

  const z = 2.8 * dispScore + 2.0 * crackScore + 1.6 * rainScore + 1.2 * vibScore + 1.0 * rmrScore - 3.0;
  const rockfallProb = Math.min(0.99, Math.max(0.02, 1.0 / (1.0 + Math.exp(-z))));
  const fos = Math.max(0.75, Math.min(2.4, 2.2 - rockfallProb * 1.4));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Mountain className="w-5 h-5 text-amber-400" />
            Geotechnical Rockfall & Slope Stability Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Real-time radar interferometry, tension crack extensometry, and limit-equilibrium stability analysis.
          </p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Rockfall Probability</span>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-2xl font-bold font-mono ${
                rockfallProb > 0.7 ? 'text-rose-400' : rockfallProb > 0.35 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {(rockfallProb * 100).toFixed(1)}%
            </span>
            <span className="text-xs uppercase font-semibold text-slate-400">
              {rockfallProb > 0.7 ? 'HIGH HAZARD' : rockfallProb > 0.35 ? 'WARNING' : 'NOMINAL'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">East Highwall Crest Bench</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Factor of Safety (FoS)</span>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-2xl font-bold font-mono ${
                fos < 1.2 ? 'text-rose-400' : fos < 1.4 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {fos.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ 1.30 Min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Planar shear resistance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Radar Displacement Rate</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {params.displacementRate.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">mm/day</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Threshold: 2.50 mm/day</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Crack Aperture Dilation</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {params.crackDilation.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">mm</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">North Crest Extensometer</p>
        </div>
      </div>

      {/* Interactive Geotechnical Parameter Tuner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Geotechnical Simulation Sliders
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Displacement Velocity (mm/day)</span>
                <span className="font-mono text-cyan-400">{params.displacementRate.toFixed(2)} mm/day</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="12.0"
                step="0.1"
                value={params.displacementRate}
                onChange={(e) => setParams({ ...params, displacementRate: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>24h Rainfall Infiltration (mm)</span>
                <span className="font-mono text-cyan-400">{params.rainfall24h.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="80.0"
                step="1.0"
                value={params.rainfall24h}
                onChange={(e) => setParams({ ...params, rainfall24h: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Tension Crack Aperture (mm)</span>
                <span className="font-mono text-cyan-400">{params.crackDilation.toFixed(1)} mm</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20.0"
                step="0.5"
                value={params.crackDilation}
                onChange={(e) => setParams({ ...params, crackDilation: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Blast Vibration Peak Particle Velocity (PPV)</span>
                <span className="font-mono text-cyan-400">{params.seismicPpv.toFixed(1)} mm/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="35.0"
                step="0.5"
                value={params.seismicPpv}
                onChange={(e) => setParams({ ...params, seismicPpv: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Explainable Contributing Factors Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Geotechnical Risk Factor Attribution
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">Radar Velocity Gradient</p>
                <p className="text-[11px] text-slate-400">Calculates shear displacement acceleration</p>
              </div>
              <span className="font-mono font-bold text-amber-400">{(dispScore * 35).toFixed(0)}% Weight</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">Tension Crack Dilation</p>
                <p className="text-[11px] text-slate-400">Extensometer aperture detachment</p>
              </div>
              <span className="font-mono font-bold text-amber-400">{(crackScore * 25).toFixed(0)}% Weight</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">Pore Pressure Infiltration</p>
                <p className="text-[11px] text-slate-400">Rainfall cleft hydrostatic reduction</p>
              </div>
              <span className="font-mono font-bold text-amber-400">{(rainScore * 20).toFixed(0)}% Weight</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-200">Blast Induced Shear Shock</p>
                <p className="text-[11px] text-slate-400">Triaxial PPV wave transmission</p>
              </div>
              <span className="font-mono font-bold text-amber-400">{(vibScore * 15).toFixed(0)}% Weight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
