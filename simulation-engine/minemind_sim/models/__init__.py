"""
MineMind Simulation Engine - Domain Models
Full Pydantic models for digital twin terrain, vehicles, workers, equipment, sensors, weather, and simulation state.
"""
from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class VehicleType(str, Enum):
    HAUL_TRUCK = "HAUL_TRUCK"
    EXCAVATOR = "EXCAVATOR"
    WHEEL_LOADER = "WHEEL_LOADER"
    BULLDOZER = "BULLDOZER"
    DRILL_RIG = "DRILL_RIG"
    WATER_TRUCK = "WATER_TRUCK"


class VehicleState(str, Enum):
    IDLE = "IDLE"
    HAULING_EMPTY = "HAULING_EMPTY"
    LOADING = "LOADING"
    HAULING_LOADED = "HAULING_LOADED"
    DUMPING = "DUMPING"
    MAINTENANCE = "MAINTENANCE"
    BREAKDOWN = "BREAKDOWN"


class WorkerRoleType(str, Enum):
    TRUCK_OPERATOR = "TRUCK_OPERATOR"
    EXCAVATOR_OPERATOR = "EXCAVATOR_OPERATOR"
    DRILL_OPERATOR = "DRILL_OPERATOR"
    BLAST_ENGINEER = "BLAST_ENGINEER"
    SURVEYOR = "SURVEYOR"
    SAFETY_OFFICER = "SAFETY_OFFICER"
    SITE_SUPERVISOR = "SITE_SUPERVISOR"
    MAINTENANCE_TECH = "MAINTENANCE_TECH"


class EquipmentType(str, Enum):
    PRIMARY_CRUSHER = "PRIMARY_CRUSHER"
    CONVEYOR_SYSTEM = "CONVEYOR_SYSTEM"
    DEWATERING_PUMP = "DEWATERING_PUMP"
    BLAST_DRILL = "BLAST_DRILL"
    VENTILATION_FAN = "VENTILATION_FAN"
    SUBSTATION = "SUBSTATION"


class SensorType(str, Enum):
    GAS_METHANE = "GAS_METHANE"
    GAS_CO = "GAS_CO"
    SEISMIC_PPV = "SEISMIC_PPV"
    SLOPE_DISPLACEMENT = "SLOPE_DISPLACEMENT"
    CRACK_GAUGE = "CRACK_GAUGE"
    DUST_PM10 = "DUST_PM10"
    DUST_PM25 = "DUST_PM25"
    NOISE_LEVEL = "NOISE_LEVEL"
    PIEZOMETER_WATER = "PIEZOMETER_WATER"
    AMBIENT_TEMP = "AMBIENT_TEMP"


class WeatherType(str, Enum):
    CLEAR_SUNNY = "CLEAR_SUNNY"
    PARTLY_CLOUDY = "PARTLY_CLOUDY"
    OVERCAST = "OVERCAST"
    LIGHT_RAIN = "LIGHT_RAIN"
    HEAVY_STORM = "HEAVY_STORM"
    DUST_STORM = "DUST_STORM"
    FOGGY = "FOGGY"


class Position3D(BaseModel):
    x: float = Field(..., description="X coordinate in meters (East-West)")
    y: float = Field(..., description="Y coordinate in meters (Elevation/Height)")
    z: float = Field(..., description="Z coordinate in meters (North-South)")


class GeologicalLayer(BaseModel):
    name: str
    code: str
    depth_start_m: float
    depth_end_m: float
    color_hex: str
    hardness_mohs: float
    stability_rating: float


class BenchDefinition(BaseModel):
    bench_id: str
    name: str
    level_index: int
    elevation_m: float
    height_m: float
    width_m: float
    safety_berm_height_m: float
    face_angle_deg: float
    status: str = "ACTIVE"
    risk_score: float = 0.0


class RoadWaypoint(BaseModel):
    id: str
    name: str
    position: Position3D
    type: str  # INTERSECTION, LOADING_POINT, DUMP_POINT, CRUSHER, MAINTENANCE_YARD


class RoadSegment(BaseModel):
    id: str
    name: str
    start_waypoint_id: str
    end_waypoint_id: str
    length_m: float
    grade_percent: float
    width_m: float
    speed_limit_kmh: float
    surface_condition: str = "GOOD"  # GOOD, ROUGH, MUDDY, BLOCKED


class TerrainMetadata(BaseModel):
    seed: int
    grid_width: int
    grid_height: int
    cell_size_m: float
    min_elevation_m: float
    max_elevation_m: float
    pit_depth_m: float
    bench_count: int
    benches: List[BenchDefinition]
    roads: List[RoadSegment]
    waypoints: List[RoadWaypoint]
    geological_layers: List[GeologicalLayer]
    heightmap_matrix: Optional[List[List[float]]] = None


class VehicleSimState(BaseModel):
    id: str
    name: str
    code: str
    type: VehicleType
    state: VehicleState
    position: Position3D
    velocity_ms: float
    heading_deg: float
    current_route_waypoints: List[str] = Field(default_factory=list)
    target_waypoint_index: int = 0
    payload_tonnes: float = 0.0
    max_capacity_tonnes: float
    fuel_level_percent: float
    fuel_burn_rate_lph: float
    engine_temp_c: float
    engine_rpm: float
    hydraulic_pressure_bar: float
    tire_pressure_bar: float
    health_score: float
    operating_hours: float
    operator_id: Optional[str] = None
    operator_name: Optional[str] = None


class WorkerSimState(BaseModel):
    id: str
    name: str
    badge_number: str
    role: WorkerRoleType
    position: Position3D
    assigned_zone_id: str
    shift_name: str
    heart_rate_bpm: float
    fatigue_index: float  # 0.0 to 1.0
    body_temp_c: float
    in_exclusion_zone: bool = False
    ppe_compliant: bool = True
    assigned_vehicle_id: Optional[str] = None


class EquipmentSimState(BaseModel):
    id: str
    name: str
    code: str
    type: EquipmentType
    position: Position3D
    status: str  # RUNNING, IDLE, STANDBY, FAULT, MAINTENANCE
    power_draw_kw: float
    utilization_rate_pct: float
    bearing_temp_c: float
    vibration_amplitude_mms: float
    vibration_frequency_hz: float
    runtime_hours: float
    failure_probability: float
    efficiency_pct: float


class SensorSimState(BaseModel):
    id: str
    name: str
    code: str
    type: SensorType
    position: Position3D
    zone_id: str
    current_value: float
    unit: str
    baseline_value: float
    warning_threshold: float
    critical_threshold: float
    status: str  # NORMAL, WARNING, CRITICAL, OFFLINE
    battery_level_pct: float


class WeatherSimState(BaseModel):
    condition: WeatherType
    ambient_temp_c: float
    relative_humidity_pct: float
    rainfall_rate_mmh: float
    wind_speed_kmh: float
    wind_direction_deg: float
    barometric_pressure_hpa: float
    visibility_meters: float
    lightning_risk_pct: float
    road_friction_coefficient: float


class SimulationScenario(str, Enum):
    NORMAL_OPERATIONS = "NORMAL_OPERATIONS"
    HEAVY_RAIN_FLOOD = "HEAVY_RAIN_FLOOD"
    SLOPE_INSTABILITY_WARNING = "SLOPE_INSTABILITY_WARNING"
    METHANE_GAS_BREACH = "METHANE_GAS_BREACH"
    EMERGENCY_EVACUATION = "EMERGENCY_EVACUATION"
    HEATWAVE_FATIGUE = "HEATWAVE_FATIGUE"


class SimulationStateSnapshot(BaseModel):
    timestamp: datetime
    tick_index: int
    simulation_time_sec: float
    scenario: SimulationScenario
    is_running: bool
    speed_multiplier: float
    terrain_seed: int
    weather: WeatherSimState
    vehicles: List[VehicleSimState]
    workers: List[WorkerSimState]
    equipment: List[EquipmentSimState]
    sensors: List[SensorSimState]
    active_incidents_count: int
    overall_mine_safety_score: float
    fleet_production_rate_tph: float
