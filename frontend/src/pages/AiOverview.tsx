import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { GlobalMineRiskResponse, SmartAlert } from '../types/ai';
import {
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Truck,
  Mountain,
  Gauge,
  Users,
  Eye,
  Activity,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AiOverview: React.FC = () => {
  const [riskData, setRiskData] = useState<GlobalMineRiskResponse | null>(null);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [risk, alts] = await Promise.all([
        aiService.getGlobalRisk(),
        aiService.getSmartAlerts(),
      ]);
      setRiskData(risk);
      setAlerts(alts);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAcknowledge = async (id: string) => {
    await aiService.acknowledgeAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_acknowledged: true } : a))
    );
  };

  const handleResolve = async (id: string) => {
    await aiService.resolveAlert(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_resolved: true } : a))
    );
  };

  if (loading || !riskData) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Activity className="w-6 h-6 animate-spin mr-2 text-cyan-400" />
        <span>Aggregating AI Risk Matrix...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-cyan-400" />
            MineMind AI Safety Intelligence Platform
          </h1>
          <p className="text-xs text-slate-400">
            Real-time multi-agent inference engine • 6 ML subsystems active • Zero external cloud dependencies
          </p>
        </div>

        {/* Prototype Safety Disclaimer Badge */}
        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-amber-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Decision-Support AI Prototype • Regulatory Operator Confirmation Required</span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Mine Risk Score */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Composite Mine Risk</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-2xl font-bold font-mono ${
                riskData.overall_mine_risk_score > 0.6
                  ? 'text-rose-400'
                  : riskData.overall_mine_risk_score > 0.3
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {(riskData.overall_mine_risk_score * 100).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold uppercase text-slate-400">
              [{riskData.overall_risk_level}]
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Weighted multi-model risk index</p>
        </div>

        {/* Mine Health Safety Index */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Safety Health Index</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {riskData.mine_safety_health_index.toFixed(1)}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Nominal operational tolerance</p>
        </div>

        {/* Active AI Alarms */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Active Smart Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {alerts.filter((a) => !a.is_resolved).length}
            </span>
            <span className="text-xs text-slate-400">/ {alerts.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Triage & dispatch queue</p>
        </div>

        {/* Vision AI Status */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
            <span>Vision PPE Compliance</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-sky-400">96.8%</span>
            <span className="text-xs text-emerald-400">PASS</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Live camera streams monitored</p>
        </div>
      </div>

      {/* Subsystem Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rockfall Model Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mountain className="w-4 h-4 text-amber-400" /> Rockfall Hazard Model
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                riskData.rockfall_risk.risk_level === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {riskData.rockfall_risk.risk_level}
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {(riskData.rockfall_risk.probability * 100).toFixed(1)}% <span className="text-xs font-normal text-slate-400">Risk Prob</span>
          </div>
          <p className="text-xs text-slate-400">
            FoS: {riskData.rockfall_risk.metadata.factor_of_safety_est} • Zone: {riskData.rockfall_risk.metadata.affected_zone}
          </p>
        </div>

        {/* Collision Avoidance Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-cyan-400" /> Fleet Collision AI
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                riskData.collision_risk.risk_level === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}
            >
              {riskData.collision_risk.risk_level}
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {(riskData.collision_risk.probability * 100).toFixed(1)}% <span className="text-xs font-normal text-slate-400">Collision Index</span>
          </div>
          <p className="text-xs text-slate-400">
            Min TTC: {riskData.collision_risk.metadata.time_to_collision_sec}s • Sep: {riskData.collision_risk.metadata.distance_meters}m
          </p>
        </div>

        {/* Predictive Maintenance Card */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" /> Predictive Maintenance
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              {riskData.equipment_risk.risk_level}
            </span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {riskData.equipment_risk.metadata.health_score}% <span className="text-xs font-normal text-slate-400">Plant Health</span>
          </div>
          <p className="text-xs text-slate-400">
            Min RUL: {riskData.equipment_risk.metadata.remaining_useful_life_hours} hrs • Urgency: {riskData.equipment_risk.metadata.maintenance_urgency}
          </p>
        </div>
      </div>

      {/* Explainable Contributing Factors & Zone Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Contributing Risk Drivers */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" /> Top Explainable Risk Factors
          </h2>
          <div className="space-y-3">
            {riskData.top_contributing_factors.map((factor, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1"
              >
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{factor.feature_name}</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {(factor.importance_weight * 100).toFixed(0)}% Weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Risk Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Mountain className="w-4 h-4 text-cyan-400" /> Operational Zone Risk Matrix
          </h2>
          <div className="space-y-2">
            {riskData.zone_breakdown.map((zone) => (
              <div
                key={zone.zone_id}
                className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-200">{zone.zone_name}</p>
                  <p className="text-[11px] text-slate-400">{zone.primary_hazard}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      zone.risk_level === 'HIGH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : zone.risk_level === 'MEDIUM'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {zone.risk_level} ({zone.risk_score}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Alerts & Triage Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Active AI Alarm & Incident Triage
        </h2>
        <div className="space-y-3">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
                alt.is_resolved
                  ? 'bg-slate-950/60 border-slate-800 opacity-60'
                  : alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alt.severity === 'HIGH' || alt.severity === 'CRITICAL'
                        ? 'bg-rose-500 text-slate-950'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {alt.severity}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{alt.id}</span>
                  <span className="text-xs font-semibold text-slate-200">• {alt.title}</span>
                </div>
                <p className="text-xs text-slate-300">{alt.description}</p>
                <p className="text-[11px] text-cyan-400 font-medium">Action: {alt.recommended_action}</p>
              </div>

              <div className="flex items-center space-x-2">
                {!alt.is_acknowledged && !alt.is_resolved && (
                  <button
                    onClick={() => handleAcknowledge(alt.id)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
                {!alt.is_resolved && (
                  <button
                    onClick={() => handleResolve(alt.id)}
                    className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Resolve Alarm
                  </button>
                )}
                {alt.is_resolved && (
                  <span className="flex items-center text-xs font-semibold text-emerald-400 gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
