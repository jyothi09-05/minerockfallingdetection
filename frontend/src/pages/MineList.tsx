import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mine, MineType, CommodityType } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Plus, MapPin, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MineList: React.FC = () => {
  const [mines, setMines] = useState<Mine[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'OPEN_PIT' as MineType,
    commodity: 'COPPER' as CommodityType,
    latitude: -21.45,
    longitude: 119.82,
    country: 'Australia'
  });

  const loadMines = async () => {
    const data = await api.getMines();
    setMines(data);
  };

  useEffect(() => {
    loadMines();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createMine(formData);
    setIsModalOpen(false);
    loadMines();
  };

  const columns: Column<Mine>[] = [
    {
      header: 'Mine Site Code',
      accessor: 'code',
      render: (m) => <span className="font-mono font-bold text-mine-amber">{m.code}</span>
    },
    {
      header: 'Mine Name',
      accessor: 'name',
      render: (m) => (
        <Link to={`/mines/${m.id}`} className="font-semibold text-slate-100 hover:text-mine-amber transition flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-mine-amber shrink-0" />
          <span>{m.name}</span>
        </Link>
      )
    },
    {
      header: 'Method',
      accessor: 'type',
      render: (m) => <span className="font-mono text-slate-300">{m.type.replace('_', ' ')}</span>
    },
    {
      header: 'Primary Commodity',
      accessor: 'commodity',
      render: (m) => (
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-cyan-400">
          {m.commodity}
        </span>
      )
    },
    {
      header: 'Location',
      render: (m) => <span className="text-slate-300">{m.stateProvince ? `${m.stateProvince}, ` : ''}{m.country}</span>
    },
    {
      header: 'Sectors / Zones',
      render: (m) => (
        <span className="font-mono font-semibold text-slate-200 flex items-center space-x-1">
          <Layers className="w-3 h-3 text-mine-amber" />
          <span>{m.zoneCount || 0} Zones</span>
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (m) => <StatusBadge status={m.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            MINE SITES REGISTRY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            SURFACE & UNDERGROUND EXTRACTION COMPLEXES
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mine-amber text-black font-mono font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition shadow-amber-glow text-xs uppercase tracking-wider flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Mine Site</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={mines}
        searchPlaceholder="Search mines by name, code or commodity..."
        keyExtractor={(m) => m.id}
      />

      {/* Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Mine Site Complex"
        subtitle="Establish geospatial boundaries and operational profile."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
              Mine Complex Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
              placeholder="Prometheus Pit #5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Mine Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none uppercase font-mono"
                placeholder="MINE-PROM-05"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Extraction Method
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MineType })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="OPEN_PIT">OPEN PIT</option>
                <option value="UNDERGROUND">UNDERGROUND</option>
                <option value="PLACER">PLACER</option>
                <option value="COMBINED">COMBINED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Primary Commodity
              </label>
              <select
                value={formData.commodity}
                onChange={(e) => setFormData({ ...formData, commodity: e.target.value as CommodityType })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="COPPER">COPPER</option>
                <option value="GOLD">GOLD</option>
                <option value="IRON_ORE">IRON ORE</option>
                <option value="LITHIUM">LITHIUM</option>
                <option value="COAL">COAL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Country
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
                placeholder="Australia"
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
              Create Mine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
