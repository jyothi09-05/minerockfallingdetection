import { Incident, IncidentStage } from '../types/incidents';

const API_BASE = 'http://localhost:8000/api/v1/incidents';

export const incidentService = {
  async listIncidents(stage?: string, severity?: string): Promise<Incident[]> {
    try {
      const params = new URLSearchParams();
      if (stage) params.append('stage', stage);
      if (severity) params.append('severity', severity);
      const res = await fetch(`${API_BASE}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.incidents;
      }
    } catch {
      // Fallback
    }

    return [
      {
        id: 'INC-2026-001',
        incident_number: 'INC-0891',
        title: 'Bench 1350 Highwall Micro-Fracture & Rockfall Advisory',
        category: 'ROCKFALL',
        severity: 'HIGH',
        stage: 'INVESTIGATING',
        zone_name: 'North Highwall',
        zone_id: 'ZN-01',
        occurred_at: new Date().toISOString(),
        reported_by: 'Radar InSAR Automated Scan',
        assigned_investigator: 'Dr. Sarah Lin (Geotechnical Lead)',
        affected_entities: {
          vehicles: ['HT-101', 'HT-104'],
          workers: ['WRK-001', 'WRK-002'],
          equipment: ['EXCAVATOR-03']
        },
        timeline: [
          { stage: 'DETECTED', timestamp: new Date(Date.now() - 3600000).toISOString(), notes: 'Automated radar detected >3.8 mm/day displacement.', actor: 'System' },
          { stage: 'CLASSIFIED', timestamp: new Date(Date.now() - 2400000).toISOString(), notes: 'Classified as Geotechnical Rockfall Risk (Severity HIGH).', actor: 'Dispatcher Alpha' },
          { stage: 'INVESTIGATING', timestamp: new Date(Date.now() - 1200000).toISOString(), notes: 'Prism telemetry correlation initiated. Visual drone inspection dispatched.', actor: 'Dr. Sarah Lin' }
        ],
        evidence: [
          { type: 'RADAR_DISPLACEMENT', summary: '3.8 mm/day velocity on Bench 1350 crest.' },
          { type: 'CAMERA_STILL', summary: 'Minor loose talus accumulation on catch berm.' }
        ],
        action_items: [
          { task: 'Verify 2m catch berm containment capacity', status: 'IN_PROGRESS', assignee: 'Survey Crew' },
          { task: 'Re-route loaded haul trucks to Ramp R-02', status: 'COMPLETED', assignee: 'Pit Dispatcher' }
        ]
      },
      {
        id: 'INC-2026-002',
        incident_number: 'INC-0892',
        title: 'Haul Truck HT-104 Brake Retarder Thermal Warning',
        category: 'EQUIPMENT_FIRE',
        severity: 'MEDIUM',
        stage: 'RESPONDING',
        zone_name: 'Main Haul Ramp',
        zone_id: 'ZN-02',
        occurred_at: new Date(Date.now() - 1800000).toISOString(),
        reported_by: 'CAN0 High-Speed Telemetry',
        assigned_investigator: 'Marcus Vance (Reliability Engineer)',
        affected_entities: {
          vehicles: ['HT-104'],
          workers: ['WRK-005'],
          equipment: []
        },
        timeline: [
          { stage: 'DETECTED', timestamp: new Date(Date.now() - 1800000).toISOString(), notes: 'Brake cooling oil temperature hit 118°C on 8% downgrade.', actor: 'CAN Bus Telemetry' },
          { stage: 'CLASSIFIED', timestamp: new Date(Date.now() - 1500000).toISOString(), notes: 'Classified as Brake Thermal Risk (Severity MEDIUM).', actor: 'System' },
          { stage: 'RESPONDING', timestamp: new Date(Date.now() - 900000).toISOString(), notes: 'Operator instructed to gear down to 1st range and park on cooling pad.', actor: 'Dispatcher Alpha' }
        ],
        evidence: [
          { type: 'TELEMETRY_LOG', summary: 'Peak oil temp 118.4°C.' }
        ],
        action_items: [
          { task: 'Lube oil chiller bypass inspection', status: 'PENDING', assignee: 'Mobile Workshop' }
        ]
      }
    ];
  },

  async advanceStage(incidentId: string, targetStage: IncidentStage, notes?: string): Promise<Incident | null> {
    try {
      const res = await fetch(`${API_BASE}/${incidentId}/advance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_stage: targetStage,
          actor: 'Control Room Supervisor',
          notes: notes || `Advanced to ${targetStage}`
        })
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return null;
  },

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incidentData)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    return {
      id: `INC-${Date.now()}`,
      incident_number: `INC-${Math.floor(Math.random() * 900) + 100}`,
      title: incidentData.title || 'New Incident',
      category: incidentData.category || 'NEAR_MISS',
      severity: incidentData.severity || 'MEDIUM',
      stage: 'DETECTED',
      zone_name: incidentData.zone_name || 'Pit Floor',
      occurred_at: new Date().toISOString(),
      reported_by: incidentData.reported_by || 'Manual Report',
      affected_entities: incidentData.affected_entities || { vehicles: [], workers: [], equipment: [] },
      timeline: [{ stage: 'DETECTED', timestamp: new Date().toISOString(), notes: 'Incident logged', actor: 'User' }],
      evidence: []
    };
  }
};
