import {
  GlobalMineRiskResponse,
  PredictionResult,
  SmartAlert,
  CameraFrameAnalysis,
  ModelMetadata,
} from '../types/ai';

const AI_API_BASE = 'http://localhost:8000/api/v1';

export const aiService = {
  async getGlobalRisk(): Promise<GlobalMineRiskResponse> {
    try {
      const res = await fetch(`${AI_API_BASE}/ai/risk/global`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (res.ok) return await res.json();
    } catch {
      // Offline local fallback
    }

    return {
      timestamp: new Date().toISOString(),
      overall_mine_risk_score: 0.28,
      overall_risk_level: 'LOW',
      mine_safety_health_index: 82.5,
      rockfall_risk: {
        model_name: 'Rockfall-GradientEnsemble',
        model_version: '1.2.0',
        timestamp: new Date().toISOString(),
        probability: 0.22,
        risk_level: 'LOW',
        confidence_score: 0.94,
        contributing_factors: [
          {
            feature_name: 'Geotechnical Equilibrium',
            feature_value: 75.0,
            importance_weight: 0.8,
            impact_direction: 'NEGATIVE',
            description: 'Displacement velocity and water saturation are within nominal bounds.',
          },
        ],
        metadata: { factor_of_safety_est: 1.65, affected_zone: 'ZONE-EAST-WALL' },
      },
      slope_stability_risk: {
        model_name: 'Slope-Stability-LEM',
        model_version: '1.1.0',
        timestamp: new Date().toISOString(),
        probability: 0.18,
        risk_level: 'SAFE',
        confidence_score: 0.96,
        contributing_factors: [],
        metadata: { factor_of_safety: 1.48, slope_health_score: 88.0, displacement_trend: 'STABLE' },
      },
      collision_risk: {
        model_name: 'Fleet-Collision-Proximity',
        model_version: '2.0.0',
        timestamp: new Date().toISOString(),
        probability: 0.35,
        risk_level: 'LOW',
        confidence_score: 0.98,
        contributing_factors: [
          {
            feature_name: 'Inter-Vehicle Distance',
            feature_value: 48.0,
            importance_weight: 0.3,
            impact_direction: 'NEGATIVE',
            description: 'Maintains nominal 50m highway headway.',
          },
        ],
        metadata: { distance_meters: 48.0, closing_velocity_kmh: 12.5, time_to_collision_sec: 13.8 },
      },
      equipment_risk: {
        model_name: 'Equipment-RUL-Weibull',
        model_version: '1.3.0',
        timestamp: new Date().toISOString(),
        probability: 0.15,
        risk_level: 'SAFE',
        confidence_score: 0.95,
        contributing_factors: [],
        metadata: { health_score: 92.0, remaining_useful_life_hours: 840.0, maintenance_urgency: 'NORMAL' },
      },
      worker_safety_risk: {
        model_name: 'Worker-Safety-BiometricRisk',
        model_version: '1.1.0',
        timestamp: new Date().toISOString(),
        probability: 0.12,
        risk_level: 'SAFE',
        confidence_score: 0.96,
        contributing_factors: [],
        metadata: { heat_strain_index: 0.14, worker_safety_index: 94.0, is_ppe_compliant: true },
      },
      environmental_risk: {
        model_name: 'Env-Multivariate-IsolationTree',
        model_version: '1.2.0',
        timestamp: new Date().toISOString(),
        probability: 0.08,
        risk_level: 'SAFE',
        confidence_score: 0.97,
        contributing_factors: [],
        metadata: { methane_z_score: 0.4, co_z_score: 0.2, ventilation_status: 'NORMAL' },
      },
      top_contributing_factors: [
        {
          feature_name: 'East Wall Radar Displacement',
          feature_value: 0.45,
          importance_weight: 0.35,
          impact_direction: 'POSITIVE',
          description: 'Baseline creep on Bench 485m is stable at 0.45 mm/day.',
        },
        {
          feature_name: 'Ambient Heat Strain Index',
          feature_value: 0.14,
          importance_weight: 0.25,
          impact_direction: 'POSITIVE',
          description: '28.5°C surface temperature requires standard hydration rotation.',
        },
      ],
      zone_breakdown: [
        { zone_id: 'ZONE-EAST-WALL', zone_name: 'East Highwall Crest', risk_score: 22.0, risk_level: 'LOW', primary_hazard: 'Geotechnical Rockfall', active_alarms_count: 0 },
        { zone_id: 'ZONE-HAUL-01', zone_name: 'Main Pit Spiral Ramp', risk_score: 35.0, risk_level: 'LOW', primary_hazard: 'Haul Fleet Proximity', active_alarms_count: 1 },
        { zone_id: 'ZONE-PIT-FLOOR', zone_name: 'Pit Bottom Sump & Face', risk_score: 8.0, risk_level: 'SAFE', primary_hazard: 'Methane Seepage', active_alarms_count: 0 },
        { zone_id: 'ZONE-CRUSHER', zone_name: 'Primary Gyratory Crusher Yard', risk_score: 15.0, risk_level: 'SAFE', primary_hazard: 'Bearing Vibration', active_alarms_count: 0 },
        { zone_id: 'ZONE-BENCH-3-BLAST', zone_name: 'Bench 3 Active Shovel Face', risk_score: 12.0, risk_level: 'SAFE', primary_hazard: 'Pedestrian Heavy Shovel', active_alarms_count: 0 },
      ],
    };
  },

  async getSmartAlerts(): Promise<SmartAlert[]> {
    try {
      const res = await fetch(`${AI_API_BASE}/ai/alerts`);
      if (res.ok) return await res.json();
    } catch {}

    return [
      {
        id: 'ALT-GEO-8801',
        timestamp: new Date().toISOString(),
        source_model: 'Rockfall-GradientEnsemble',
        category: 'GEOTECHNICAL',
        severity: 'HIGH',
        title: 'East Highwall Crest Displacement Alert',
        description: 'Radar displacement velocity accelerated to 4.80 mm/day exceeding 2.50 mm/day threshold.',
        affected_entity_id: 'BENCH-130',
        affected_zone_id: 'ZONE-EAST-WALL',
        risk_probability: 0.88,
        is_acknowledged: false,
        is_resolved: false,
        recommended_action: 'Suspend haul traffic on Ramp Level 2; dispatch geotechnical survey drone.',
      },
      {
        id: 'ALT-COL-9204',
        timestamp: new Date().toISOString(),
        source_model: 'Fleet-Collision-Proximity',
        category: 'COLLISION',
        severity: 'MEDIUM',
        title: 'Haul Truck Proximity Warning HT-101 vs HT-102',
        description: 'Time-To-Collision projected at 6.8s on In-Pit Spiral Ramp 1 approach.',
        affected_entity_id: 'VEH-HT-101',
        affected_zone_id: 'ZONE-HAUL-01',
        risk_probability: 0.72,
        is_acknowledged: true,
        is_resolved: false,
        recommended_action: 'Autonomous in-cab speed advisory issued to HT-101 to maintain 50m separation buffer.',
      },
      {
        id: 'ALT-ENV-4109',
        timestamp: new Date().toISOString(),
        source_model: 'Env-Multivariate-IsolationTree',
        category: 'ENVIRONMENTAL',
        severity: 'LOW',
        title: 'Haul Road Dust Concentration Elevated',
        description: 'PM10 optical particle counter reached 142 µg/m³ near Surface Admin Gate.',
        affected_entity_id: 'SNS-ENV-DUST-01',
        affected_zone_id: 'ZONE-HAUL-01',
        risk_probability: 0.42,
        is_acknowledged: true,
        is_resolved: true,
        recommended_action: 'Dispatch CAT 777G Water Truck to spray dust suppressant.',
      },
    ];
  },

  async acknowledgeAlert(id: string): Promise<void> {
    try {
      await fetch(`${AI_API_BASE}/ai/alerts/${id}/acknowledge`, { method: 'POST' });
    } catch {}
  },

  async resolveAlert(id: string): Promise<void> {
    try {
      await fetch(`${AI_API_BASE}/ai/alerts/${id}/resolve`, { method: 'POST' });
    } catch {}
  },

  async analyzeCameraFrame(cameraId: string, injectViolation: boolean, injectSmoke: boolean): Promise<CameraFrameAnalysis> {
    try {
      const res = await fetch(`${AI_API_BASE}/ai/cv/analyze-frame`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          camera_id: cameraId,
          inject_violation: injectViolation,
          inject_smoke: injectSmoke,
        }),
      });
      if (res.ok) return await res.json();
    } catch {}

    // Fallback CV frame
    return {
      camera_id: cameraId,
      camera_name: 'Pit Floor Shovel CAM #01',
      timestamp: new Date().toISOString(),
      frame_width: 1920,
      frame_height: 1080,
      detections: [
        { class_name: 'EXCAVATOR', confidence: 0.96, box_2d: [0.25, 0.3, 0.7, 0.75], is_violation: false },
        { class_name: 'HAUL_TRUCK', confidence: 0.94, box_2d: [0.35, 0.05, 0.85, 0.4], is_violation: false },
        { class_name: 'PERSON', confidence: 0.92, box_2d: [0.6, 0.8, 0.88, 0.9], is_violation: false },
        { class_name: 'HELMET', confidence: 0.95, box_2d: [0.6, 0.83, 0.65, 0.87], is_violation: false },
        { class_name: 'HIGH_VIS_VEST', confidence: 0.93, box_2d: [0.65, 0.81, 0.78, 0.89], is_violation: false },
        ...(injectViolation
          ? [{ class_name: 'PERSON', confidence: 0.89, box_2d: [0.45, 0.35, 0.68, 0.42] as [number, number, number, number], is_violation: true, violation_reason: 'Missing Helmet in Shovel Swing Radius' }]
          : []),
      ],
      total_persons: injectViolation ? 2 : 1,
      total_vehicles: 2,
      ppe_compliance_rate_pct: injectViolation ? 50.0 : 100.0,
      hazard_detected: injectViolation || injectSmoke,
      hazard_description: injectViolation ? 'PPE Non-Compliance Alert' : undefined,
    };
  },

  async getModelRegistry(): Promise<ModelMetadata[]> {
    try {
      const res = await fetch(`${AI_API_BASE}/ai/models`);
      if (res.ok) return await res.json();
    } catch {}

    return [
      { name: 'Rockfall-GradientEnsemble', version: '1.2.0', category: 'rockfall', description: 'Geotechnical rockfall hazard prediction utilizing multi-sensor radar, dilation, and blast PPV.', is_trained: true, is_active: true, trained_at: '2026-09-01T08:00:00Z', metrics: { accuracy: 0.942, f1_score: 0.928, roc_auc: 0.965 } },
      { name: 'Slope-Stability-LEM', version: '1.1.0', category: 'slope_stability', description: 'Limit-Equilibrium & Inverse-Velocity Geotechnical Slope Stability Engine.', is_trained: true, is_active: true, trained_at: '2026-09-02T10:30:00Z', metrics: { accuracy: 0.958, f1_score: 0.945, roc_auc: 0.978 } },
      { name: 'Equipment-RUL-Weibull', version: '1.3.0', category: 'equipment_failure', description: 'Remaining Useful Life (RUL) & Mechanical Wear Failure Predictor for Heavy Plant Machinery.', is_trained: true, is_active: true, trained_at: '2026-09-03T14:15:00Z', metrics: { accuracy: 0.961, f1_score: 0.952, rmse_hours: 14.2 } },
      { name: 'Fleet-Collision-Proximity', version: '2.0.0', category: 'collision', description: 'Kinematic Trajectory & Blind-Spot Time-To-Collision (TTC) Avoidance Engine.', is_trained: true, is_active: true, trained_at: '2026-09-04T09:00:00Z', metrics: { accuracy: 0.988, detection_latency_ms: 1.4 } },
      { name: 'Env-Multivariate-IsolationTree', version: '1.2.0', category: 'environmental', description: 'Multivariate Gas, Dust PM, and Hydrostatic Surge Anomaly Detection Engine.', is_trained: true, is_active: true, trained_at: '2026-09-05T11:45:00Z', metrics: { precision: 0.962, recall: 0.948, f1_score: 0.955 } },
      { name: 'Worker-Safety-BiometricRisk', version: '1.1.0', category: 'worker_safety', description: 'Personnel Proximity, Exclusion Boundary Compliance & Heat Strain Risk Model.', is_trained: true, is_active: true, trained_at: '2026-09-06T16:20:00Z', metrics: { accuracy: 0.975, precision: 0.98, recall: 0.97 } },
    ];
  },
};
