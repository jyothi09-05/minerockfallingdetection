import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Shield,
  Mountain,
  Wrench,
  Truck,
  FileText,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';
import { assistantService } from '../services/assistantService';
import { ChatMessage, AssistantRoleConfig, KnowledgeBaseStatus, MiningReport } from '../types/assistant';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('safety_officer');
  const [roles, setRoles] = useState<Record<string, AssistantRoleConfig>>({});
  const [kbStatus, setKbStatus] = useState<KnowledgeBaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState<MiningReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showKbModal, setShowKbModal] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadInitialData = async () => {
    const rolesData = await assistantService.getRoles();
    setRoles(rolesData);
    const kb = await assistantService.getKnowledgeBaseStatus();
    setKbStatus(kb);

    // Initial greeting
    setMessages([
      {
        id: 'msg-init-0',
        role: 'assistant',
        content: `👋 **Welcome to MineMind AI Intelligence Assistant**\n\nI am your 100% offline, domain-trained mining copilot. Powered by real-time digital twin telemetry, geotechnical safety models, and indexed standard operating procedures.\n\nSelect a specialist role above or ask any operational question below.`,
        timestamp: new Date().toLocaleTimeString(),
        provider: 'Local MineMind AI'
      }
    ]);
  };

  const handleSendMessage = async (queryText?: string) => {
    const query = (queryText || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(),
      role_type: selectedRole
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const resp = await assistantService.sendChatMessage(query, selectedRole);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: resp.response,
        timestamp: new Date().toLocaleTimeString(),
        role_type: resp.role,
        tool_calls: resp.tool_calls,
        citations: resp.citations,
        provider: resp.provider
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    try {
      const report = await assistantService.generateReport(reportType);
      setActiveReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const toggleCitation = (msgId: string) => {
    setExpandedCitations(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const getRoleIcon = (roleKey: string) => {
    switch (roleKey) {
      case 'safety_officer':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'geotechnical_engineer':
        return <Mountain className="w-5 h-5 text-amber-400" />;
      case 'maintenance_specialist':
        return <Wrench className="w-5 h-5 text-blue-400" />;
      case 'pit_dispatcher':
        return <Truck className="w-5 h-5 text-purple-400" />;
      case 'mine_operations_manager':
        return <Bot className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bot className="w-5 h-5 text-emerald-400" />;
    }
  };

  const currentRoleConfig = roles[selectedRole];

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-950 text-slate-100 p-4 gap-4">
      {/* Top Header / Role Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Local Mining Intelligence Assistant</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                100% OFFLINE / ZERO CLOUD APIS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              RAG Knowledge Base &bull; Grounded Digital Twin Telemetry &bull; Role-Based AI Reasoning
            </p>
          </div>
        </div>

        {/* Action Buttons: Knowledge Base & Report Generation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKbModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Knowledge Base ({kbStatus?.total_chunks || 0} Chunks)
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-md">
              <FileText className="w-4 h-4" />
              Generate Reports <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl hidden group-hover:block z-50 p-1.5">
              <button
                onClick={() => handleGenerateReport('SHIFT_HANDOVER')}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                📋 Shift Handover Report
              </button>
              <button
                onClick={() => handleGenerateReport('SAFETY_AUDIT')}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                🛡️ Safety & TARP Audit
              </button>
              <button
                onClick={() => handleGenerateReport('GEOTECH_AUDIT')}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                ⛰️ Geotechnical Stability Audit
              </button>
              <button
                onClick={() => handleGenerateReport('MAINTENANCE_FORECAST')}
                className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg transition"
              >
                🔧 Equipment Reliability Forecast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {Object.entries(roles).map(([key, config]) => {
          const isSelected = selectedRole === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedRole(key)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 text-slate-400'
              }`}
            >
              <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                {getRoleIcon(key)}
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {config.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{config.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-inner">
        {/* Messages Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isCitationOpen = expandedCitations[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUser
                      ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : getRoleIcon(msg.role_type || selectedRole)}
                </div>

                {/* Message Body */}
                <div className="space-y-2 max-w-3xl">
                  <div
                    className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-100 rounded-tr-none'
                        : 'bg-slate-950/90 border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Tool Execution Badges */}
                    {msg.tool_calls && msg.tool_calls.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                        {msg.tool_calls.map((t, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-700/60 rounded-md text-[11px] font-mono text-cyan-300"
                          >
                            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Tool: {t.name}()</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-1" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RAG Citations Accordion */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs">
                      <button
                        onClick={() => toggleCitation(msg.id)}
                        className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 transition py-1 px-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>{msg.citations.length} Verified Knowledge Base Citations</span>
                        </div>
                        {isCitationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isCitationOpen && (
                        <div className="mt-2 space-y-2 pt-2 border-t border-slate-800/80">
                          {msg.citations.map((c, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-lg">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
                                <span>[{c.citation_id}] {c.title}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{c.category} &bull; Score: {(c.relevance_score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="mt-1 text-[11px] text-slate-300 font-mono italic bg-slate-950/60 p-1.5 rounded border border-slate-800/60">
                                "{c.snippet}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Meta */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 px-1">
                    <span>{msg.timestamp}</span>
                    {msg.provider && <span>&bull; {msg.provider}</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs italic p-3">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Analyzing digital twin telemetry, executing tools, and verifying safety SOPs...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Prompts */}
        {currentRoleConfig?.suggested_questions && (
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">Suggestions:</span>
            {currentRoleConfig.suggested_questions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sq)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full text-xs text-slate-300 transition whitespace-nowrap"
              >
                {sq}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask the ${currentRoleConfig?.title || 'Assistant'} anything about mine operations, safety SOPs, or slope stability...`}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Knowledge Base Modal */}
      {showKbModal && kbStatus && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-white">Local RAG Knowledge Base</h2>
              </div>
              <button
                onClick={() => setShowKbModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400">Total Indexed Chunks</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{kbStatus.total_chunks}</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-slate-400">Vector Dimension</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">{kbStatus.embedding_dimensions} D</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Indexed SOP & Engineering Categories:</div>
              <div className="flex flex-wrap gap-1.5">
                {kbStatus.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 uppercase"
                  >
                    📂 {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
              <div>&bull; <strong>Storage</strong>: {kbStatus.storage_mode}</div>
              <div>&bull; <strong>Status</strong>: Ready for offline semantic retrieval</div>
            </div>

            <button
              onClick={() => setShowKbModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {activeReport && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">{activeReport.title}</h2>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed font-sans text-slate-200 whitespace-pre-wrap bg-slate-950">
              {activeReport.markdown_content}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-900">
              <button
                onClick={() => setActiveReport(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
