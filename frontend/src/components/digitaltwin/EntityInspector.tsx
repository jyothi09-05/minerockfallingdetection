import React from 'react';
import {
  VehicleSimState,
  WorkerSimState,
  SensorSimState,
  BenchDefinition,
} from '../../types/simulation';
import {
  X,
  Truck,
  User,
  Radio,
  Mountain,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  Fuel,
  Shield,
  Clock,
  Navigation,
} from 'lucide-react';

interface EntityInspectorProps {
  entityType: 'vehicle' | 'worker' | 'sensor' | 'bench' | null;
  entityId: string | null;
  vehicles: VehicleSimState[];
  workers: WorkerSimState[];
  sensors: SensorSimState[];
  benches: BenchDefinition[];
  onClose: () => void;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({
  entityType,
  entityId,
  vehicles,
  workers,
  sensors,
  benches,
  onClose,
}) => {
  if (!entityType || !entityId) return null;

  const vehicle = entityType === 'vehicle' ? vehicles.find((v) => v.id === entityId) : null;
  const worker = entityType === 'worker' ? workers.find((w) => w.id === entityId) : null;
  const sensor = entityType === 'sensor' ? sensors.find((s) => s.id === entityId) : null;
  const bench = entityType === 'bench' ? benches.find((b) => b.benchId === entityId) : null;

  return (
    <div className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          {entityType === 'vehicle' && <Truck className="w-5 h-5 text-cyan-400" />}
          {entityType === 'worker' && <User className="w-5 h-5 text-sky-400" />}
          {entityType === 'sensor' && <Radio className="w-5 h-5 text-emerald-400" />}
          {entityType === 'bench' && <Mountain className="w-5 h-5 text-amber-400" />}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              {entityType} Inspector
            </h3>
            <p className="text-xs font-mono text-slate-400">{entityId}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Vehicle Details */}
      {vehicle && (
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-slate-400">Model / Name</p>
            <p className="font-semibold text-slate-200">{vehicle.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <div>
              <span className="text-slate-500">State</span>
              <p className="font-semibold text-cyan-400">{vehicle.state}</p>
            </div>
            <div>
              <span className="text-slate-500">Velocity</span>
              <p className="font-semibold text-slate-200">{(vehicle.velocityMs * 3.6).toFixed(1)} km/h</p>
            </div>
            <div>
              <span className="text-slate-500">Payload</span>
              <p className="font-semibold text-slate-200">{vehicle.payloadTonnes.toFixed(1)} / {vehicle.maxCapacityTonnes}t</p>
            </div>
            <div>
              <span className="text-slate-500">Fuel</span>
              <p className="font-semibold text-emerald-400">{vehicle.fuelLevelPercent.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-rose-400" /> Engine Temp</span>
              <span className="font-mono text-slate-200">{vehicle.engineTempC.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-sky-400" /> Hydraulic Press</span>
              <span className="font-mono text-slate-200">{vehicle.hydraulicPressureBar.toFixed(0)} bar</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Operating Hours</span>
              <span className="font-mono text-slate-200">{vehicle.operatingHours.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> Operator</span>
              <span className="text-slate-200">{vehicle.operatorName || 'Autonomous'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Details */}
      {sensor && (
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-slate-400">Telemetry Sensor</p>
            <p className="font-semibold text-slate-200">{sensor.name}</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <span className="text-slate-500 uppercase text-[10px] tracking-wider">Current Reading</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 my-1">
              {sensor.currentValue} <span className="text-xs text-slate-400">{sensor.unit}</span>
            </div>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                sensor.status === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : sensor.status === 'WARNING'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {sensor.status}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Baseline Value:</span>
              <span className="font-mono text-slate-200">{sensor.baselineValue} {sensor.unit}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Warning Threshold:</span>
              <span className="font-mono text-amber-400">{sensor.warningThreshold} {sensor.unit}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Critical Threshold:</span>
              <span className="font-mono text-rose-400">{sensor.criticalThreshold} {sensor.unit}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Battery Level:</span>
              <span className="font-mono text-emerald-400">{sensor.batteryLevelPct}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Worker Details */}
      {worker && (
        <div className="space-y-3 text-xs">
          <div>
            <p className="text-slate-400">Personnel</p>
            <p className="font-semibold text-slate-200">{worker.name}</p>
            <p className="text-slate-500 font-mono">{worker.badgeNumber} • {worker.role}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500">Heart Rate</span>
              <p className="font-mono font-semibold text-rose-400">{worker.heartRateBpm.toFixed(0)} BPM</p>
            </div>
            <div>
              <span className="text-slate-500">Fatigue Index</span>
              <p className="font-mono font-semibold text-amber-400">{(worker.fatigueIndex * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Shift:</span>
              <span className="text-slate-200">{worker.shiftName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Assigned Zone:</span>
              <span className="text-slate-200">{worker.assignedZoneId}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>PPE Compliant:</span>
              <span className="text-emerald-400 font-semibold">{worker.ppeCompliant ? 'YES' : 'VIOLATION'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
