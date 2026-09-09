import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Equipment } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Car, Fuel, Gauge, Compass } from 'lucide-react';

export const VehicleManagement: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  useEffect(() => {
    api.getEquipment(selectedMineId).then(data => {
      setEquipment(data.filter(e => e.vehicleDetails != null));
    });
  }, [selectedMineId]);

  const columns: Column<Equipment>[] = [
    {
      header: 'License / Tag',
      render: (e) => (
        <div>
          <span className="font-mono font-bold text-mine-amber">{e.vehicleDetails?.licensePlate || 'UNASSIGNED'}</span>
          <div className="text-[10px] font-mono text-slate-400">{e.assetTag}</div>
        </div>
      )
    },
    {
      header: 'Vehicle Model',
      accessor: 'name',
      render: (e) => <span className="font-semibold text-slate-100">{e.name}</span>
    },
    {
      header: 'Speed',
      render: (e) => (
        <span className="font-mono text-emerald-400 font-bold flex items-center space-x-1">
          <Gauge className="w-3.5 h-3.5" />
          <span>{e.vehicleDetails?.currentSpeedKmh || 0} km/h</span>
        </span>
      )
    },
    {
      header: 'Fuel Tank',
      render: (e) => (
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Fuel className="w-3.5 h-3.5 text-amber-400" />
          <span>{e.vehicleDetails?.currentFuelLevelPercent || 100}%</span>
        </div>
      )
    },
    {
      header: 'Current Payload',
      render: (e) => (
        <span className="font-mono text-cyan-400 font-bold">
          {e.vehicleDetails?.payloadWeightTonnes || 0} Tonnes
        </span>
      )
    },
    {
      header: 'GPS Coordinate',
      render: (e) => (
        <span className="font-mono text-[11px] text-slate-400">
          {e.vehicleDetails?.latitude || -21.454}, {e.vehicleDetails?.longitude || 119.822}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            VEHICLE & HAUL FLEET TELEMETRY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            LIVE GPS COORDINATES, SPEED GAUGES, FUEL & PAYLOAD CAPACITY
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={equipment}
        searchPlaceholder="Search vehicles by license plate or asset tag..."
        keyExtractor={(e) => e.id}
      />
    </div>
  );
};
