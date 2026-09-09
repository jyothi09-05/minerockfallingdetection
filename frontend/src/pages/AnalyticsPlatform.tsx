import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Truck,
  Gauge,
  Wind,
  Cpu,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsOverview } from '../types/analytics';

export const AnalyticsPlatform: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [activeTab, setActiveTab] = useState<'SAFETY' | 'PRODUCTION' | 'EQUIPMENT' | 'ENVIRONMENT' | 'AI'>('SAFETY');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await analyticsService.getOverview();
    setAnalytics(data);
  };

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-xs">
        Loading analytics platform...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Enterprise Analytics Platform</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                MULTI-DOMAIN INTELLIGENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Safety Audits &bull; Production Throughput &bull; Equipment RUL &bull; Environmental Telemetry &bull; AI Accuracy
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('SAFETY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'SAFETY' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Safety
          </button>
          <button
            onClick={() => setActiveTab('PRODUCTION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'PRODUCTION' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⛏️ Production
          </button>
          <button
            onClick={() => setActiveTab('EQUIPMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'EQUIPMENT' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Equipment
          </button>
          <button
            onClick={() => setActiveTab('ENVIRONMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'ENVIRONMENT' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌿 Environment
          </button>
          <button
            onClick={() => setActiveTab('AI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'AI' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧠 AI Models
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'SAFETY' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Site Safety Health Score</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.safety.safety_health_score_pct}%</div>
              <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +1.2% vs last cycle
              </div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Lost Time Injuries (LTI)</div>
              <div className="text-2xl font-bold text-white mt-1">{analytics.safety.lost_time_injuries}</div>
              <div className="text-[10px] text-slate-500 mt-1">Zero Harm Benchmark</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Near-Misses Reported</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{analytics.safety.near_misses_reported}</div>
              <div className="text-[10px] text-slate-500 mt-1">Proactive Hazard Capture</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Current TARP Level</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.safety.current_tarp_level}</div>
              <div className="text-[10px] text-slate-500 mt-1">All Sectors Normal</div>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">14-Day Safety & PPE Compliance Trends</h2>
            <div className="space-y-2">
              {analytics.safety.trends.map((pt, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-900/60 rounded-lg text-xs">
                  <span className="font-mono text-cyan-300 font-semibold">{pt.date}</span>
                  <span className="text-slate-400">Near Misses: <strong>{pt.near_misses}</strong></span>
                  <span className="text-slate-400">Risk Composite: <strong>{pt.risk_composite_index}</strong></span>
                  <span className="text-emerald-400 font-semibold">PPE Compliance: {pt.ppe_compliance_pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PRODUCTION' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Ore Tonnage Hauled</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{analytics.production.ore_tonnage_hauled_tons.toLocaleString()} t</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Shift Target Progress</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.production.progress_pct}%</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Average Cycle Time</div>
              <div className="text-2xl font-bold text-white mt-1">{analytics.production.average_truck_cycle_time_min} min</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Crusher Feed Rate</div>
              <div className="text-2xl font-bold text-purple-400 mt-1">{analytics.production.crusher_throughput_tph} t/h</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EQUIPMENT' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Fleet Availability</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.equipment.fleet_availability_pct}%</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">MTBF (Mean Time Between Failures)</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{analytics.equipment.mean_time_between_failures_hrs} hrs</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">MTTR (Mean Time to Repair)</div>
              <div className="text-2xl font-bold text-white mt-1">{analytics.equipment.mean_time_to_repair_hrs} hrs</div>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Weibull Remaining Useful Life (RUL) Forecast</h2>
            <div className="space-y-2">
              {analytics.equipment.weibull_rul_forecast.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg text-xs">
                  <div>
                    <span className="font-mono font-bold text-cyan-300">{item.unit_id}</span>
                    <span className="text-slate-400 ml-2">&bull; {item.subsystem}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-300 font-mono font-semibold">{item.rul_hours} hrs RUL</span>
                    <span className="text-rose-400 font-semibold">{item.failure_prob_pct}% Risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'AI' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Models Deployed</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{analytics.ai_models.models_deployed} Active</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">24h Total Inferences</div>
              <div className="text-2xl font-bold text-white mt-1">{analytics.ai_models.total_inferences_24h.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Average Inference Latency</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{analytics.ai_models.average_latency_ms} ms</div>
            </div>
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <div className="text-slate-400 text-xs">Overall Accuracy</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{analytics.ai_models.overall_accuracy_pct}%</div>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Model Accuracy & Status Benchmark</h2>
            <div className="space-y-2">
              {analytics.ai_models.model_performance.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg text-xs">
                  <span className="font-mono font-bold text-white">{m.model}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-semibold">{m.accuracy_pct}% Accuracy</span>
                    <span className="text-slate-400 font-mono">{m.latency_ms} ms</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full">{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
