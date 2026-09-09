import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Zone, ZoneType, HazardLevel } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { Plus, Layers, AlertOctagon } from 'lucide-react';

export const ZoneManagement: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    zoneType: 'EXTRACTION_PIT' as ZoneType,
    hazardLevel: 'LOW' as HazardLevel,
    maxPersonnelCapacity: 30,
    maxVehicleCapacity: 10
  });

  const loadZones = async () => {
    const data = await api.getZones(selectedMineId);
    setZones(data);
  };

  useEffect(() => {
    loadZones();
  }, [selectedMineId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createZone({ ...formData, mineId: selectedMineId });
    setIsModalOpen(false);
    loadZones();
  };

  const columns: Column<Zone>[] = [
    {
      header: 'Sector Code',
      accessor: 'code',
      render: (z) => <span className="font-mono font-bold text-mine-amber">{z.code}</span>
    },
    {
      header: 'Sector Name',
      accessor: 'name',
      render: (z) => <span className="font-semibold text-slate-100">{z.name}</span>
    },
    {
      header: 'Function Type',
      accessor: 'zoneType',
      render: (z) => <span className="font-mono text-slate-300">{z.zoneType.replace('_', ' ')}</span>
    },
    {
      header: 'Hazard Level',
      accessor: 'hazardLevel',
      render: (z) => <StatusBadge status={z.hazardLevel} size="sm" />
    },
    {
      header: 'Max Personnel',
      render: (z) => <span className="font-mono text-slate-300">{z.maxPersonnelCapacity} workers</span>
    },
    {
      header: 'Max Fleet',
      render: (z) => <span className="font-mono text-slate-300">{z.maxVehicleCapacity} units</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (z) => <StatusBadge status={z.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            ZONE & SECTOR MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            GEOTECHNICAL HAZARD TIERS & GEOFENCED ACCESS ZONES
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-mine-amber text-black font-mono font-bold px-4 py-2 rounded-lg hover:bg-amber-400 transition shadow-amber-glow text-xs uppercase tracking-wider flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Operational Zone</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={zones}
        searchPlaceholder="Search zones by name, code or hazard level..."
        keyExtractor={(z) => z.id}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Operational Mine Sector"
        subtitle="Define functional boundaries and safety hazard ratings."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
              Sector Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none"
              placeholder="East Extraction Face Beta"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Zone Code
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono uppercase"
                placeholder="ZN-EAST-EXT-06"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Hazard Level
              </label>
              <select
                value={formData.hazardLevel}
                onChange={(e) => setFormData({ ...formData, hazardLevel: e.target.value as HazardLevel })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="RESTRICTED">RESTRICTED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Functional Type
              </label>
              <select
                value={formData.zoneType}
                onChange={(e) => setFormData({ ...formData, zoneType: e.target.value as ZoneType })}
                className="w-full bg-[#0B0F17] border border-mine-border rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-mine-amber focus:outline-none font-mono"
              >
                <option value="EXTRACTION_PIT">EXTRACTION PIT</option>
                <option value="PROCESSING_PLANT">PROCESSING PLANT</option>
                <option value="WASTE_DUMP">WASTE DUMP</option>
                <option value="TAILINGS_DAM">TAILINGS DAM</option>
                <option value="STOCKPILE">STOCKPILE</option>
                <option value="WORKSHOP">WORKSHOP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase mb-1">
                Max Personnel Cap
              </label>
              <input
                type="number"
                value={formData.maxPersonnelCapacity}
                onChange={(e) => setFormData({ ...formData, maxPersonnelCapacity: parseInt(e.target.value) || 0 })}
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
              Create Sector
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
