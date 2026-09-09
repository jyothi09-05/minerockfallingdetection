export type IncidentStage = 
  | 'DETECTED' 
  | 'CLASSIFIED' 
  | 'INVESTIGATING' 
  | 'ESCALATED' 
  | 'RESPONDING' 
  | 'RESOLVED' 
  | 'CLOSED';

export type IncidentSeverity = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'CRITICAL' 
  | 'CATASTROPHIC';

export interface TimelineEntry {
  stage: IncidentStage;
  timestamp: string;
  notes: string;
  actor: string;
}

export interface EvidenceItem {
  type: string;
  summary: string;
  uri?: string;
  timestamp?: string;
}

export interface ActionItem {
  task: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignee: string;
}

export interface Incident {
  id: string;
  incident_number: string;
  title: string;
  category: string;
  severity: IncidentSeverity;
  stage: IncidentStage;
  zone_name: string;
  zone_id?: string;
  occurred_at: string;
  reported_by: string;
  assigned_investigator?: string;
  affected_entities: {
    vehicles: string[];
    workers: string[];
    equipment: string[];
  };
  timeline: TimelineEntry[];
  evidence: EvidenceItem[];
  action_items?: ActionItem[];
  resolved_at?: string;
  closed_at?: string;
}
