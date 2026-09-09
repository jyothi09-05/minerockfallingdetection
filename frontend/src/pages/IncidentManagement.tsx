import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Clock,
  User,
  CheckCircle2,
  FileText,
  ChevronRight,
  Plus,
  ArrowRight,
  Search,
  Filter,
  FileCheck
} from 'lucide-react';
import { incidentService } from '../services/incidentService';
import { Incident, IncidentStage, IncidentSeverity } from '../types/incidents';

const STAGES: IncidentStage[] = [
  'DETECTED',
  'CLASSIFIED',
  'INVESTIGATING',
  'ESCALATED',
  'RESPONDING',
  'RESOLVED',
  'CLOSED'
];

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [newIncidentModalOpen, setNewIncidentModalOpen] = useState(false);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentCategory, setNewIncidentCategory] = useState('SLOPE_FAILURE');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState<IncidentSeverity>('HIGH');
  const [newIncidentZone, setNewIncidentZone] = useState('North Highwall');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const list = await incidentService.listIncidents();
    setIncidents(list);
    if (list.length > 0 && !selectedIncident) {
      setSelectedIncident(list[0]);
    }
  };

  const handleAdvanceStage = async (targetStage: IncidentStage) => {
    if (!selectedIncident) return;
    const updated = await incidentService.advanceStage(selectedIncident.id, targetStage);
    if (updated) {
      setSelectedIncident(updated);
      loadIncidents();
    }
  };

  const handleCreateIncident = async () => {
    if (!newIncidentTitle.trim()) return;
    const created = await incidentService.createIncident({
      title: newIncidentTitle,
      category: newIncidentCategory,
      severity: newIncidentSeverity,
      zone_name: newIncidentZone,
      reported_by: 'Control Room Operator'
    });
    setNewIncidentModalOpen(false);
    setNewIncidentTitle('');
    setSelectedIncident(created);
    loadIncidents();
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchStage = stageFilter === 'ALL' || inc.stage === stageFilter;
    const matchQuery = !searchQuery || inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || inc.incident_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStage && matchQuery;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4">
      {/* Header Bar */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg">
            <Shield className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Incident Lifecycle Management</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">
                7-STAGE ENTERPRISE TRIAGE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Audit Trail &bull; Responsible Investigators &bull; Evidence Logging &bull; TARP Escalation
            </p>
          </div>
        </div>

        <button
          onClick={() => setNewIncidentModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          Report New Incident
        </button>
      </div>

      {/* Stage Lifecycle Progress Bar for Selected Incident */}
      {selectedIncident && (
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Current Incident Lifecycle Stage: <span className="text-white font-mono">{selectedIncident.incident_number} - {selectedIncident.title}</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {STAGES.map((stg, idx) => {
              const currentIdx = STAGES.indexOf(selectedIncident.stage);
              const isPassed = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={stg}
                  onClick={() => handleAdvanceStage(stg)}
                  className={`p-2.5 rounded-lg border text-center cursor-pointer transition ${
                    isCurrent
                      ? 'bg-cyan-600/30 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/50'
                      : isPassed
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono">{idx + 1}.</div>
                  <div className="text-xs truncate">{stg}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split: Incident List (Left), Detail Timeline (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Incident Directory (Left 4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0F17] border border-slate-800 rounded-xl p-3 flex flex-col gap-3 overflow-hidden shadow-lg">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incidents..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 outline-none"
            >
              <option value="ALL">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-cyan-400">{inc.incident_number}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                      {inc.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-100 text-xs truncate mb-1">{inc.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{inc.zone_name}</span>
                    <span className="text-emerald-400 font-medium">{inc.stage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Detail & Timeline (Right 8 cols) */}
        {selectedIncident ? (
          <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 overflow-y-auto shadow-lg">
            {/* Incident Header */}
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedIncident.incident_number}</span>
                  <span className="text-xs text-slate-400">&bull; {selectedIncident.category}</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Zone: <strong className="text-slate-200">{selectedIncident.zone_name}</strong> | Investigator: <strong className="text-slate-200">{selectedIncident.assigned_investigator || 'Unassigned'}</strong>
                </p>
              </div>

              {/* Advance Next Stage Action Button */}
              <div className="flex items-center gap-2">
                {selectedIncident.stage !== 'CLOSED' && (
                  <button
                    onClick={() => {
                      const nextIdx = STAGES.indexOf(selectedIncident.stage) + 1;
                      if (nextIdx < STAGES.length) {
                        handleAdvanceStage(STAGES[nextIdx]);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
                  >
                    <span>Advance to Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Affected Entities Chips */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">Affected Vehicles</div>
                <div className="font-mono text-cyan-300">
                  {selectedIncident.affected_entities.vehicles.length > 0 ? selectedIncident.affected_entities.vehicles.join(', ') : 'None'}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">Affected Workers</div>
                <div className="font-mono text-amber-300">
                  {selectedIncident.affected_entities.workers.length > 0 ? selectedIncident.affected_entities.workers.join(', ') : 'None'}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1">Affected Equipment</div>
                <div className="font-mono text-purple-300">
                  {selectedIncident.affected_entities.equipment.length > 0 ? selectedIncident.affected_entities.equipment.join(', ') : 'None'}
                </div>
              </div>
            </div>

            {/* Audit History Timeline */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Audit Timeline & Stage History</h3>
              <div className="space-y-3">
                {selectedIncident.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-mono text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                        <span className="text-cyan-300">STAGE: {item.stage}</span>
                        <span className="text-slate-500 font-normal">{new Date(item.timestamp).toLocaleTimeString()} by {item.actor}</span>
                      </div>
                      <p className="mt-1 text-slate-300">{item.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Attachments */}
            {selectedIncident.evidence.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Attached Telemetry & Evidence</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedIncident.evidence.map((ev, i) => (
                    <div key={i} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
                      <div className="font-mono text-[11px] text-emerald-400 font-semibold">{ev.type}</div>
                      <p className="text-slate-300 mt-0.5">{ev.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800 rounded-xl p-8 flex items-center justify-center text-slate-500 text-xs">
            Select an incident from the directory to review audit timeline and manage lifecycle.
          </div>
        )}
      </div>

      {/* New Incident Modal */}
      {newIncidentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white">Log Operational Safety Incident</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Incident Title / Summary</label>
                <input
                  type="text"
                  value={newIncidentTitle}
                  onChange={(e) => setNewIncidentTitle(e.target.value)}
                  placeholder="e.g. Bench 1350 Highwall Tension Crack"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newIncidentCategory}
                    onChange={(e) => setNewIncidentCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="SLOPE_FAILURE">Slope Failure</option>
                    <option value="ROCKFALL">Rockfall</option>
                    <option value="VEHICLE_COLLISION">Vehicle Collision</option>
                    <option value="EQUIPMENT_FIRE">Equipment Fire</option>
                    <option value="WORKER_DISTRESS">Worker Distress</option>
                    <option value="GAS_OUTBURST">Gas Outburst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Severity</label>
                  <select
                    value={newIncidentSeverity}
                    onChange={(e) => setNewIncidentSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="CATASTROPHIC">Catastrophic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Mining Zone</label>
                <input
                  type="text"
                  value={newIncidentZone}
                  onChange={(e) => setNewIncidentZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNewIncidentModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIncident}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Register Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
