import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { UserCog, Shield } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  const columns: Column<User>[] = [
    {
      header: 'Username',
      accessor: 'username',
      render: (u) => <span className="font-mono font-bold text-mine-amber">{u.username}</span>
    },
    {
      header: 'Full Name',
      accessor: 'fullName',
      render: (u) => (
        <div>
          <div className="font-semibold text-slate-100">{u.fullName}</div>
          <div className="text-[10px] text-slate-400">{u.email}</div>
        </div>
      )
    },
    {
      header: 'Department / Role',
      render: (u) => (
        <div>
          <div className="text-slate-200">{u.department || 'Operations'}</div>
          <div className="text-[10px] font-mono text-slate-400">{u.jobTitle || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'RBAC Roles',
      render: (u) => (
        <div className="flex flex-wrap gap-1">
          {u.roles?.map((r, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-mine-amber/10 border border-mine-amber/30 text-mine-amber text-[10px] font-mono font-bold">
              {r.replace('ROLE_', '')}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Account Status',
      accessor: 'status',
      render: (u) => <StatusBadge status={u.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            USER MANAGEMENT & ACCESS CONTROL
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            ROLE-BASED & PERMISSION-BASED GOVERNANCE (RBAC / PBAC)
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Search users by username, email or department..."
        keyExtractor={(u) => u.id}
      />
    </div>
  );
};
