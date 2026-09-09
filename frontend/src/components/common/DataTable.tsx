import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
  keyExtractor: (item: T) => string;
  pageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  actions,
  keyExtractor,
  pageSize = 10
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(item => {
    if (!search.trim()) return true;
    return Object.values(item as any).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-[#121824] border border-mine-border rounded-xl shadow-industrial overflow-hidden">
      {/* Search & Actions Bar */}
      <div className="p-4 border-b border-mine-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0B0F17] border border-mine-border rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-mine-amber focus:outline-none transition font-sans"
          />
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-mine-border bg-[#0B0F17]/80 text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 font-semibold ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-mine-border/60 text-xs text-slate-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-mine-hover/60 transition group">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`py-3.5 px-4 ${col.className || ''}`}>
                      {col.render ? col.render(item) : (col.accessor ? String(item[col.accessor] ?? '') : '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12">
                  <EmptyState title="No matching records found" description="Try adjusting your search criteria." />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-mine-border flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>
            Showing <span className="text-slate-200 font-semibold">{((currentPage - 1) * pageSize) + 1}</span> to <span className="text-slate-200 font-semibold">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="text-slate-200 font-semibold">{filteredData.length}</span> entries
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-mine-surface border border-mine-border disabled:opacity-30 hover:bg-mine-hover transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-mine-surface border border-mine-border rounded text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-mine-surface border border-mine-border disabled:opacity-30 hover:bg-mine-hover transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
