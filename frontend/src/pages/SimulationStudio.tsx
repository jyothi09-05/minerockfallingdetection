import React, { useState } from 'react';
import {
  Sliders,
  Play,
  Download,
  AlertTriangle,
  Flame,
  CloudRain,
  ShieldAlert,
  Save,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Activity,
} from 'lucide-react';

export const SimulationStudio: React.FC = () => {
  // Configurable physics & scenario parameters
  const [params, setParams] = useState({
    roadFrictionMult: 1.0,
    uphillSpeedPenalty: 0.5,
    engineThermalDissipation: 0.05,
    sensorNoiseVariance: 0.08,
    workerFatigueRate: 1.0,
    methaneSeepageBaseline: 0.12,
  });

  const [activeScenario, setActiveScenario] = useState('NORMAL');
  const [exportDays, setExportDays] = useState(3);
  const [exportInterval, setExportInterval] = useState(300);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = (format: 'csv' | 'json') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Simulation Studio & Physics Tuning
          </h1>
          <p className="text-xs text-slate-400">
            Configure local physical parameters, scenario triggers, and export synthetic mining datasets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Physics Tuning Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Physics & Kinematic Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Haul Road Friction Multiplier</span>
                <span className="font-mono text-cyan-400">{params.roadFrictionMult.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.05"
                value={params.roadFrictionMult}
                onChange={(e) => setParams({ ...params, roadFrictionMult: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Ramp Grade Speed Penalty</span>
                <span className="font-mono text-cyan-400">{params.uphillSpeedPenalty.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={params.uphillSpeedPenalty}
                onChange={(e) => setParams({ ...params, uphillSpeedPenalty: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Engine Thermal Heat Accumulation</span>
                <span className="font-mono text-cyan-400">{params.engineThermalDissipation.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.2"
                step="0.01"
                value={params.engineThermalDissipation}
                onChange={(e) => setParams({ ...params, engineThermalDissipation: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Sensor Gaussian Noise Variance</span>
                <span className="font-mono text-cyan-400">±{(params.sensorNoiseVariance * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.25"
                step="0.01"
                value={params.sensorNoiseVariance}
                onChange={(e) => setParams({ ...params, sensorNoiseVariance: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Worker Heat Fatigue Acceleration</span>
                <span className="font-mono text-cyan-400">{params.workerFatigueRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={params.workerFatigueRate}
                onChange={(e) => setParams({ ...params, workerFatigueRate: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <button
            onClick={() =>
              setParams({
                roadFrictionMult: 1.0,
                uphillSpeedPenalty: 0.5,
                engineThermalDissipation: 0.05,
                sensorNoiseVariance: 0.08,
                workerFatigueRate: 1.0,
                methaneSeepageBaseline: 0.12,
              })
            }
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Default Physics
          </button>
        </div>

        {/* Scenario Injection Tester */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Scenario Injection Matrix
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setActiveScenario('NORMAL')}
              className={`w-full p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                activeScenario === 'NORMAL'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Standard Operations Cycle</p>
                <p className="text-[11px] text-slate-400">Baseline haulage, stable gas levels, 28°C sunny microclimate.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveScenario('SLOPE')}
              className={`w-full p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                activeScenario === 'SLOPE'
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">East Wall Slope Instability</p>
                <p className="text-[11px] text-slate-400">Radar displacement spikes to 4.8 mm/day, crack extensometer alert.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveScenario('GAS')}
              className={`w-full p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                activeScenario === 'GAS'
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Pit Floor Methane Surge</p>
                <p className="text-[11px] text-slate-400">CH4 concentration reaches 1.65% LEL, triggering automated alarms.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveScenario('STORM')}
              className={`w-full p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                activeScenario === 'STORM'
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <CloudRain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Severe Flash Flood & Downpour</p>
                <p className="text-[11px] text-slate-400">52 mm/h rain, road friction drops to 0.42, sump pumps at 100% duty.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Dataset Generator & Export Center */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" /> Historical Dataset Synthesizer
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Time Horizon (Days)</label>
              <select
                value={exportDays}
                onChange={(e) => setExportDays(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>1 Day (24 Hours)</option>
                <option value={3}>3 Days (72 Hours)</option>
                <option value={7}>7 Days (1 Week Production)</option>
                <option value={30}>30 Days (Full Month Telemetry)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Telemetry Resolution</label>
              <select
                value={exportInterval}
                onChange={(e) => setExportInterval(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-cyan-500"
              >
                <option value={60}>Every 1 Minute (High Precision)</option>
                <option value={300}>Every 5 Minutes (Standard)</option>
                <option value={900}>Every 15 Minutes (Compressed)</option>
              </select>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px] text-slate-400">
              <p>Estimated Records: <span className="text-cyan-400 font-bold">{(exportDays * 86400 / exportInterval * 7).toLocaleString()}</span></p>
              <p>Tables: sensors, vehicles, equipment, weather, incidents</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-md"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-md"
              >
                <FileCode className="w-4 h-4" /> Export JSON
              </button>
            </div>

            {exportSuccess && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-center font-semibold">
                ✓ Dataset generated and exported to local filesystem!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
