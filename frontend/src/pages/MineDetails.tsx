import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Mine, Zone } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapPin, Layers, ChevronRight, Compass, ShieldCheck, Truck } from 'lucide-react';

export const MineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [mine, setMine] = useState<Mine | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    api.getMines().then(mines => {
      const found = mines.find(m => m.id === id) || mines[0];
      setMine(found);
      if (found) {
        api.getZones(found.id).then(setZones);
      }
    });
  }, [id]);

  if (!mine) return <div className="p-8 text-center text-slate-400 font-mono">Loading mine details...</div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link to="/mines" className="hover:text-mine-amber transition">MINES REGISTRY</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-100">{mine.name}</span>
      </div>

      {/* Hero Card */}
      <div className="bg-[#121824] border border-mine-border rounded-xl p-6 shadow-industrial relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-mono font-bold text-mine-amber px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800">
                {mine.code}
              </span>
              <StatusBadge status={mine.status} />
              <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                {mine.commodity}
              </span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-slate-100">{mine.name}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1 flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-mine-amber" />
              <span>{mine.stateProvince ? `${mine.stateProvince}, ` : ''}{mine.country} | LAT: {mine.latitude}, LON: {mine.longitude}</span>
            </p>
          </div>
          <div className="flex items-center space-x-6 text-xs font-mono text-slate-300">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Elevation</div>
              <div className="text-base font-bold text-slate-100">{mine.elevationMeters} m</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Total Area</div>
              <div className="text-base font-bold text-slate-100">{mine.totalAreaHectares} ha</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Timezone</div>
              <div className="text-base font-bold text-slate-100">{mine.timezone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Functional Zones in this Mine */}
      <div className="bg-[#121824] border border-mine-border rounded-xl p-5 shadow-industrial">
        <div className="flex items-center justify-between pb-4 border-b border-mine-border mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-mine-amber" />
            <h3 className="text-sm font-bold text-slate-100 font-mono">
              OPERATIONAL SECTORS & ZONES ({zones.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div key={zone.id} className="bg-[#0B0F17] border border-mine-border rounded-lg p-4 hover:border-slate-700 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-mine-amber font-bold">{zone.code}</span>
                <StatusBadge status={zone.hazardLevel} size="sm" />
              </div>
              <h4 className="text-sm font-bold text-slate-100 font-sans mb-1">{zone.name}</h4>
              <p className="text-[11px] font-mono text-slate-400 mb-3">{zone.zoneType.replace('_', ' ')}</p>
              
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-3 border-t border-mine-border/60 text-slate-400">
                <div>Cap: {zone.maxPersonnelCapacity} Personnel</div>
                <div>Vehicles: {zone.maxVehicleCapacity} Units</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
