export interface SafetyTrendPoint {
  date: string;
  incident_count: number;
  near_misses: number;
  tarp_yellow_events: number;
  risk_composite_index: number;
  ppe_compliance_pct: number;
}

export interface SafetyAnalytics {
  period: string;
  total_incidents: number;
  lost_time_injuries: number;
  near_misses_reported: number;
  current_tarp_level: string;
  safety_health_score_pct: number;
  trends: SafetyTrendPoint[];
}

export interface ProductionAnalytics {
  shift_id: string;
  ore_tonnage_hauled_tons: number;
  waste_tonnage_hauled_tons: number;
  target_tonnage_tons: number;
  progress_pct: number;
  average_truck_cycle_time_min: number;
  shovel_utilization_pct: number;
  crusher_throughput_tph: number;
  hourly_throughput_history: { hour: string; tonnage: number }[];
}

export interface EquipmentAnalytics {
  fleet_availability_pct: number;
  mean_time_between_failures_hrs: number;
  mean_time_to_repair_hrs: number;
  active_haul_trucks: number;
  standby_trucks: number;
  maintenance_due_trucks: number;
  active_shovels: number;
  weibull_rul_forecast: {
    unit_id: string;
    subsystem: string;
    rul_hours: number;
    failure_prob_pct: number;
  }[];
}

export interface EnvironmentalAnalytics {
  air_quality_index: string;
  dust_pm10_avg_ug_m3: number;
  dust_pm25_avg_ug_m3: number;
  rainfall_cumulative_24h_mm: number;
  pit_sump_water_level_m: number;
  dewatering_discharge_m3_h: number;
  ambient_temp_c: number;
  wind_speed_kmh: number;
}

export interface AiModelPerformance {
  model: string;
  accuracy_pct: number;
  latency_ms: number;
  status: string;
}

export interface AiAnalytics {
  models_deployed: number;
  total_inferences_24h: number;
  average_latency_ms: number;
  overall_accuracy_pct: number;
  model_performance: AiModelPerformance[];
}

export interface AnalyticsOverview {
  safety: SafetyAnalytics;
  production: ProductionAnalytics;
  equipment: EquipmentAnalytics;
  environmental: EnvironmentalAnalytics;
  ai_models: AiAnalytics;
}
