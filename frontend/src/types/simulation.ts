export type VehicleType =
  | 'HAUL_TRUCK'
  | 'EXCAVATOR'
  | 'WHEEL_LOADER'
  | 'BULLDOZER'
  | 'DRILL_RIG'
  | 'WATER_TRUCK';

export type VehicleState =
  | 'IDLE'
  | 'HAULING_EMPTY'
  | 'LOADING'
  | 'HAULING_LOADED'
  | 'DUMPING'
  | 'MAINTENANCE'
  | 'BREAKDOWN';

export type WorkerRoleType =
  | 'TRUCK_OPERATOR'
  | 'EXCAVATOR_OPERATOR'
  | 'DRILL_OPERATOR'
  | 'BLAST_ENGINEER'
  | 'SURVEYOR'
  | 'SAFETY_OFFICER'
  | 'SITE_SUPERVISOR'
  | 'MAINTENANCE_TECH';

export type EquipmentType =
  | 'PRIMARY_CRUSHER'
  | 'CONVEYOR_SYSTEM'
  | 'DEWATERING_PUMP'
  | 'BLAST_DRILL'
  | 'VENTILATION_FAN'
  | 'SUBSTATION';

export type SensorType =
  | 'GAS_METHANE'
  | 'GAS_CO'
  | 'SEISMIC_PPV'
  | 'SLOPE_DISPLACEMENT'
  | 'CRACK_GAUGE'
  | 'DUST_PM10'
  | 'DUST_PM25'
  | 'NOISE_LEVEL'
  | 'PIEZOMETER_WATER'
  | 'AMBIENT_TEMP';

export type WeatherType =
  | 'CLEAR_SUNNY'
  | 'PARTLY_CLOUDY'
  | 'OVERCAST'
  | 'LIGHT_RAIN'
  | 'HEAVY_STORM'
  | 'DUST_STORM'
  | 'FOGGY';

export type SimulationScenario =
  | 'NORMAL_OPERATIONS'
  | 'HEAVY_RAIN_FLOOD'
  | 'SLOPE_INSTABILITY_WARNING'
  | 'METHANE_GAS_BREACH'
  | 'EMERGENCY_EVACUATION'
  | 'HEATWAVE_FATIGUE';

export interface Position3D {
  x: floatNumber;
  y: floatNumber;
  z: floatNumber;
}

export type floatNumber = number;

export interface GeologicalLayer {
  name: string;
  code: string;
  depthStartM: number;
  depthEndM: number;
  colorHex: string;
  hardnessMohs: number;
  stabilityRating: number;
}

export interface BenchDefinition {
  benchId: string;
  name: string;
  levelIndex: number;
  elevationM: number;
  heightM: number;
  widthM: number;
  safetyBermHeightM: number;
  faceAngleDeg: number;
  status: string;
  riskScore: number;
}

export interface RoadWaypoint {
  id: string;
  name: string;
  position: Position3D;
  type: 'INTERSECTION' | 'LOADING_POINT' | 'DUMP_POINT' | 'CRUSHER' | 'MAINTENANCE_YARD';
}

export interface RoadSegment {
  id: string;
  name: string;
  startWaypointId: string;
  endWaypointId: string;
  lengthM: number;
  gradePercent: number;
  widthM: number;
  speedLimitKmh: number;
  surfaceCondition: 'GOOD' | 'ROUGH' | 'MUDDY' | 'BLOCKED';
}

export interface TerrainMetadata {
  seed: number;
  gridWidth: number;
  gridHeight: number;
  cellSizeM: number;
  minElevationM: number;
  maxElevationM: number;
  pitDepthM: number;
  benchCount: number;
  benches: BenchDefinition[];
  roads: RoadSegment[];
  waypoints: RoadWaypoint[];
  geologicalLayers: GeologicalLayer[];
  heightmapMatrix?: number[][];
}

export interface VehicleSimState {
  id: string;
  name: string;
  code: string;
  type: VehicleType;
  state: VehicleState;
  position: Position3D;
  velocityMs: number;
  headingDeg: number;
  currentRouteWaypoints: string[];
  targetWaypointIndex: number;
  payloadTonnes: number;
  maxCapacityTonnes: number;
  fuelLevelPercent: number;
  fuelBurnRateLph: number;
  engineTempC: number;
  engineRpm: number;
  hydraulicPressureBar: number;
  tirePressureBar: number;
  healthScore: number;
  operatingHours: number;
  operatorId?: string;
  operatorName?: string;
}

export interface WorkerSimState {
  id: string;
  name: string;
  badgeNumber: string;
  role: WorkerRoleType;
  position: Position3D;
  assignedZoneId: string;
  shiftName: string;
  heartRateBpm: number;
  fatigueIndex: number;
  bodyTempC: number;
  inExclusionZone: boolean;
  ppeCompliant: boolean;
  assignedVehicleId?: string;
}

export interface EquipmentSimState {
  id: string;
  name: string;
  code: string;
  type: EquipmentType;
  position: Position3D;
  status: 'RUNNING' | 'IDLE' | 'STANDBY' | 'FAULT' | 'MAINTENANCE';
  powerDrawKw: number;
  utilizationRatePct: number;
  bearingTempC: number;
  vibrationAmplitudeMms: number;
  vibrationFrequencyHz: number;
  runtimeHours: number;
  failureProbability: number;
  efficiencyPct: number;
}

export interface SensorSimState {
  id: string;
  name: string;
  code: string;
  type: SensorType;
  position: Position3D;
  zoneId: string;
  currentValue: number;
  unit: string;
  baselineValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  batteryLevelPct: number;
}

export interface WeatherSimState {
  condition: WeatherType;
  ambientTempC: number;
  relativeHumidityPct: number;
  rainfallRateMmh: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  barometricPressureHpa: number;
  visibilityMeters: number;
  lightningRiskPct: number;
  roadFrictionCoefficient: number;
}

export interface SimulationStateSnapshot {
  timestamp: string;
  tickIndex: number;
  simulationTimeSec: number;
  scenario: SimulationScenario;
  isRunning: boolean;
  speedMultiplier: number;
  terrainSeed: number;
  weather: WeatherSimState;
  vehicles: VehicleSimState[];
  workers: WorkerSimState[];
  equipment: EquipmentSimState[];
  sensors: SensorSimState[];
  activeIncidentsCount: number;
  overallMineSafetyScore: number;
  fleetProductionRateTph: number;
}
