import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Worker } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Plus, Users, Shield, Heart } from 'lucide-react';

export const WorkerManagement: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    badgeNumber: '',
    role: 'OPERATOR',
    bloodGroup: 'O+',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const loadWorkers = async () => {
    const data = await api.getWorkers(selectedMineId);
    setWorkers(data);
  };

  useEffect(() => {
    loadWorkers();
  }, [selectedMineId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createWorker({ ...formData, assignedMineId: selectedMineId });
    setIsModalOpen(false);
    loadWorkers();
  };

  const columns: Column<Worker>[] = [
    {
      header: 'Badge ID',
      accessor: 'badgeNumber',
      render: (w) => <span className="font-mono font-bold text-mine-amber">{w.badgeNumber}</span>
    },
    {
      header: 'Personnel Name',
      accessor: 'fullName',
      render: (w) => (
        <div>
          <div className="font-semibold text-slate-100">{w.fullName}</div>
          <div className="text-[10px] font-mono text-slate-400">Blood Group: {w.bloodGroup || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Operational Role',
      accessor: 'role',
      render: (w) => <span className="font-mono text-slate-300">{w.role.replace('_', ' ')}</span>
    },
    {
      header: 'Medical Clearance',
      accessor: 'medicalClearanceStatus',
      render: (w) => <StatusBadge status={w.medicalClearanceStatus} size="sm" />
    },
    {
      header: 'Active Certifications',
      render: (w) => (
        <div className="flex flex-wrap gap-1">
          {w.activeCertifications?.map((c, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
              {c}
            </span>
          )) || <span className="text-slate-500 font-mono text-[10px]">None</span>}
        </div>
      )
    },
    {
      header: 'Duty Status',
      accessor: 'status',
      render: (w) => <StatusBadge status={w.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            WORKFORCE & SAFETY CLEARANCE HUB
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            PERSONNEL DIRECTORY, MEDICAL CLEARANCE & ACTIVE RFID ROSTER
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mine-amber text-black font-mono font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition shadow-amber-glow text-xs uppercase tracking-wider flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Personnel</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={workers}
        searchPlaceholder="Search workforce by badge, name or role..."
        keyExtractor={(w) => w.id}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Site Personnel"
        subtitle="Issue security badge and record medical clearances."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
                placeholder="Marcus"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
                placeholder="Vance"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Badge ID
              </label>
              <input
                type="text"
                required
                value={formData.badgeNumber}
                onChange={(e) => setFormData({ ...formData, badgeNumber: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono uppercase"
                placeholder="BADGE-88405"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="OPERATOR">OPERATOR</option>
                <option value="MINER">MINER</option>
                <option value="GEOLOGIST">GEOLOGIST</option>
                <option value="SAFETY_INSPECTOR">SAFETY INSPECTOR</option>
                <option value="MAINTENANCE_TECH">MAINTENANCE TECH</option>
                <option value="BLASTING_SPECIALIST">BLASTING SPECIALIST</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-mine-surface border border-mine-border text-xs font-mono text-slate-300 hover:bg-mine-hover"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-mine-amber text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-400 shadow-amber-glow"
            >
              Register Worker
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
