import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { ScrollText, ShieldCheck } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp (UTC)',
      accessor: 'createdAt',
      render: (l) => <span className="font-mono text-slate-400">{new Date(l.createdAt).toLocaleString()}</span>
    },
    {
      header: 'User / Principal',
      accessor: 'username',
      render: (l) => <span className="font-mono font-bold text-mine-amber">{l.username || 'SYSTEM'}</span>
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (l) => (
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-cyan-300">
          {l.action}
        </span>
      )
    },
    {
      header: 'Target Resource',
      accessor: 'resourceType',
      render: (l) => <span className="font-mono text-slate-300">{l.resourceType}</span>
    },
    {
      header: 'Operation Details',
      accessor: 'details',
      render: (l) => <span className="text-slate-300 font-mono text-xs">{l.details || 'N/A'}</span>
    },
    {
      header: 'Outcome',
      accessor: 'status',
      render: (l) => <StatusBadge status={l.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            IMMUTABLE AUDIT TRAIL
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            CRYPTOGRAPHIC AUDIT LOGS FOR SAFETY & REGULATORY COMPLIANCE
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit logs by username, action or resource..."
        keyExtractor={(l) => l.id}
      />
    </div>
  );
};
