import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sensor } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Activity, Radio, AlertTriangle } from 'lucide-react';

export const SensorManagement: React.FC = () => {
  const { selectedMineId } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    api.getSensors(selectedMineId).then(setSensors);
  }, [selectedMineId]);

  const columns: Column<Sensor>[] = [
    {
      header: 'Sensor Code',
      accessor: 'sensorCode',
      render: (s) => <span className="font-mono font-bold text-mine-amber">{s.sensorCode}</span>
    },
    {
      header: 'Telemetry Unit Name',
      accessor: 'name',
      render: (s) => <span className="font-semibold text-slate-100">{s.name}</span>
    },
    {
      header: 'Sensor Type',
      accessor: 'type',
      render: (s) => <span className="font-mono text-slate-300">{s.type.replace(/_/g, ' ')}</span>
    },
    {
      header: 'Latest Reading',
      render: (s) => (
        <span className="font-mono font-bold text-emerald-400 text-sm">
          {s.latestReadingValue ?? '--'} {s.unitOfMeasurement}
        </span>
      )
    },
    {
      header: 'Critical Threshold',
      render: (s) => (
        <span className="font-mono text-red-400">
          &gt; {s.criticalThreshold ?? 'N/A'} {s.unitOfMeasurement}
        </span>
      )
    },
    {
      header: 'Interval',
      render: (s) => <span className="font-mono text-slate-400">{s.samplingIntervalSeconds}s</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (s) => <StatusBadge status={s.status} size="sm" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100">
            IOT SENSORS & ATMOSPHERIC REGISTRY
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            GAS SENSORS, SEISMIC VIBRATION, SLOPES & WATER PIEZOMETERS
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sensors}
        searchPlaceholder="Search telemetry sensors by code, type or location..."
        keyExtractor={(s) => s.id}
      />
    </div>
  );
};
