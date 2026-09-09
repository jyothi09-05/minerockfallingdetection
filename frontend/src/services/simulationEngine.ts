import {
  SimulationStateSnapshot,
  SimulationScenario,
  TerrainMetadata,
  VehicleSimState,
  WorkerSimState,
  EquipmentSimState,
  SensorSimState,
  WeatherSimState,
  RoadWaypoint,
  RoadSegment,
  BenchDefinition,
  GeologicalLayer,
} from '../types/simulation';

/**
 * Deterministic client-side procedural terrain and physics simulation engine for MineMind AI.
 * Enables zero-latency 60 FPS offline digital twin execution in the browser.
 */
export class ClientSimulationEngine {
  private seed: number;
  private isRunning: boolean = true;
  private speedMultiplier: number = 1.0;
  private scenario: SimulationScenario = 'NORMAL_OPERATIONS';
  private tickIndex: number = 0;
  private simulationTimeSec: number = 0;

  public terrain: TerrainMetadata;
  public vehicles: VehicleSimState[] = [];
  public workers: WorkerSimState[] = [];
  public equipment: EquipmentSimState[] = [];
  public sensors: SensorSimState[] = [];
  public weather: WeatherSimState;

  constructor(seed: number = 42) {
    this.seed = seed;
    this.terrain = this.generateTerrain(seed);
    this.weather = this.initWeather();
    this.initFleet();
    this.initWorkforce();
    this.initEquipment();
    this.initSensors();
  }

  public generateTerrain(seed: number): TerrainMetadata {
    this.seed = seed;
    const benchCount = 6;
    const benchHeight = 15.0;
    const baseElevation = 500.0;

    const benches: BenchDefinition[] = [];
    for (let i = 0; i < benchCount; i++) {
      const elev = baseElevation - i * benchHeight;
      benches.push({
        benchId: `BENCH-${100 + i * 15}`,
        name: `Bench Level ${Math.round(elev)}m`,
        levelIndex: i + 1,
        elevationM: elev,
        heightM: benchHeight,
        widthM: 20.0 + i * 2.5,
        safetyBermHeightM: 2.2,
        faceAngleDeg: 65.0,
        status: i < benchCount - 1 ? 'ACTIVE' : 'DEVELOPMENT',
        riskScore: 0.05 + i * 0.04,
      });
    }

    const waypoints: RoadWaypoint[] = [
      { id: 'WP-CRUSHER', name: 'Primary Gyratory Crusher', position: { x: 120.0, y: 502.0, z: 140.0 }, type: 'CRUSHER' },
      { id: 'WP-DUMP-NORTH', name: 'North Waste Rock Dump', position: { x: -180.0, y: 505.0, z: 160.0 }, type: 'DUMP_POINT' },
      { id: 'WP-MAINT', name: 'Heavy Maintenance Workshop', position: { x: 200.0, y: 500.0, z: -150.0 }, type: 'MAINTENANCE_YARD' },
      { id: 'WP-SURFACE-GATE', name: 'Pit Entry Ramp Gate', position: { x: 0.0, y: 500.0, z: 100.0 }, type: 'INTERSECTION' },
      { id: 'WP-RAMP-B1', name: 'Ramp Level 1 (485m)', position: { x: 70.0, y: 485.0, z: 60.0 }, type: 'INTERSECTION' },
      { id: 'WP-RAMP-B2', name: 'Ramp Level 2 (470m)', position: { x: 90.0, y: 470.0, z: -30.0 }, type: 'INTERSECTION' },
      { id: 'WP-RAMP-B3', name: 'Ramp Level 3 (455m)', position: { x: 20.0, y: 455.0, z: -80.0 }, type: 'INTERSECTION' },
      { id: 'WP-RAMP-B4', name: 'Ramp Level 4 (440m)', position: { x: -60.0, y: 440.0, z: -50.0 }, type: 'INTERSECTION' },
      { id: 'WP-PIT-FLOOR', name: 'Pit Bottom Load Face (410m)', position: { x: -20.0, y: 410.0, z: 10.0 }, type: 'LOADING_POINT' },
      { id: 'WP-BENCH-BLAST-3', name: 'West Blast Bench Face', position: { x: -80.0, y: 455.0, z: 40.0 }, type: 'LOADING_POINT' },
    ];

    const roads: RoadSegment[] = [
      { id: 'ROAD-01', name: 'Main Surface Arterial', startWaypointId: 'WP-SURFACE-GATE', endWaypointId: 'WP-CRUSHER', lengthM: 140.0, gradePercent: 1.5, widthM: 35.0, speedLimitKmh: 45.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-02', name: 'Waste Dump Access Haulway', startWaypointId: 'WP-SURFACE-GATE', endWaypointId: 'WP-DUMP-NORTH', lengthM: 190.0, gradePercent: 2.5, widthM: 35.0, speedLimitKmh: 40.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-03', name: 'Shop Linkway', startWaypointId: 'WP-SURFACE-GATE', endWaypointId: 'WP-MAINT', lengthM: 260.0, gradePercent: 1.0, widthM: 30.0, speedLimitKmh: 35.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-04', name: 'In-Pit Spiral Ramp 1', startWaypointId: 'WP-SURFACE-GATE', endWaypointId: 'WP-RAMP-B1', lengthM: 110.0, gradePercent: 9.5, widthM: 32.0, speedLimitKmh: 30.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-05', name: 'In-Pit Spiral Ramp 2', startWaypointId: 'WP-RAMP-B1', endWaypointId: 'WP-RAMP-B2', lengthM: 125.0, gradePercent: 10.0, widthM: 30.0, speedLimitKmh: 25.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-06', name: 'In-Pit Spiral Ramp 3', startWaypointId: 'WP-RAMP-B2', endWaypointId: 'WP-RAMP-B3', lengthM: 130.0, gradePercent: 9.8, widthM: 30.0, speedLimitKmh: 25.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-07', name: 'In-Pit Spiral Ramp 4', startWaypointId: 'WP-RAMP-B3', endWaypointId: 'WP-RAMP-B4', lengthM: 120.0, gradePercent: 10.2, widthM: 28.0, speedLimitKmh: 20.0, surfaceCondition: 'GOOD' },
      { id: 'ROAD-08', name: 'Pit Floor Connector', startWaypointId: 'WP-RAMP-B4', endWaypointId: 'WP-PIT-FLOOR', lengthM: 95.0, gradePercent: 8.5, widthM: 28.0, speedLimitKmh: 20.0, surfaceCondition: 'GOOD' },
    ];

    const geologicalLayers: GeologicalLayer[] = [
      { name: 'Topsoil & Weathered Overburden', code: 'OB-01', depthStartM: 0.0, depthEndM: 12.0, colorHex: '#8B5A2B', hardnessMohs: 2.5, stabilityRating: 0.88 },
      { name: 'Sandstone & Siltstone Strata', code: 'SS-02', depthStartM: 12.0, depthEndM: 35.0, colorHex: '#D2B48C', hardnessMohs: 4.2, stabilityRating: 0.92 },
      { name: 'High-Grade Iron Ore Band', code: 'ORE-HG', depthStartM: 35.0, depthEndM: 65.0, colorHex: '#800000', hardnessMohs: 6.0, stabilityRating: 0.95 },
      { name: 'Quartzite & Basalt Footwall', code: 'QZ-04', depthStartM: 65.0, depthEndM: 120.0, colorHex: '#708090', hardnessMohs: 7.0, stabilityRating: 0.98 },
    ];

    return {
      seed,
      gridWidth: 64,
      gridHeight: 64,
      cellSizeM: 25.0,
      minElevationM: 410.0,
      maxElevationM: 515.0,
      pitDepthM: 90.0,
      benchCount,
      benches,
      roads,
      waypoints,
      geologicalLayers,
    };
  }

  private initWeather(): WeatherSimState {
    return {
      condition: 'CLEAR_SUNNY',
      ambientTempC: 28.5,
      relativeHumidityPct: 42.0,
      rainfallRateMmh: 0.0,
      windSpeedKmh: 14.0,
      windDirectionDeg: 225.0,
      barometricPressureHpa: 1013.2,
      visibilityMeters: 15000.0,
      lightningRiskPct: 0.0,
      roadFrictionCoefficient: 0.88,
    };
  }

  private initFleet() {
    this.vehicles = [
      {
        id: 'VEH-HT-101',
        name: 'CAT 797F Ultra-Class Hauler #1',
        code: 'HT-101',
        type: 'HAUL_TRUCK',
        state: 'HAULING_EMPTY',
        position: { x: 0.0, y: 500.0, z: 100.0 },
        velocityMs: 8.5,
        headingDeg: 145.0,
        currentRouteWaypoints: ['WP-SURFACE-GATE', 'WP-RAMP-B1', 'WP-RAMP-B2', 'WP-RAMP-B3', 'WP-PIT-FLOOR'],
        targetWaypointIndex: 1,
        payloadTonnes: 0.0,
        maxCapacityTonnes: 360.0,
        fuelLevelPercent: 88.5,
        fuelBurnRateLph: 145.0,
        engineTempC: 88.0,
        engineRpm: 1600.0,
        hydraulicPressureBar: 210.0,
        tirePressureBar: 7.2,
        healthScore: 0.96,
        operatingHours: 4120.5,
        operatorName: 'Marcus Vance',
      },
      {
        id: 'VEH-HT-102',
        name: 'CAT 797F Ultra-Class Hauler #2',
        code: 'HT-102',
        type: 'HAUL_TRUCK',
        state: 'HAULING_LOADED',
        position: { x: 80.0, y: 475.0, z: 20.0 },
        velocityMs: 4.2,
        headingDeg: 320.0,
        currentRouteWaypoints: ['WP-PIT-FLOOR', 'WP-RAMP-B4', 'WP-RAMP-B3', 'WP-RAMP-B2', 'WP-RAMP-B1', 'WP-SURFACE-GATE', 'WP-CRUSHER'],
        targetWaypointIndex: 3,
        payloadTonnes: 352.0,
        maxCapacityTonnes: 360.0,
        fuelLevelPercent: 74.0,
        fuelBurnRateLph: 280.0,
        engineTempC: 94.5,
        engineRpm: 1950.0,
        hydraulicPressureBar: 225.0,
        tirePressureBar: 7.4,
        healthScore: 0.91,
        operatingHours: 5890.0,
        operatorName: 'Elena Rostova',
      },
      {
        id: 'VEH-HT-103',
        name: 'Komatsu 930E-5 Electric Hauler',
        code: 'HT-103',
        type: 'HAUL_TRUCK',
        state: 'HAULING_LOADED',
        position: { x: -120.0, y: 502.0, z: 130.0 },
        velocityMs: 6.8,
        headingDeg: 310.0,
        currentRouteWaypoints: ['WP-BENCH-BLAST-3', 'WP-RAMP-B3', 'WP-RAMP-B2', 'WP-RAMP-B1', 'WP-SURFACE-GATE', 'WP-DUMP-NORTH'],
        targetWaypointIndex: 4,
        payloadTonnes: 290.0,
        maxCapacityTonnes: 300.0,
        fuelLevelPercent: 62.0,
        fuelBurnRateLph: 210.0,
        engineTempC: 89.0,
        engineRpm: 1750.0,
        hydraulicPressureBar: 215.0,
        tirePressureBar: 7.1,
        healthScore: 0.94,
        operatingHours: 3250.0,
        operatorName: 'Darius Thorne',
      },
      {
        id: 'VEH-EX-201',
        name: 'CAT 6060 Hydraulic Mining Shovel',
        code: 'EX-201',
        type: 'EXCAVATOR',
        state: 'LOADING',
        position: { x: -20.0, y: 410.0, z: 10.0 },
        velocityMs: 0.0,
        headingDeg: 85.0,
        currentRouteWaypoints: ['WP-PIT-FLOOR'],
        targetWaypointIndex: 0,
        payloadTonnes: 62.0,
        maxCapacityTonnes: 65.0,
        fuelLevelPercent: 81.0,
        fuelBurnRateLph: 190.0,
        engineTempC: 91.0,
        engineRpm: 1800.0,
        hydraulicPressureBar: 310.0,
        tirePressureBar: 0.0,
        healthScore: 0.97,
        operatingHours: 2100.0,
        operatorName: 'Kofi Mensah',
      },
      {
        id: 'VEH-DZ-301',
        name: 'CAT D11 Track-Type Dozer',
        code: 'DZ-301',
        type: 'BULLDOZER',
        state: 'IDLE',
        position: { x: -175.0, y: 505.0, z: 155.0 },
        velocityMs: 1.2,
        headingDeg: 220.0,
        currentRouteWaypoints: ['WP-DUMP-NORTH'],
        targetWaypointIndex: 0,
        payloadTonnes: 0.0,
        maxCapacityTonnes: 0.0,
        fuelLevelPercent: 69.0,
        fuelBurnRateLph: 95.0,
        engineTempC: 86.0,
        engineRpm: 1400.0,
        hydraulicPressureBar: 200.0,
        tirePressureBar: 0.0,
        healthScore: 0.95,
        operatingHours: 6400.0,
        operatorName: 'Sarah Jenkins',
      },
    ];
  }

  private initWorkforce() {
    this.workers = [
      {
        id: 'WRK-001',
        name: 'Marcus Vance',
        badgeNumber: 'MM-8801',
        role: 'TRUCK_OPERATOR',
        position: { x: 0.0, y: 500.0, z: 100.0 },
        assignedZoneId: 'ZONE-HAUL-01',
        shiftName: 'Day Shift Alpha',
        heartRateBpm: 78.0,
        fatigueIndex: 0.22,
        bodyTempC: 36.7,
        inExclusionZone: false,
        ppeCompliant: true,
        assignedVehicleId: 'VEH-HT-101',
      },
      {
        id: 'WRK-002',
        name: 'Elena Rostova',
        badgeNumber: 'MM-8802',
        role: 'TRUCK_OPERATOR',
        position: { x: 80.0, y: 475.0, z: 20.0 },
        assignedZoneId: 'ZONE-HAUL-01',
        shiftName: 'Day Shift Alpha',
        heartRateBpm: 82.0,
        fatigueIndex: 0.35,
        bodyTempC: 36.8,
        inExclusionZone: false,
        ppeCompliant: true,
        assignedVehicleId: 'VEH-HT-102',
      },
      {
        id: 'WRK-005',
        name: 'Sarah Jenkins',
        badgeNumber: 'MM-8805',
        role: 'SAFETY_OFFICER',
        position: { x: 10.0, y: 500.0, z: 80.0 },
        assignedZoneId: 'ZONE-SURFACE-ADMIN',
        shiftName: 'Day Shift Alpha',
        heartRateBpm: 72.0,
        fatigueIndex: 0.15,
        bodyTempC: 36.6,
        inExclusionZone: false,
        ppeCompliant: true,
      },
      {
        id: 'WRK-007',
        name: 'Amina Al-Mansoor',
        badgeNumber: 'MM-8807',
        role: 'SURVEYOR',
        position: { x: 60.0, y: 485.0, z: 50.0 },
        assignedZoneId: 'ZONE-RAMP-EAST',
        shiftName: 'Day Shift Alpha',
        heartRateBpm: 88.0,
        fatigueIndex: 0.25,
        bodyTempC: 36.8,
        inExclusionZone: false,
        ppeCompliant: true,
      },
    ];
  }

  private initEquipment() {
    this.equipment = [
      {
        id: 'EQ-CRUSH-01',
        name: 'Primary 60-110 Gyratory Crusher',
        code: 'CRUSH-01',
        type: 'PRIMARY_CRUSHER',
        position: { x: 120.0, y: 502.0, z: 140.0 },
        status: 'RUNNING',
        powerDrawKw: 650.0,
        utilizationRatePct: 84.5,
        bearingTempC: 68.5,
        vibrationAmplitudeMms: 3.4,
        vibrationFrequencyHz: 29.5,
        runtimeHours: 12450.0,
        failureProbability: 0.035,
        efficiencyPct: 92.0,
      },
      {
        id: 'EQ-CONV-01',
        name: 'Overland Conveyor CV-101',
        code: 'CV-101',
        type: 'CONVEYOR_SYSTEM',
        position: { x: 150.0, y: 504.0, z: 160.0 },
        status: 'RUNNING',
        powerDrawKw: 320.0,
        utilizationRatePct: 88.0,
        bearingTempC: 54.0,
        vibrationAmplitudeMms: 1.8,
        vibrationFrequencyHz: 14.2,
        runtimeHours: 18900.0,
        failureProbability: 0.02,
        efficiencyPct: 96.5,
      },
      {
        id: 'EQ-PUMP-01',
        name: 'Pit Sump Dewatering Pump DP-01',
        code: 'DP-01',
        type: 'DEWATERING_PUMP',
        position: { x: -25.0, y: 408.0, z: 15.0 },
        status: 'RUNNING',
        powerDrawKw: 180.0,
        utilizationRatePct: 92.0,
        bearingTempC: 58.0,
        vibrationAmplitudeMms: 2.1,
        vibrationFrequencyHz: 48.0,
        runtimeHours: 8740.0,
        failureProbability: 0.04,
        efficiencyPct: 89.0,
      },
    ];
  }

  private initSensors() {
    this.sensors = [
      {
        id: 'SNS-GAS-01',
        name: 'Sump Gas Monitor CH4',
        code: 'GAS-CH4-01',
        type: 'GAS_METHANE',
        position: { x: -22.0, y: 410.0, z: 12.0 },
        zoneId: 'ZONE-PIT-FLOOR',
        currentValue: 0.12,
        unit: '% LEL',
        baselineValue: 0.1,
        warningThreshold: 0.8,
        criticalThreshold: 1.5,
        status: 'NORMAL',
        batteryLevelPct: 98.0,
      },
      {
        id: 'SNS-GAS-02',
        name: 'Crusher Pocket CO Monitor',
        code: 'GAS-CO-01',
        type: 'GAS_CO',
        position: { x: 122.0, y: 502.0, z: 142.0 },
        zoneId: 'ZONE-CRUSHER',
        currentValue: 4.5,
        unit: 'ppm',
        baselineValue: 4.0,
        warningThreshold: 25.0,
        criticalThreshold: 50.0,
        status: 'NORMAL',
        batteryLevelPct: 99.0,
      },
      {
        id: 'SNS-GEO-SLOPE-01',
        name: 'East Wall Radar Displacement',
        code: 'RADAR-SLOPE-E1',
        type: 'SLOPE_DISPLACEMENT',
        position: { x: 110.0, y: 460.0, z: -10.0 },
        zoneId: 'ZONE-EAST-WALL',
        currentValue: 0.45,
        unit: 'mm/day',
        baselineValue: 0.4,
        warningThreshold: 2.5,
        criticalThreshold: 6.0,
        status: 'NORMAL',
        batteryLevelPct: 95.0,
      },
      {
        id: 'SNS-GEO-SEIS-01',
        name: 'Blast Bench Triaxial Seismograph',
        code: 'SEIS-PPV-01',
        type: 'SEISMIC_PPV',
        position: { x: -80.0, y: 455.0, z: 40.0 },
        zoneId: 'ZONE-BENCH-3-BLAST',
        currentValue: 1.8,
        unit: 'mm/s',
        baselineValue: 1.5,
        warningThreshold: 15.0,
        criticalThreshold: 25.0,
        status: 'NORMAL',
        batteryLevelPct: 94.0,
      },
      {
        id: 'SNS-GEO-CRACK-01',
        name: 'North Crest Crack Gauge',
        code: 'CRACK-EXT-N1',
        type: 'CRACK_GAUGE',
        position: { x: -40.0, y: 500.0, z: 90.0 },
        zoneId: 'ZONE-NORTH-CREST',
        currentValue: 2.1,
        unit: 'mm',
        baselineValue: 2.0,
        warningThreshold: 5.0,
        criticalThreshold: 10.0,
        status: 'NORMAL',
        batteryLevelPct: 91.0,
      },
      {
        id: 'SNS-ENV-DUST-01',
        name: 'Haul Road PM10 Sensor',
        code: 'DUST-PM10-01',
        type: 'DUST_PM10',
        position: { x: 10.0, y: 495.0, z: 85.0 },
        zoneId: 'ZONE-HAUL-01',
        currentValue: 42.0,
        unit: 'µg/m³',
        baselineValue: 40.0,
        warningThreshold: 120.0,
        criticalThreshold: 250.0,
        status: 'NORMAL',
        batteryLevelPct: 97.0,
      },
    ];
  }

  public setScenario(scenario: SimulationScenario) {
    this.scenario = scenario;
  }

  public setSpeedMultiplier(mult: number) {
    this.speedMultiplier = Math.max(0.1, Math.min(50.0, mult));
  }

  public setRunning(running: boolean) {
    this.isRunning = running;
  }

  public reset(seed?: number) {
    this.tickIndex = 0;
    this.simulationTimeSec = 0;
    this.scenario = 'NORMAL_OPERATIONS';
    if (seed !== undefined) {
      this.seed = seed;
    }
    this.terrain = this.generateTerrain(this.seed);
    this.weather = this.initWeather();
    this.initFleet();
    this.initWorkforce();
    this.initEquipment();
    this.initSensors();
  }

  public tick(dtSec: number = 0.5): SimulationStateSnapshot {
    if (!this.isRunning) {
      return this.getSnapshot();
    }

    const effectiveDt = dtSec * this.speedMultiplier;
    this.simulationTimeSec += effectiveDt;
    this.tickIndex += 1;

    // 1. Weather Update
    if (this.scenario === 'HEAVY_RAIN_FLOOD') {
      this.weather.condition = 'HEAVY_STORM';
      this.weather.rainfallRateMmh = 52.0;
      this.weather.roadFrictionCoefficient = 0.42;
      this.weather.ambientTempC = 19.5;
    } else if (this.scenario === 'HEATWAVE_FATIGUE') {
      this.weather.condition = 'CLEAR_SUNNY';
      this.weather.ambientTempC = 41.5;
      this.weather.roadFrictionCoefficient = 0.9;
    } else {
      this.weather.condition = 'CLEAR_SUNNY';
      this.weather.rainfallRateMmh = 0.0;
      this.weather.roadFrictionCoefficient = 0.88;
      this.weather.ambientTempC = 28.5;
    }

    // 2. Vehicles Kinematics
    const wpMap = new Map<string, RoadWaypoint>();
    this.terrain.waypoints.forEach((wp) => wpMap.set(wp.id, wp));

    for (const v of this.vehicles) {
      if (v.type === 'EXCAVATOR') {
        v.engineTempC = 91.0 + Math.sin(this.simulationTimeSec * 0.1) * 2.0;
        continue;
      }

      if (v.currentRouteWaypoints && v.currentRouteWaypoints.length > 0) {
        const targetWpId = v.currentRouteWaypoints[v.targetWaypointIndex];
        const targetWp = wpMap.get(targetWpId);
        if (targetWp) {
          const dx = targetWp.position.x - v.position.x;
          const dy = targetWp.position.y - v.position.y;
          const dz = targetWp.position.z - v.position.z;
          const dist = Math.sqrt(dx * dx + dz * dz);

          v.headingDeg = (Math.atan2(dx, dz) * (180 / Math.PI) + 360) % 360;

          if (dist < 6.0) {
            if (v.targetWaypointIndex < v.currentRouteWaypoints.length - 1) {
              v.targetWaypointIndex += 1;
            } else {
              // Transition cycle
              if (v.state === 'HAULING_EMPTY') {
                v.state = 'HAULING_LOADED';
                v.payloadTonnes = v.maxCapacityTonnes * 0.95;
                v.currentRouteWaypoints = ['WP-PIT-FLOOR', 'WP-RAMP-B4', 'WP-RAMP-B3', 'WP-RAMP-B2', 'WP-RAMP-B1', 'WP-SURFACE-GATE', 'WP-CRUSHER'];
                v.targetWaypointIndex = 1;
              } else {
                v.state = 'HAULING_EMPTY';
                v.payloadTonnes = 0.0;
                v.currentRouteWaypoints = ['WP-SURFACE-GATE', 'WP-RAMP-B1', 'WP-RAMP-B2', 'WP-RAMP-B3', 'WP-RAMP-B4', 'WP-PIT-FLOOR'];
                v.targetWaypointIndex = 0;
                v.position = { x: 0.0, y: 500.0, z: 100.0 };
              }
            }
          } else {
            const speed = (v.state === 'HAULING_EMPTY' ? 8.5 : 4.5) * (this.weather.roadFrictionCoefficient / 0.88);
            v.velocityMs = speed;
            const step = Math.min(dist, speed * effectiveDt);
            v.position.x += (dx / (dist + 1e-6)) * step;
            v.position.z += (dz / (dist + 1e-6)) * step;
            v.position.y += (dy / (dist + 1e-6)) * step;
            v.fuelLevelPercent = Math.max(0, v.fuelLevelPercent - (0.002 * effectiveDt));
          }
        }
      }
    }

    // 3. Workers
    const isStress = this.scenario === 'EMERGENCY_EVACUATION' || this.scenario === 'METHANE_GAS_BREACH';
    for (const w of this.workers) {
      w.fatigueIndex = Math.min(1.0, w.fatigueIndex + 0.00003 * effectiveDt);
      w.heartRateBpm = (isStress ? 110.0 : 78.0) + Math.sin(this.simulationTimeSec * 0.2) * 5.0;
    }

    // 4. Sensors
    for (const s of this.sensors) {
      let target = s.baselineValue + (Math.random() - 0.5) * (s.baselineValue * 0.06);
      if (this.scenario === 'SLOPE_INSTABILITY_WARNING' && s.type === 'SLOPE_DISPLACEMENT') {
        target = s.warningThreshold * 1.5;
      } else if (this.scenario === 'METHANE_GAS_BREACH' && s.type === 'GAS_METHANE') {
        target = s.criticalThreshold * 1.25;
      }

      s.currentValue += (target - s.currentValue) * Math.min(1.0, 0.25 * effectiveDt);
      s.currentValue = Math.round(s.currentValue * 100) / 100;

      if (s.currentValue >= s.criticalThreshold) {
        s.status = 'CRITICAL';
      } else if (s.currentValue >= s.warningThreshold) {
        s.status = 'WARNING';
      } else {
        s.status = 'NORMAL';
      }
    }

    return this.getSnapshot();
  }

  public getSnapshot(): SimulationStateSnapshot {
    const critCount = this.sensors.filter((s) => s.status === 'CRITICAL').length;
    const warnCount = this.sensors.filter((s) => s.status === 'WARNING').length;
    const incidents = critCount + (this.scenario !== 'NORMAL_OPERATIONS' ? 1 : 0);
    const safetyScore = Math.max(0.4, 1.0 - (critCount * 0.2 + warnCount * 0.05));

    const loadedCount = this.vehicles.filter((v) => v.state === 'HAULING_LOADED').length;
    const prodRate = loadedCount * 680.0;

    return {
      timestamp: new Date().toISOString(),
      tickIndex: this.tickIndex,
      simulationTimeSec: this.simulationTimeSec,
      scenario: this.scenario,
      isRunning: this.isRunning,
      speedMultiplier: this.speedMultiplier,
      terrainSeed: this.seed,
      weather: this.weather,
      vehicles: this.vehicles,
      workers: this.workers,
      equipment: this.equipment,
      sensors: this.sensors,
      activeIncidentsCount: incidents,
      overallMineSafetyScore: Math.round(safetyScore * 100) / 100,
      fleetProductionRateTph: Math.round(prodRate * 10) / 10,
    };
  }
}
