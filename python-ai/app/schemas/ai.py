"""
MineMind AI - Schemas for AI Predictions, Risk Envelopes, Alerts & Model Registry
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.ml.base import PredictionResult, FeatureImportance


class RockfallPredictRequest(BaseModel):
    zone_id: Optional[str] = "ZONE-EAST-WALL"
    slope_angle_deg: Optional[float] = 65.0
    displacement_mm_day: Optional[float] = 0.45
    rainfall_mm_24h: Optional[float] = 0.0
    crack_dilation_mm: Optional[float] = 2.0
    seismic_ppv_mms: Optional[float] = 1.8
    rock_mass_rating: Optional[float] = 75.0
    historical_incidents: Optional[int] = 0


class SlopeStabilityRequest(BaseModel):
    wall_height_m: Optional[float] = 45.0
    slope_angle_deg: Optional[float] = 62.0
    cohesion_kpa: Optional[float] = 35.0
    friction_angle_deg: Optional[float] = 38.0
    water_table_height_m: Optional[float] = 12.0
    displacement_velocity_mm_day: Optional[float] = 0.5
    displacement_accel_mm_day2: Optional[float] = 0.0


class EquipmentRulRequest(BaseModel):
    equipment_id: Optional[str] = "EQ-CRUSH-01"
    operating_hours: Optional[float] = 4500.0
    bearing_temp_c: Optional[float] = 65.0
    vibration_amplitude_mms: Optional[float] = 2.5
    power_draw_kw: Optional[float] = 400.0
    rated_power_kw: Optional[float] = 650.0
    historical_overhauls: Optional[int] = 1


class CollisionCheckRequest(BaseModel):
    pos_a: List[float] = Field(default=[0.0, 500.0, 100.0])
    vel_a: List[float] = Field(default=[5.0, 0.0, 5.0])
    pos_b: List[float] = Field(default=[15.0, 500.0, 115.0])
    vel_b: List[float] = Field(default=[-4.0, 0.0, -4.0])
    road_friction: Optional[float] = 0.88


class EnvironmentalAnomalyRequest(BaseModel):
    gas_methane_lel_pct: Optional[float] = 0.12
    gas_co_ppm: Optional[float] = 4.5
    dust_pm10_ugm3: Optional[float] = 42.0
    piezo_water_kpa: Optional[float] = 45.0
    noise_db: Optional[float] = 72.0


class WorkerSafetyRequest(BaseModel):
    worker_id: Optional[str] = "WRK-001"
    nearest_vehicle_distance_m: Optional[float] = 45.0
    in_exclusion_zone: Optional[bool] = False
    fatigue_index: Optional[float] = 0.22
    ambient_temp_c: Optional[float] = 28.5
    relative_humidity_pct: Optional[float] = 42.0
    ppe_compliant: Optional[bool] = True
    heart_rate_bpm: Optional[float] = 78.0


class ZoneRiskSummary(BaseModel):
    zone_id: str
    zone_name: str
    risk_score: float
    risk_level: str
    primary_hazard: str
    active_alarms_count: int


class GlobalMineRiskResponse(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    overall_mine_risk_score: float
    overall_risk_level: str
    mine_safety_health_index: float
    rockfall_risk: PredictionResult
    slope_stability_risk: PredictionResult
    collision_risk: PredictionResult
    equipment_risk: PredictionResult
    worker_safety_risk: PredictionResult
    environmental_risk: PredictionResult
    top_contributing_factors: List[FeatureImportance]
    zone_breakdown: List[ZoneRiskSummary]


class SmartAlert(BaseModel):
    id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    source_model: str
    category: str  # GEOTECHNICAL, COLLISION, EQUIPMENT, WORKER_SAFETY, ENVIRONMENTAL
    severity: str  # INFO, LOW, MEDIUM, HIGH, CRITICAL
    title: str
    description: str
    affected_entity_id: str
    affected_zone_id: str
    risk_probability: float
    is_acknowledged: bool = False
    is_resolved: bool = False
    recommended_action: str
