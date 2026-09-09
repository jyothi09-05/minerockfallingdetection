export interface FeatureImportance {
  feature_name: string;
  feature_value: number;
  importance_weight: number;
  impact_direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
}

export interface PredictionResult {
  model_name: string;
  model_version: string;
  timestamp: string;
  probability: number;
  risk_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence_score: number;
  contributing_factors: FeatureImportance[];
  metadata: Record<string, any>;
}

export interface ZoneRiskSummary {
  zone_id: string;
  zone_name: string;
  risk_score: number;
  risk_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primary_hazard: string;
  active_alarms_count: number;
}

export interface GlobalMineRiskResponse {
  timestamp: string;
  overall_mine_risk_score: number;
  overall_risk_level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mine_safety_health_index: number;
  rockfall_risk: PredictionResult;
  slope_stability_risk: PredictionResult;
  collision_risk: PredictionResult;
  equipment_risk: PredictionResult;
  worker_safety_risk: PredictionResult;
  environmental_risk: PredictionResult;
  top_contributing_factors: FeatureImportance[];
  zone_breakdown: ZoneRiskSummary[];
}

export interface SmartAlert {
  id: string;
  timestamp: string;
  source_model: string;
  category: 'GEOTECHNICAL' | 'COLLISION' | 'EQUIPMENT' | 'WORKER_SAFETY' | 'ENVIRONMENTAL';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  affected_entity_id: string;
  affected_zone_id: string;
  risk_probability: number;
  is_acknowledged: boolean;
  is_resolved: boolean;
  recommended_action: string;
}

export interface DetectionBoundingBox {
  class_name: string;
  confidence: number;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  is_violation: boolean;
  violation_reason?: string;
}

export interface CameraFrameAnalysis {
  camera_id: string;
  camera_name: string;
  timestamp: string;
  frame_width: number;
  frame_height: number;
  detections: DetectionBoundingBox[];
  total_persons: number;
  total_vehicles: number;
  ppe_compliance_rate_pct: number;
  hazard_detected: boolean;
  hazard_description?: string;
}

export interface ModelMetadata {
  name: string;
  version: string;
  category: string;
  description: string;
  is_trained: boolean;
  is_active: boolean;
  trained_at: string;
  metrics: Record<string, number>;
}
