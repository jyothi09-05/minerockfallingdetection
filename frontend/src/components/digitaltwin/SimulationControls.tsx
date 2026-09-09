import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  FastForward,
  AlertTriangle,
  CloudRain,
  Flame,
  ShieldAlert,
  Sun,
  Activity,
} from 'lucide-react';
import { SimulationScenario } from '../../types/simulation';

interface SimulationControlsProps {
  isRunning: boolean;
  speedMultiplier: number;
  scenario: SimulationScenario;
  seed: number;
  simulationTimeSec: number;
  tickIndex: number;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onChangeScenario: (scenario: SimulationScenario) => void;
  onChangeSeed: (seed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  speedMultiplier,
  scenario,
  seed,
  simulationTimeSec,
  tickIndex,
  onTogglePlay,
  onStep,
  onReset,
  onChangeSpeed,
  onChangeScenario,
  onChangeSeed,
}) => {
  const speeds = [1, 2, 5, 10, 25, 50];

  const formatSimTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
      {/* Playback Controls & Time */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onTogglePlay}
          className={`p-2.5 rounded-lg flex items-center justify-center font-medium transition-all ${
            isRunning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
          title={isRunning ? 'Pause Simulation' : 'Run Simulation'}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={onStep}
          disabled={isRunning}
          className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 transition-colors"
          title="Single Step (dt = 0.5s)"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="p-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
          title="Reset Simulation State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Simulation Clock Display */}
        <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-cyan-300 text-sm font-semibold tracking-wider">
            {formatSimTime(simulationTimeSec)}
          </span>
          <span className="text-xs text-slate-500 font-mono">T:{tickIndex}</span>
        </div>
      </div>

      {/* Speed Multiplier */}
      <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <FastForward className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
        {speeds.map((spd) => (
          <button
            key={spd}
            onClick={() => onChangeSpeed(spd)}
            className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
              speedMultiplier === spd
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>

      {/* Scenario Injections */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-400 font-medium">Scenario:</span>
        <select
          value={scenario}
          onChange={(e) => onChangeScenario(e.target.value as SimulationScenario)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
        >
          <option value="NORMAL_OPERATIONS">🟢 Normal Production</option>
          <option value="SLOPE_INSTABILITY_WARNING">⚠️ Slope Instability Alert</option>
          <option value="METHANE_GAS_BREACH">☣️ Methane Gas Outburst</option>
          <option value="HEAVY_RAIN_FLOOD">🌧️ Heavy Storm & Flash Flood</option>
          <option value="EMERGENCY_EVACUATION">🚨 Emergency Evacuation Drill</option>
          <option value="HEATWAVE_FATIGUE">☀️ Extreme Heatwave</option>
        </select>
      </div>

      {/* Seed Selection */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-400 font-medium">Seed:</span>
        <input
          type="number"
          value={seed}
          onChange={(e) => onChangeSeed(parseInt(e.target.value) || 0)}
          className="w-16 bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2 py-1.5 text-center focus:outline-none focus:border-cyan-500"
        />
      </div>
    </div>
  );
};
