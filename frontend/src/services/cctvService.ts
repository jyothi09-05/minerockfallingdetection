/**
 * MineMind AI - CCTV Intelligence Service
 * Interacts with local FastAPI CCTV endpoints with offline fallback.
 * 100% Offline & Local.
 */
import {
  CameraConfig,
  CameraFrameAnalysis,
  CCTVEvent,
  CameraHealthSummary,
  VirtualSafetyZone,
  IncidentCCTVReplay
} from '../types/cctv';

const API_BASE = 'http://localhost:8000/api/v1/cctv';

const DEFAULT_CAMERAS: CameraConfig[] = [
  {
    camera_id: 'CAM-PIT-01',
    camera_name: 'Pit Floor Shovel CAM #01',
    zone_id: 'ZONE-PIT-01',
    zone_name: 'Pit Floor Loading Zone',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [150.0, -120.0, 35.0],
    orientation_deg: 45.0,
    fov_degrees: 75.0,
    resolution: '1920x1080',
    fps: 30,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 99.2,
    latency_ms: 12.5,
    dropped_frames_pct: 0.02,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: 10.0, tilt_deg: -20.0, zoom_level: 1.2, is_patrolling: true },
    supported_models: ['PPE_COMPLIANCE', 'RESTRICTED_ZONE_GEOFENCE'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  },
  {
    camera_id: 'CAM-NW-02',
    camera_name: 'North Wall Highwall Monitor #02',
    zone_id: 'ZONE-NW-01',
    zone_name: 'North-West Sector Benches',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [85.0, 180.0, 95.0],
    orientation_deg: 135.0,
    fov_degrees: 80.0,
    resolution: '2560x1440',
    fps: 25,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 97.8,
    latency_ms: 18.0,
    dropped_frames_pct: 0.08,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: 0.0, tilt_deg: -30.0, zoom_level: 1.5, is_patrolling: false },
    supported_models: ['RESTRICTED_ZONE_GEOFENCE'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  },
  {
    camera_id: 'CAM-RAMP-03',
    camera_name: 'Haul Road Main Incline Junction #03',
    zone_id: 'ZONE-RAMP-01',
    zone_name: 'Haul Road Switchback #2',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [-60.0, -40.0, 60.0],
    orientation_deg: 210.0,
    fov_degrees: 65.0,
    resolution: '1920x1080',
    fps: 30,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 98.9,
    latency_ms: 14.0,
    dropped_frames_pct: 0.03,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: -15.0, tilt_deg: -10.0, zoom_level: 1.0, is_patrolling: true },
    supported_models: ['VEHICLE_TRACKER', 'PROXIMITY_SAFETY'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  },
  {
    camera_id: 'CAM-CRU-04',
    camera_name: 'Primary Gyratory Crusher Hopper #04',
    zone_id: 'ZONE-CRU-01',
    zone_name: 'Primary Crusher Discharge',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [280.0, 210.0, 110.0],
    orientation_deg: 315.0,
    fov_degrees: 70.0,
    resolution: '1920x1080',
    fps: 30,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 96.4,
    latency_ms: 16.8,
    dropped_frames_pct: 0.12,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: 5.0, tilt_deg: -45.0, zoom_level: 1.8, is_patrolling: false },
    supported_models: ['SMOKE_FIRE_ANOMALY'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  },
  {
    camera_id: 'CAM-SUMP-05',
    camera_name: 'Pit Sump Dewatering Substation #05',
    zone_id: 'ZONE-SUMP-01',
    zone_name: 'Pit Floor Sump & Pump House',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [-110.0, -190.0, 15.0],
    orientation_deg: 60.0,
    fov_degrees: 60.0,
    resolution: '1920x1080',
    fps: 20,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 95.1,
    latency_ms: 22.4,
    dropped_frames_pct: 0.15,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: 0.0, tilt_deg: -15.0, zoom_level: 1.0, is_patrolling: false },
    supported_models: ['PPE_COMPLIANCE'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  },
  {
    camera_id: 'CAM-STOCK-06',
    camera_name: 'ROM Stockpile Stacker / Reclaimer #06',
    zone_id: 'ZONE-STOCK-01',
    zone_name: 'High-Grade ROM Stockpile',
    mine_id: 'MINE-ALPHA-01',
    coordinates: [220.0, -80.0, 85.0],
    orientation_deg: 170.0,
    fov_degrees: 85.0,
    resolution: '1920x1080',
    fps: 30,
    operational_status: 'ACTIVE',
    ai_monitoring_status: 'ENABLED',
    recording_status: 'RECORDING',
    health_score_pct: 99.0,
    latency_ms: 11.9,
    dropped_frames_pct: 0.01,
    last_heartbeat: new Date().toISOString(),
    ptz: { pan_deg: 30.0, tilt_deg: -25.0, zoom_level: 1.1, is_patrolling: true },
    supported_models: ['PPE_COMPLIANCE', 'VEHICLE_TRACKER'],
    stream_type: 'SYNTHETIC_SIMULATOR'
  }
];

export const cctvService = {
  async getCameras(zoneId?: string, status?: string): Promise<CameraConfig[]> {
    try {
      const params = new URLSearchParams();
      if (zoneId) params.append('zone_id', zoneId);
      if (status) params.append('operational_status', status);
      const res = await fetch(`${API_BASE}/cameras?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CAMERAS;
  },

  async getCamera(cameraId: string): Promise<CameraConfig> {
    try {
      const res = await fetch(`${API_BASE}/cameras/${cameraId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CAMERAS.find((c) => c.camera_id === cameraId) || DEFAULT_CAMERAS[0];
  },

  async updatePTZ(cameraId: string, panDeg: number, tiltDeg: number, zoomLevel: number): Promise<CameraConfig> {
    try {
      const res = await fetch(`${API_BASE}/cameras/${cameraId}/ptz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan_deg: panDeg, tilt_deg: tiltDeg, zoom_level: zoomLevel })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const cam = DEFAULT_CAMERAS.find((c) => c.camera_id === cameraId) || DEFAULT_CAMERAS[0];
    return {
      ...cam,
      ptz: { ...cam.ptz, pan_deg: panDeg, tilt_deg: tiltDeg, zoom_level: zoomLevel }
    };
  },

  async updateCameraStatus(cameraId: string, operationalStatus: string, aiMonitoringStatus?: string): Promise<CameraConfig> {
    try {
      const res = await fetch(`${API_BASE}/cameras/${cameraId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operational_status: operationalStatus, ai_monitoring_status: aiMonitoringStatus })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const cam = DEFAULT_CAMERAS.find((c) => c.camera_id === cameraId) || DEFAULT_CAMERAS[0];
    return {
      ...cam,
      operational_status: operationalStatus as any,
      ai_monitoring_status: (aiMonitoringStatus as any) || cam.ai_monitoring_status
    };
  },

  async getCameraFrame(
    cameraId: string,
    options?: { injectViolation?: boolean; injectSmoke?: boolean; injectIncursion?: boolean }
  ): Promise<CameraFrameAnalysis> {
    try {
      const params = new URLSearchParams();
      if (options?.injectViolation) params.append('inject_violation', 'true');
      if (options?.injectSmoke) params.append('inject_smoke', 'true');
      if (options?.injectIncursion) params.append('inject_incursion', 'true');
      const res = await fetch(`${API_BASE}/cameras/${cameraId}/frame?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      camera_id: cameraId,
      camera_name: DEFAULT_CAMERAS.find((c) => c.camera_id === cameraId)?.camera_name || cameraId,
      timestamp: new Date().toISOString(),
      frame_width: 1920,
      frame_height: 1080,
      fps: 30,
      detections: [
        {
          class_name: 'EXCAVATOR',
          confidence: 0.96,
          box_2d: [0.25, 0.3, 0.7, 0.75],
          is_violation: false
        },
        {
          class_name: 'HAUL_TRUCK',
          confidence: 0.94,
          box_2d: [0.35, 0.05, 0.85, 0.4],
          is_violation: false
        },
        {
          class_name: 'PERSON',
          confidence: 0.92,
          box_2d: [0.6, 0.8, 0.88, 0.9],
          is_violation: options?.injectViolation || false,
          violation_reason: options?.injectViolation ? 'Missing Helmet in Shovel Radius' : undefined,
          track_id: 101
        }
      ],
      tracked_objects: [
        {
          track_id: 101,
          class_name: 'PERSON',
          box_2d: [0.6, 0.8, 0.88, 0.9],
          center: [0.85, 0.74],
          velocity: [0.01, 0.0],
          speed_mps: 1.2,
          trajectory: [[0.84, 0.74], [0.85, 0.74]],
          first_seen: 100,
          last_seen: 101,
          missed_frames: 0,
          is_violation: options?.injectViolation || false
        }
      ],
      zone_incursions: [],
      proximity_warnings: [],
      total_persons: 1,
      total_vehicles: 2,
      ppe_compliance_rate_pct: options?.injectViolation ? 50.0 : 100.0,
      hazard_detected: options?.injectViolation || options?.injectSmoke || options?.injectIncursion || false,
      hazard_description: options?.injectViolation ? 'PPE Non-Compliance Alert' : undefined,
      frame_sequence: 1
    };
  },

  async getEvents(filters?: {
    cameraId?: string;
    zoneId?: string;
    eventType?: string;
    severity?: string;
    limit?: number;
  }): Promise<CCTVEvent[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.cameraId) params.append('camera_id', filters.cameraId);
      if (filters?.zoneId) params.append('zone_id', filters.zoneId);
      if (filters?.eventType) params.append('event_type', filters.eventType);
      if (filters?.severity) params.append('severity', filters.severity);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      const res = await fetch(`${API_BASE}/events?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return [
      {
        event_id: 'EVT-88A1',
        camera_id: 'CAM-PIT-01',
        camera_name: 'Pit Floor Shovel CAM #01',
        zone_id: 'ZONE-PIT-01',
        zone_name: 'Pit Floor Loading Zone',
        event_type: 'PPE_VIOLATION',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 480000).toISOString(),
        description: 'Worker detected within 15m radius of CAT 7495 shovel without safety helmet.',
        confidence: 0.94,
        bounding_boxes: [],
        metadata: {},
        incident_created: false
      },
      {
        event_id: 'EVT-77B2',
        camera_id: 'CAM-NW-02',
        camera_name: 'North Wall Highwall Monitor #02',
        zone_id: 'ZONE-NW-01',
        zone_name: 'North-West Sector Benches',
        event_type: 'RESTRICTED_ZONE_ENTRY',
        severity: 'CRITICAL',
        timestamp: new Date(Date.now() - 840000).toISOString(),
        description: 'Personnel incursion into Bench 1350 highwall exclusion buffer.',
        confidence: 0.91,
        bounding_boxes: [],
        metadata: {},
        incident_created: true,
        incident_id: 'INC-2026-001'
      }
    ];
  },

  async getHealthSummary(): Promise<CameraHealthSummary> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return {
      total_cameras: 6,
      active_cameras: 6,
      offline_cameras: 0,
      degraded_cameras: 0,
      ai_monitoring_enabled: 6,
      average_health_score_pct: 97.7,
      average_latency_ms: 15.3,
      total_active_violations: 1
    };
  },

  async getZones(cameraId?: string): Promise<VirtualSafetyZone[]> {
    try {
      const params = new URLSearchParams();
      if (cameraId) params.append('camera_id', cameraId);
      const res = await fetch(`${API_BASE}/zones?${params.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return [
      {
        zone_id: 'VZ-PIT-01',
        camera_id: 'CAM-PIT-01',
        name: 'Excavator 15m Swing Hazard Zone',
        hazard_type: 'SWING_RADIUS',
        polygon_points: [[0.20, 0.20], [0.85, 0.20], [0.85, 0.80], [0.20, 0.80]],
        is_active: true,
        severity: 'CRITICAL',
        description: 'Rotating upper-carriage and bucket trajectory zone for Shovel-01'
      }
    ];
  },

  async getIncidentReplay(incidentId: string): Promise<IncidentCCTVReplay> {
    try {
      const res = await fetch(`${API_BASE}/replays/${incidentId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    return {
      incident_id: incidentId,
      camera_id: 'CAM-NW-02',
      camera_name: 'North Wall Highwall Monitor #02',
      event_type: 'RESTRICTED_ZONE_ENTRY',
      event_timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      description: 'Personnel incursion into Bench 1350 exclusion buffer.',
      total_replay_duration_sec: 22.0,
      replay_frames: [
        {
          frame_index: 0,
          time_offset_seconds: -10,
          timestamp: new Date().toISOString(),
          is_incident_climax: false,
          camera_id: 'CAM-NW-02',
          camera_name: 'North Wall Highwall Monitor #02',
          annotations: []
        },
        {
          frame_index: 5,
          time_offset_seconds: 0,
          timestamp: new Date().toISOString(),
          is_incident_climax: true,
          camera_id: 'CAM-NW-02',
          camera_name: 'North Wall Highwall Monitor #02',
          annotations: []
        }
      ]
    };
  }
};
