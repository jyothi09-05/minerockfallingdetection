import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { ModelMetadata } from '../types/ai';
import {
  BrainCircuit,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  RefreshCw,
} from 'lucide-react';

export const ModelRegistry: React.FC = () => {
  const [models, setModels] = useState<ModelMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      const data = await aiService.getModelRegistry();
      setModels(data);
      setLoading(false);
    };
    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Activity className="w-6 h-6 animate-spin mr-2 text-cyan-400" />
        <span>Loading Local Model Registry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            AI Model Registry & Lifecycle Management
          </h1>
          <p className="text-xs text-slate-400">
            Local model versions, evaluation metrics, feature importance registries, and active deployment targets.
          </p>
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((m) => (
          <div
            key={`${m.category}-${m.version}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  {m.category.toUpperCase()}
                </span>
                <span className="flex items-center text-xs font-semibold text-emerald-400 gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE ({m.version})
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-100">{m.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{m.description}</p>
            </div>

            {/* Metrics Breakdown */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs font-mono">
              <span className="text-slate-500 text-[10px] uppercase font-sans tracking-wider block">
                Validation Metrics
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(m.metrics).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 text-[11px] block">{key}</span>
                    <span className="text-slate-100 font-bold">
                      {typeof val === 'number' && val < 1.0 ? `${(val * 100).toFixed(1)}%` : val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-3">
              <span>Trained: {new Date(m.trained_at).toLocaleDateString()}</span>
              <span className="text-cyan-400 font-semibold">Deterministic 100% Offline</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
