import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Equipment, EquipmentType } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Plus, Truck, Wrench, Activity } from 'lucide-react';

export const EquipmentManagement: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    assetTag: '',
    type: 'HAUL_TRUCK' as EquipmentType,
    modelNumber: '',
    manufacturer: '',
    capacityTonnes: 360
  });

  const loadEquipment = async () => {
    const data = await api.getEquipment(selectedMineId);
    setEquipment(data);
  };

  useEffect(() => {
    loadEquipment();
  }, [selectedMineId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createEquipment({ ...formData, mineId: selectedMineId });
    setIsModalOpen(false);
    loadEquipment();
  };

  const columns: Column<Equipment>[] = [
    {
      header: 'Asset Tag',
      accessor: 'assetTag',
      render: (e) => <span className="font-mono font-bold text-mine-amber">{e.assetTag}</span>
    },
    {
      header: 'Equipment Name',
      accessor: 'name',
      render: (e) => (
        <div>
          <div className="font-semibold text-slate-100">{e.name}</div>
          <div className="text-[10px] font-mono text-slate-400">{e.manufacturer} ({e.modelNumber || 'N/A'})</div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'type',
      render: (e) => <span className="font-mono text-slate-300">{e.type.replace('_', ' ')}</span>
    },
    {
      header: 'Health Score',
      accessor: 'healthScore',
      render: (e) => (
        <div className="flex items-center space-x-2 font-mono font-bold">
          <div className="w-16 bg-mine-surface h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${e.healthScore > 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${e.healthScore}%` }}
            ></div>
          </div>
          <span className={e.healthScore > 85 ? 'text-emerald-400' : 'text-amber-400'}>
            {e.healthScore}%
          </span>
        </div>
      )
    },
    {
      header: 'Hours',
      render: (e) => <span className="font-mono text-slate-300">{e.operatingHours} hrs</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (e) => <StatusBadge status={e.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            HEAVY MACHINERY & FLEET REGISTRY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            SHOVELS, HAUL TRUCKS, DRILLS & PREDICTIVE HEALTH SCORES
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mine-amber text-black font-mono font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition shadow-amber-glow text-xs uppercase tracking-wider flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Equipment</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={equipment}
        searchPlaceholder="Search fleet by asset tag, name or manufacturer..."
        keyExtractor={(e) => e.id}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Heavy Machinery Asset"
        subtitle="Provision telemetry channel and asset parameters."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
              Equipment Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
              placeholder="Caterpillar 797F Ultra-Class Haul Truck"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Asset Tag
              </label>
              <input
                type="text"
                required
                value={formData.assetTag}
                onChange={(e) => setFormData({ ...formData, assetTag: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono uppercase"
                placeholder="EQ-TRK-103"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Machinery Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as EquipmentType })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="HAUL_TRUCK">HAUL TRUCK</option>
                <option value="HYDRAULIC_SHOVEL">HYDRAULIC SHOVEL</option>
                <option value="ROTARY_DRILL">ROTARY DRILL</option>
                <option value="WHEEL_LOADER">WHEEL LOADER</option>
                <option value="BULLDOZER">BULLDOZER</option>
                <option value="CRUSHER">CRUSHER</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
                placeholder="Caterpillar"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Capacity (Tonnes)
              </label>
              <input
                type="number"
                value={formData.capacityTonnes}
                onChange={(e) => setFormData({ ...formData, capacityTonnes: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              />
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
              Register Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
