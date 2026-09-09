export type RoleType = 
  | 'ROLE_SUPER_ADMIN'
  | 'ROLE_MINE_ADMIN'
  | 'ROLE_MINE_MANAGER'
  | 'ROLE_SAFETY_OFFICER'
  | 'ROLE_GEOLOGIST'
  | 'ROLE_MAINTENANCE_ENGINEER'
  | 'ROLE_OPERATOR'
  | 'ROLE_WORKER'
  | 'ROLE_VIEWER';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'DEACTIVATED' | 'LOCKED';

export interface User {
  id: string;
  organizationId?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  jobTitle?: string;
  department?: string;
  status: AccountStatus;
  roles: string[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  roles: string[];
  permissions: string[];
}

export type MineType = 'OPEN_PIT' | 'UNDERGROUND' | 'PLACER' | 'IN_SITU' | 'COMBINED';
export type CommodityType = 'COPPER' | 'GOLD' | 'IRON_ORE' | 'COAL' | 'LITHIUM' | 'BAUXITE' | 'NICKEL' | 'ZINC' | 'SILVER';
export type MineStatus = 'ACTIVE' | 'MAINTENANCE' | 'STANDBY' | 'DECOMMISSIONED' | 'EVACUATION_ALERT';

export interface Mine {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: MineType;
  commodity: CommodityType;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  totalAreaHectares: number;
  status: MineStatus;
  country: string;
  stateProvince?: string;
  timezone: string;
  zoneCount: number;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export type ZoneType = 'EXTRACTION_PIT' | 'PROCESSING_PLANT' | 'WASTE_DUMP' | 'TAILINGS_DAM' | 'STOCKPILE' | 'BLAST_ZONE' | 'WORKSHOP' | 'REFUELING_STATION';
export type HazardLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'RESTRICTED';
export type ZoneStatus = 'ACTIVE' | 'EVACUATED' | 'MAINTENANCE' | 'RESTRICTED' | 'STANDBY';

export interface Zone {
  id: string;
  mineId: string;
  name: string;
  code: string;
  zoneType: ZoneType;
  hazardLevel: HazardLevel;
  maxPersonnelCapacity: number;
  maxVehicleCapacity: number;
  boundaryCoordinates?: string;
  elevationRangeMin?: number;
  elevationRangeMax?: number;
  status: ZoneStatus;
  benchCount: number;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bench {
  id: string;
  zoneId: string;
  name: string;
  benchNumber: number;
  elevationMeters: number;
  heightMeters: number;
  widthMeters: number;
  slopeAngleDegrees: number;
  stabilityFactor: number;
  status: string;
  createdAt: string;
}

export interface Road {
  id: string;
  mineId: string;
  name: string;
  code: string;
  roadType: string;
  surfaceType: string;
  lengthMeters: number;
  averageWidthMeters: number;
  maxGradientPercent: number;
  speedLimitKmh: number;
  maxWeightCapacityTonnes: number;
  status: string;
  createdAt: string;
}

export type EquipmentType = 'HYDRAULIC_SHOVEL' | 'HAUL_TRUCK' | 'ROTARY_DRILL' | 'WHEEL_LOADER' | 'BULLDOZER' | 'MOTOR_GRADER' | 'CRUSHER' | 'CONVEYOR_BELT' | 'WATER_TRUCK';
export type EquipmentStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'CRITICAL_FAULT' | 'OFFLINE' | 'DECOMMISSIONED' | 'STANDBY';

export interface Equipment {
  id: string;
  mineId: string;
  currentZoneId?: string;
  assetTag: string;
  name: string;
  type: EquipmentType;
  modelNumber?: string;
  serialNumber?: string;
  manufacturer?: string;
  manufactureYear?: number;
  capacityTonnes?: number;
  enginePowerKw?: number;
  fuelCapacityLiters?: number;
  status: EquipmentStatus;
  healthScore: number;
  operatingHours: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  vehicleDetails?: Vehicle;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  equipmentId: string;
  licensePlate?: string;
  fuelType: string;
  currentFuelLevelPercent: number;
  currentSpeedKmh: number;
  latitude?: number;
  longitude?: number;
  headingDegrees: number;
  assignedDriverId?: string;
  payloadWeightTonnes: number;
  odometerKm: number;
  updatedAt: string;
}

export interface Worker {
  id: string;
  organizationId: string;
  userId?: string;
  assignedMineId?: string;
  currentZoneId?: string;
  badgeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalClearanceStatus: string;
  status: string;
  rfidTagId?: string;
  activeCertifications?: string[];
  createdAt: string;
}

export interface Sensor {
  id: string;
  mineId: string;
  zoneId?: string;
  sensorCode: string;
  name: string;
  type: string;
  unitOfMeasurement: string;
  minSafeThreshold?: number;
  maxSafeThreshold?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  samplingIntervalSeconds: number;
  latitude?: number;
  longitude?: number;
  elevationMeters?: number;
  status: string;
  latestReadingValue?: number;
  latestReadingTime?: string;
}

export interface Alert {
  id: string;
  mineId: string;
  zoneId?: string;
  sourceType: string;
  sourceId?: string;
  alertCode: string;
  title: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY_EVACUATION';
  isAcknowledged: boolean;
  acknowledgedById?: string;
  acknowledgedAt?: string;
  isResolved: boolean;
  createdAt: string;
}

export interface Incident {
  id: string;
  mineId: string;
  zoneId?: string;
  incidentNumber: string;
  title: string;
  description: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'CATASTROPHIC';
  status: string;
  reportedById?: string;
  occurredAt: string;
  injuriesCount: number;
  fatalitiesCount: number;
  estimatedCostUsd: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  organizationId?: string;
  userId?: string;
  username?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  status: string;
  details?: string;
  createdAt: string;
}

export interface MineStats {
  totalMines: number;
  activeMines: number;
  totalZones: number;
  criticalZones: number;
  activeWorkers: number;
  operationalFleet: number;
  activeAlerts: number;
  averageSafetyScore: number;
}
