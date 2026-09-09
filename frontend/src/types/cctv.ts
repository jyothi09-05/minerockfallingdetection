/**
 * MineMind AI - CCTV Surveillance & Computer Vision Types
 * 100% Offline & Local Type Definitions
 */

export interface PTZStatus {
  pan_deg: number;
  tilt_deg: number;
  zoom_level: number;
  is_patrolling: boolean;
}

export interface CameraConfig {
  camera_id: string;
  camera_name: string;
  zone_id: string;
  zone_name: string;
  mine_id: string;
  coordinates: [number, number, number];
  orientation_deg: number;
  fov_degrees: number;
  resolution: string;
  fps: number;
  operational_status: 'ACTIVE' | 'OFFLINE' | 'MAINTENANCE' | 'DEGRADED';
  ai_monitoring_status: 'ENABLED' | 'PAUSED' | 'CALIBRATING';
  recording_status: 'RECORDING' | 'IDLE' | 'ERROR';
  health_score_pct: number;
  latency_ms: number;
  dropped_frames_pct: number;
  last_heartbeat: string;
  ptz: PTZStatus;
  supported_models: string[];
  stream_type: 'SYNTHETIC_SIMULATOR' | 'LOCAL_WEBCAM' | 'LOCAL_MP4';
}

export interface DetectionBoundingBox {
  class_name: string;
  confidence: number;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized (0 to 1)
  is_violation: boolean;
  violation_reason?: string | null;
  track_id?: number | null;
}

export interface TrackedObject {
  track_id: number;
  class_name: string;
  box_2d: [number, number, number, number];
  center: [number, number];
  velocity: [number, number];
  speed_mps: number;
  trajectory: [number, number][];
  first_seen: number;
  last_seen: number;
  missed_frames: number;
  is_violation: boolean;
  violation_reason?: string | null;
}

export interface ZoneIncursion {
  zone_id: string;
  zone_name: string;
  hazard_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  entity_class: string;
  track_id: number;
  incursion_point: [number, number];
  description: string;
}

export interface ProximityWarning {
  worker_track_id: number;
  vehicle_track_id: number;
  vehicle_class: string;
  distance_meters: number;
  is_danger: boolean;
  description: string;
}

export interface CameraFrameAnalysis {
  camera_id: string;
  camera_name: string;
  timestamp: string;
  frame_width: number;
  frame_height: number;
  fps: number;
  detections: DetectionBoundingBox[];
  tracked_objects: TrackedObject[];
  zone_incursions: ZoneIncursion[];
  proximity_warnings: ProximityWarning[];
  total_persons: number;
  total_vehicles: number;
  ppe_compliance_rate_pct: number;
  hazard_detected: boolean;
  hazard_description?: string | null;
  frame_sequence: number;
}

export interface CCTVEvent {
  event_id: string;
  camera_id: string;
  camera_name: string;
  zone_id: string;
  zone_name: string;
  event_type:
    | 'PERSON_DETECTED'
    | 'VEHICLE_DETECTED'
    | 'PPE_VIOLATION'
    | 'RESTRICTED_ZONE_ENTRY'
    | 'PROXIMITY_WARNING'
    | 'SMOKE_DETECTED'
    | 'FIRE_INDICATION'
    | 'ABNORMAL_ACTIVITY'
    | 'CAMERA_OFFLINE'
    | 'CAMERA_TAMPER_INDICATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  description: string;
  confidence: number;
  bounding_boxes: DetectionBoundingBox[];
  metadata: Record<string, any>;
  incident_created: boolean;
  incident_id?: string | null;
}

export interface CameraHealthSummary {
  total_cameras: number;
  active_cameras: number;
  offline_cameras: number;
  degraded_cameras: number;
  ai_monitoring_enabled: number;
  average_health_score_pct: number;
  average_latency_ms: number;
  total_active_violations: number;
}

export interface VirtualSafetyZone {
  zone_id: string;
  camera_id: string;
  name: string;
  hazard_type: string;
  polygon_points: [number, number][];
  is_active: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface IncidentReplayFrame {
  frame_index: number;
  time_offset_seconds: number;
  timestamp: string;
  is_incident_climax: boolean;
  camera_id: string;
  camera_name: string;
  annotations: DetectionBoundingBox[];
}

export interface IncidentCCTVReplay {
  incident_id: string;
  camera_id: string;
  camera_name: string;
  event_type: string;
  event_timestamp: string;
  severity: string;
  description: string;
  total_replay_duration_sec: number;
  replay_frames: IncidentReplayFrame[];
}
