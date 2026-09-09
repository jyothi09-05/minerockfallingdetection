import { Mine, Zone, Equipment, Worker, Sensor, Alert, Incident, AuditLog, MineStats, User, AuthResponse } from '../types';

const API_BASE = '/api/v1';

// In-Memory Fallback State for offline/mock showcase
const mockUser: User = {
  id: 'usr-00000000-0000-0000-0000-000000000001',
  username: 'superadmin',
  email: 'superadmin@minemind.io',
  firstName: 'Alexander',
  lastName: 'Vance',
  fullName: 'Alexander Vance',
  jobTitle: 'Chief Technology Officer',
  department: 'Executive Operations',
  status: 'ACTIVE',
  roles: ['ROLE_SUPER_ADMIN'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

let mockMines: Mine[] = [
  {
    id: 'mine-00000000-0000-0000-0000-000000000001',
    organizationId: 'org-01',
    name: 'Prometheus Pit #4 — Supercut Copper',
    code: 'MINE-PROM-04',
    type: 'OPEN_PIT',
    commodity: 'COPPER',
    latitude: -21.4532,
    longitude: 119.8214,
    elevationMeters: 450.0,
    totalAreaHectares: 1850.5,
    status: 'ACTIVE',
    country: 'Australia',
    stateProvince: 'Western Australia',
    timezone: 'Australia/Perth',
    zoneCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mine-00000000-0000-0000-0000-000000000002',
    organizationId: 'org-01',
    name: 'Valiants Deep Gold Complex',
    code: 'MINE-VAL-09',
    type: 'UNDERGROUND',
    commodity: 'GOLD',
    latitude: 48.1205,
    longitude: -79.9812,
    elevationMeters: 280.0,
    totalAreaHectares: 920.0,
    status: 'ACTIVE',
    country: 'Canada',
    stateProvince: 'Ontario',
    timezone: 'America/Toronto',
    zoneCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockZones: Zone[] = [
  {
    id: 'zone-01',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    name: 'North Extraction Sector Alpha',
    code: 'ZN-NORTH-EXT-01',
    zoneType: 'EXTRACTION_PIT',
    hazardLevel: 'HIGH',
    maxPersonnelCapacity: 35,
    maxVehicleCapacity: 15,
    elevationRangeMin: 200,
    elevationRangeMax: 450,
    status: 'ACTIVE',
    benchCount: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zone-02',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    name: 'Primary Gyratory Crusher Hub',
    code: 'ZN-CRUSH-HUB-02',
    zoneType: 'PROCESSING_PLANT',
    hazardLevel: 'MEDIUM',
    maxPersonnelCapacity: 20,
    maxVehicleCapacity: 8,
    elevationRangeMin: 440,
    elevationRangeMax: 460,
    status: 'ACTIVE',
    benchCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'zone-04',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    name: 'Tailings Retention Basin Delta',
    code: 'ZN-TAIL-DAM-04',
    zoneType: 'TAILINGS_DAM',
    hazardLevel: 'CRITICAL',
    maxPersonnelCapacity: 10,
    maxVehicleCapacity: 4,
    elevationRangeMin: 380,
    elevationRangeMax: 410,
    status: 'ACTIVE',
    benchCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let mockEquipment: Equipment[] = [
  {
    id: 'eq-01',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    currentZoneId: 'zone-01',
    assetTag: 'EQ-SHOV-01',
    name: 'Komatsu PC8000-11 Electric-Hydraulic Shovel',
    type: 'HYDRAULIC_SHOVEL',
    modelNumber: 'PC8000-11',
    manufacturer: 'Komatsu Mining',
    capacityTonnes: 42.0,
    enginePowerKw: 2900,
    status: 'OPERATIONAL',
    healthScore: 96,
    operatingHours: 4210.5,
    createdAt: new Date().toISOString()
  },
  {
    id: 'eq-02',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    currentZoneId: 'zone-01',
    assetTag: 'EQ-TRK-101',
    name: 'Caterpillar 797F Ultra-Class Haul Truck',
    type: 'HAUL_TRUCK',
    modelNumber: '797F',
    manufacturer: 'Caterpillar',
    capacityTonnes: 363.0,
    enginePowerKw: 2983,
    status: 'OPERATIONAL',
    healthScore: 92,
    operatingHours: 6840.0,
    vehicleDetails: {
      id: 'veh-01',
      equipmentId: 'eq-02',
      licensePlate: 'WA-HT-101',
      fuelType: 'DIESEL',
      currentFuelLevelPercent: 84.5,
      currentSpeedKmh: 32.4,
      latitude: -21.4540,
      longitude: 119.8220,
      headingDegrees: 145,
      payloadWeightTonnes: 352,
      odometerKm: 48200,
      updatedAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'eq-05',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    currentZoneId: 'zone-02',
    assetTag: 'EQ-DOZ-01',
    name: 'Caterpillar D11 Heavy Track Bulldozer',
    type: 'BULLDOZER',
    modelNumber: 'D11',
    manufacturer: 'Caterpillar',
    capacityTonnes: 45.0,
    enginePowerKw: 634,
    status: 'UNDER_MAINTENANCE',
    healthScore: 74,
    operatingHours: 9850.0,
    createdAt: new Date().toISOString()
  }
];

let mockWorkers: Worker[] = [
  {
    id: 'wrk-01',
    organizationId: 'org-01',
    assignedMineId: 'mine-00000000-0000-0000-0000-000000000001',
    currentZoneId: 'zone-01',
    badgeNumber: 'BADGE-88401',
    firstName: 'Jacob',
    lastName: 'Thornton',
    fullName: 'Jacob Thornton',
    role: 'OPERATOR',
    bloodGroup: 'O+',
    emergencyContactName: 'Sarah Thornton',
    emergencyContactPhone: '+61 411 902 334',
    medicalClearanceStatus: 'VALID',
    status: 'ON_DUTY',
    rfidTagId: 'RFID-88401-TX',
    activeCertifications: ['Heavy Haulage Tier 3', 'First Aid L2'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'wrk-02',
    organizationId: 'org-01',
    assignedMineId: 'mine-00000000-0000-0000-0000-000000000001',
    currentZoneId: 'zone-01',
    badgeNumber: 'BADGE-88402',
    firstName: 'Liam',
    lastName: 'MacKenzie',
    fullName: 'Liam MacKenzie',
    role: 'BLASTING_SPECIALIST',
    bloodGroup: 'A+',
    emergencyContactName: 'Fiona MacKenzie',
    emergencyContactPhone: '+61 412 883 119',
    medicalClearanceStatus: 'VALID',
    status: 'ON_DUTY',
    rfidTagId: 'RFID-88402-TX',
    activeCertifications: ['Dangerous Goods Handler', 'Shotfirer License'],
    createdAt: new Date().toISOString()
  }
];

let mockSensors: Sensor[] = [
  {
    id: 'sns-01',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    zoneId: 'zone-01',
    sensorCode: 'SNS-GAS-CH4-01',
    name: 'Methane (CH4) Multi-Point Atmospheric Sensor',
    type: 'METHANE_GAS',
    unitOfMeasurement: 'PPM',
    minSafeThreshold: 0,
    maxSafeThreshold: 500,
    warningThreshold: 400,
    criticalThreshold: 800,
    samplingIntervalSeconds: 5,
    status: 'ACTIVE',
    latestReadingValue: 42.0,
    latestReadingTime: new Date().toISOString()
  },
  {
    id: 'sns-02',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    zoneId: 'zone-01',
    sensorCode: 'SNS-SLOPE-RAD-01',
    name: 'Interferometric Slope Stability Radar #1',
    type: 'SLOPE_RADAR_DISPLACEMENT',
    unitOfMeasurement: 'MM',
    minSafeThreshold: -5,
    maxSafeThreshold: 5,
    warningThreshold: 12,
    criticalThreshold: 25,
    samplingIntervalSeconds: 2,
    status: 'ACTIVE',
    latestReadingValue: 1.8,
    latestReadingTime: new Date().toISOString()
  }
];

let mockAlerts: Alert[] = [
  {
    id: 'alt-01',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    zoneId: 'zone-01',
    sourceType: 'SENSOR',
    alertCode: 'ALT-SLOPE-001',
    title: 'Slope Velocity Advisory - Sector Alpha',
    message: 'Sub-millimeter displacement acceleration detected on Bench 435 crest.',
    level: 'WARNING',
    isAcknowledged: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'alt-02',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    zoneId: 'zone-02',
    sourceType: 'TELEMETRY',
    alertCode: 'ALT-HYD-004',
    title: 'Bulldozer Hydraulic Pressure Loss',
    message: 'CAT D11 reported sudden 15% pressure drop in main blade circuit.',
    level: 'INFO',
    isAcknowledged: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  }
];

let mockIncidents: Incident[] = [
  {
    id: 'inc-01',
    mineId: 'mine-00000000-0000-0000-0000-000000000001',
    zoneId: 'zone-01',
    incidentNumber: 'INC-2026-0881',
    title: 'Bench 420 Minor Spallation Event',
    description: 'Localized 1.5-tonne rockfall occurred post-blasting inspection. No equipment or personnel impacted.',
    category: 'SLOPE_FAILURE',
    severity: 'LOW',
    status: 'INVESTIGATING',
    occurredAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
    injuriesCount: 0,
    fatalitiesCount: 0,
    estimatedCostUsd: 1200,
    createdAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString()
  }
];

let mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-01',
    username: 'superadmin',
    action: 'SYSTEM_INITIALIZATION',
    resourceType: 'SYSTEM',
    status: 'SUCCESS',
    details: 'MineMind AI Phase 1 Foundation operational.',
    createdAt: new Date(Date.now() - 1000 * 3600 * 12).toISOString()
  },
  {
    id: 'aud-02',
    username: 'mineadmin',
    action: 'CREATE',
    resourceType: 'ZONE',
    resourceId: 'zone-01',
    status: 'SUCCESS',
    details: 'Sector Alpha zone registered.',
    createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString()
  }
];

export const api = {
  // Auth
  login: async (identifier: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (_) {}
    // Fallback Mock
    return {
      accessToken: 'mock-jwt-token-superadmin',
      refreshToken: 'mock-refresh-token',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: mockUser,
      roles: ['ROLE_SUPER_ADMIN'],
      permissions: ['MINE_READ', 'MINE_WRITE', 'ASSET_READ', 'ASSET_WRITE', 'SAFETY_READ', 'SAFETY_WRITE', 'USER_READ', 'USER_WRITE', 'AUDIT_READ']
    };
  },

  // Mines
  getMines: async (): Promise<Mine[]> => {
    try {
      const res = await fetch(`${API_BASE}/mines`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockMines;
  },

  createMine: async (mine: Partial<Mine>): Promise<Mine> => {
    const newMine: Mine = {
      ...mockMines[0],
      id: `mine-${Date.now()}`,
      name: mine.name || 'New Mine Site',
      code: mine.code || `MINE-${Date.now().toString().slice(-4)}`,
      type: mine.type || 'OPEN_PIT',
      commodity: mine.commodity || 'COPPER',
      status: 'ACTIVE',
      zoneCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockMines.push(newMine);
    return newMine;
  },

  getMineStats: async (): Promise<MineStats> => {
    try {
      const res = await fetch(`${API_BASE}/mines/stats/summary`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (_) {}
    return {
      totalMines: mockMines.length,
      activeMines: mockMines.filter(m => m.status === 'ACTIVE').length,
      totalZones: mockZones.length,
      criticalZones: 1,
      activeWorkers: mockWorkers.length,
      operationalFleet: mockEquipment.length,
      activeAlerts: mockAlerts.filter(a => !a.isResolved).length,
      averageSafetyScore: 98.4
    };
  },

  // Zones
  getZones: async (mineId: string): Promise<Zone[]> => {
    try {
      const res = await fetch(`${API_BASE}/zones/by-mine/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (_) {}
    return mockZones;
  },

  createZone: async (zone: Partial<Zone>): Promise<Zone> => {
    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      mineId: zone.mineId || mockMines[0].id,
      name: zone.name || 'New Sector',
      code: zone.code || `ZN-${Date.now().toString().slice(-4)}`,
      zoneType: zone.zoneType || 'EXTRACTION_PIT',
      hazardLevel: zone.hazardLevel || 'LOW',
      maxPersonnelCapacity: zone.maxPersonnelCapacity || 30,
      maxVehicleCapacity: zone.maxVehicleCapacity || 10,
      status: 'ACTIVE',
      benchCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockZones.push(newZone);
    return newZone;
  },

  // Equipment
  getEquipment: async (mineId: string): Promise<Equipment[]> => {
    try {
      const res = await fetch(`${API_BASE}/equipment/by-mine/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockEquipment;
  },

  createEquipment: async (eq: Partial<Equipment>): Promise<Equipment> => {
    const newEq: Equipment = {
      id: `eq-${Date.now()}`,
      mineId: eq.mineId || mockMines[0].id,
      assetTag: eq.assetTag || `EQ-${Date.now().toString().slice(-4)}`,
      name: eq.name || 'Heavy Equipment',
      type: eq.type || 'HAUL_TRUCK',
      status: 'OPERATIONAL',
      healthScore: 100,
      operatingHours: 0,
      createdAt: new Date().toISOString()
    };
    mockEquipment.push(newEq);
    return newEq;
  },

  // Workers
  getWorkers: async (mineId: string): Promise<Worker[]> => {
    try {
      const res = await fetch(`${API_BASE}/workers/by-mine/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockWorkers;
  },

  createWorker: async (w: Partial<Worker>): Promise<Worker> => {
    const newW: Worker = {
      id: `wrk-${Date.now()}`,
      organizationId: 'org-01',
      badgeNumber: w.badgeNumber || `BADGE-${Date.now().toString().slice(-4)}`,
      firstName: w.firstName || 'Worker',
      lastName: w.lastName || 'Operator',
      fullName: `${w.firstName || 'Worker'} ${w.lastName || 'Operator'}`,
      role: w.role || 'OPERATOR',
      medicalClearanceStatus: 'VALID',
      status: 'ON_DUTY',
      createdAt: new Date().toISOString()
    };
    mockWorkers.push(newW);
    return newW;
  },

  // Sensors
  getSensors: async (mineId: string): Promise<Sensor[]> => {
    try {
      const res = await fetch(`${API_BASE}/sensors/by-mine/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockSensors;
  },

  // Alerts
  getAlerts: async (mineId: string): Promise<Alert[]> => {
    try {
      const res = await fetch(`${API_BASE}/alerts/active/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (_) {}
    return mockAlerts;
  },

  acknowledgeAlert: async (id: string): Promise<void> => {
    const a = mockAlerts.find(alt => alt.id === id);
    if (a) a.isAcknowledged = true;
  },

  // Incidents
  getIncidents: async (mineId: string): Promise<Incident[]> => {
    try {
      const res = await fetch(`${API_BASE}/incidents/by-mine/${mineId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockIncidents;
  },

  // Audit Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return mockAuditLogs;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const json = await res.json();
        return json.data.content || json.data;
      }
    } catch (_) {}
    return [mockUser];
  }
};
