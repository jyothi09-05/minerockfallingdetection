import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Truck,
  Mountain,
  Users,
  Wrench,
  Activity,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { SearchResultItem } from '../../types/search';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim()) {
      searchService.search(query).then(setResults);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (link: string) => {
    navigate(link);
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'VEHICLE': return <Truck className="w-4 h-4 text-cyan-400" />;
      case 'ZONE': return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'WORKER': return <Users className="w-4 h-4 text-emerald-400" />;
      case 'EQUIPMENT': return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'SENSOR': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'INCIDENT': return <Shield className="w-4 h-4 text-rose-400" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4 text-emerald-300" />;
      default: return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-start justify-center z-50 pt-20 p-4">
      <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mines, vehicles, workers, incidents, sensors, SOP docs... (Press Esc to close)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">ESC</span>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1.5">
          {results.length > 0 ? (
            results.map((r) => (
              <div
                key={r.id}
                onClick={() => handleSelectResult(r.link)}
                className="p-3 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 rounded-xl flex items-center justify-between text-xs cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    {getResultIcon(r.type)}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{r.title}</span>
                      <span className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded text-cyan-300">
                        {r.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{r.subtitle} &bull; <strong className="text-slate-300">{r.zone}</strong></div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            ))
          ) : query.trim() ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching mine entities or documents found.
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs">
              Type keywords above to search across the entire mine database and SOP knowledge base.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
