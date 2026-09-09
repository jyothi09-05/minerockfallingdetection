import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileCheck,
  Printer,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { reportingService, ReportItem } from '../services/reportingService';

export const ReportsCenter: React.FC = () => {
  const [catalog, setCatalog] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>('DAILY_MINE');
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'json' | 'csv' | 'text'>('html');
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    const list = await reportingService.getReportCatalog();
    setCatalog(list);
    handleGenerate('DAILY_MINE', 'html');
  };

  const handleGenerate = async (type: string, format: 'html' | 'json' | 'csv' | 'text') => {
    setLoading(true);
    setSelectedReport(type);
    setSelectedFormat(format);
    try {
      const content = await reportingService.exportReport(type, format);
      if (typeof content === 'object') {
        setPreviewContent(JSON.stringify(content, null, 2));
      } else {
        setPreviewContent(content);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!previewContent) return;
    const blob = new Blob([previewContent], {
      type: selectedFormat === 'html' ? 'text/html' : selectedFormat === 'csv' ? 'text/csv' : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minemind_${selectedReport.toLowerCase()}_${Date.now()}.${selectedFormat}`;
    a.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#070A0F] text-slate-100 p-4 gap-4 overflow-hidden">
      {/* Header */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">Enterprise Mining Reporting Engine</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                MULTI-FORMAT EXPORTER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated Local Generation in HTML &bull; PDF &bull; CSV &bull; JSON
            </p>
          </div>
        </div>

        {previewContent && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md"
          >
            <Download className="w-4 h-4" />
            Download {selectedFormat.toUpperCase()} Export
          </button>
        )}
      </div>

      {/* Main Split: Catalog (Left), Live Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Catalog Selector */}
        <div className="lg:col-span-4 bg-[#0B0F17] border border-slate-800 rounded-xl p-3 flex flex-col gap-3 overflow-hidden shadow-lg">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Standard Reports</h2>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {catalog.map((rep) => {
              const isSelected = selectedReport === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => handleGenerate(rep.id, selectedFormat)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-100 text-xs mb-1">{rep.title}</div>
                  <div className="font-mono text-[10px] text-slate-500">{rep.id}</div>
                </div>
              );
            })}
          </div>

          {/* Format Picker */}
          <div className="border-t border-slate-800 pt-3">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">Export Format:</div>
            <div className="grid grid-cols-4 gap-1.5">
              {(['html', 'json', 'csv', 'text'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleGenerate(selectedReport, fmt)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    selectedFormat === fmt
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Container */}
        <div className="lg:col-span-8 bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-col overflow-hidden shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Document Preview: {selectedReport} ({selectedFormat.toUpperCase()})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
            {loading ? (
              <div className="text-slate-500 text-xs italic">Rendering report document...</div>
            ) : selectedFormat === 'html' && previewContent ? (
              <div
                className="prose prose-invert max-w-none text-xs"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            ) : (
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                {previewContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
