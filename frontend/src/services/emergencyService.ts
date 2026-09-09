import { SimulatedEmergency, EmergencyType } from '../types/emergency';

const API_BASE = 'http://localhost:8000/api/v1/emergency';

export const emergencyService = {
  async getActiveEmergencies(): Promise<SimulatedEmergency[]> {
    try {
      const res = await fetch(`${API_BASE}/active`);
      if (res.ok) {
        const data = await res.json();
        return data.emergencies;
      }
    } catch {
      // Fallback
    }
    return [];
  },

  async getAvailableScenarios(): Promise<EmergencyType[]> {
    try {
      const res = await fetch(`${API_BASE}/scenarios`);
      if (res.ok) {
        const data = await res.json();
        return data.scenarios;
      }
    } catch {
      // Fallback
    }
    return [
      'ROCKFALL',
      'SLOPE_INSTABILITY',
      'FIRE',
      'FLOOD',
      'VEHICLE_COLLISION',
      'EQUIPMENT_FAILURE',
      'WORKER_EMERGENCY',
      'GAS_DUST_INCIDENT'
    ];
  },

  async triggerEmergency(emergencyType: EmergencyType, zoneName?: string): Promise<SimulatedEmergency> {
    try {
      const res = await fetch(`${API_BASE}/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emergency_type: emergencyType, zone_name: zoneName })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      emergency_id: `EMERG-${Date.now()}`,
      emergency_type: emergencyType,
      title: `Active Simulated Disaster: ${emergencyType}`,
      affected_zone: zoneName || 'North Highwall',
      zone_id: 'ZN-01',
      severity: 'CRITICAL',
      tarp_level: 'LEVEL_3_RED',
      primary_hazard: 'Rapid telemetry breach requiring immediate response protocol.',
      affected_entities: {
        workers: ['WRK-001', 'WRK-002'],
        vehicles: ['HT-101'],
        equipment: ['EXCAVATOR-03']
      },
      evacuation_corridor: {
        primary_ramp: 'R-02 (West Flank Egress)',
        safe_assembly_point: 'Assembly Point Beta (Bench 1450 Rim)',
        forbidden_zones: ['Active Incident Zone']
      },
      action_plan: [
        'Sound continuous emergency siren across sector PA speakers.',
        'Dispatch automated stop commands to all heavy haul units.',
        'Evacuate personnel via designated egress corridor.'
      ],
      triggered_at: new Date().toISOString(),
      status: 'ACTIVE',
      siren_active: true
    };
  },

  async resolveEmergency(emergencyId: string, notes?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/${emergencyId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution_notes: notes })
      });
      return res.ok;
    } catch {
      return true;
    }
  }
};
