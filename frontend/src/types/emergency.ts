export type EmergencyType = 
  | 'ROCKFALL'
  | 'SLOPE_INSTABILITY'
  | 'FIRE'
  | 'FLOOD'
  | 'VEHICLE_COLLISION'
  | 'EQUIPMENT_FAILURE'
  | 'WORKER_EMERGENCY'
  | 'GAS_DUST_INCIDENT';

export interface EvacuationCorridor {
  primary_ramp: string;
  safe_assembly_point: string;
  forbidden_zones: string[];
}

export interface SimulatedEmergency {
  emergency_id: string;
  emergency_type: EmergencyType;
  title: string;
  affected_zone: string;
  zone_id: string;
  severity: string;
  tarp_level: string;
  primary_hazard: string;
  affected_entities: {
    workers: string[];
    vehicles: string[];
    equipment: string[];
  };
  evacuation_corridor: EvacuationCorridor;
  action_plan: string[];
  triggered_at: string;
  status: 'ACTIVE' | 'RESOLVED';
  siren_active: boolean;
  resolved_at?: string;
  resolution_notes?: string;
}
