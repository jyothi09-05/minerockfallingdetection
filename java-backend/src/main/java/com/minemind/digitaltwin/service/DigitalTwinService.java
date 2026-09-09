package com.minemind.digitaltwin.service;

import com.minemind.digitaltwin.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
public class DigitalTwinService {

    private int seed = 42;
    private boolean isRunning = true;
    private double speedMultiplier = 1.0;
    private String currentScenario = "NORMAL_OPERATIONS";
    private final AtomicLong tickCounter = new AtomicLong(0);
    private double simulationTimeSec = 0.0;

    public TerrainDto generateTerrain(int terrainSeed) {
        this.seed = terrainSeed;
        List<TerrainDto.BenchDto> benches = new ArrayList<>();
        double baseElevation = 500.0;
        int benchCount = 6;
        double benchHeight = 15.0;

        for (int i = 0; i < benchCount; i++) {
            double elev = baseElevation - (i * benchHeight);
            benches.add(TerrainDto.BenchDto.builder()
                    .benchId("BENCH-" + (100 + i * 15))
                    .name("Bench Level " + (int) elev + "m")
                    .levelIndex(i + 1)
                    .elevationM(elev)
                    .heightM(benchHeight)
                    .widthM(20.0 + (i * 2.5))
                    .status(i < benchCount - 1 ? "ACTIVE" : "DEVELOPMENT")
                    .riskScore(0.05 + (i * 0.04))
                    .build());
        }

        List<TerrainDto.WaypointDto> waypoints = List.of(
                TerrainDto.WaypointDto.builder().id("WP-CRUSHER").name("Primary Gyratory Crusher").position(new Position3DDto(120.0, 502.0, 140.0)).type("CRUSHER").build(),
                TerrainDto.WaypointDto.builder().id("WP-DUMP-NORTH").name("North Waste Rock Dump").position(new Position3DDto(-180.0, 505.0, 160.0)).type("DUMP_POINT").build(),
                TerrainDto.WaypointDto.builder().id("WP-MAINT").name("Heavy Maintenance Workshop").position(new Position3DDto(200.0, 500.0, -150.0)).type("MAINTENANCE_YARD").build(),
                TerrainDto.WaypointDto.builder().id("WP-SURFACE-GATE").name("Pit Entry Ramp Gate").position(new Position3DDto(0.0, 500.0, 100.0)).type("INTERSECTION").build(),
                TerrainDto.WaypointDto.builder().id("WP-RAMP-B1").name("Ramp Level 1 (485m)").position(new Position3DDto(70.0, 485.0, 60.0)).type("INTERSECTION").build(),
                TerrainDto.WaypointDto.builder().id("WP-RAMP-B2").name("Ramp Level 2 (470m)").position(new Position3DDto(90.0, 470.0, -30.0)).type("INTERSECTION").build(),
                TerrainDto.WaypointDto.builder().id("WP-RAMP-B3").name("Ramp Level 3 (455m)").position(new Position3DDto(20.0, 455.0, -80.0)).type("INTERSECTION").build(),
                TerrainDto.WaypointDto.builder().id("WP-RAMP-B4").name("Ramp Level 4 (440m)").position(new Position3DDto(-60.0, 440.0, -50.0)).type("INTERSECTION").build(),
                TerrainDto.WaypointDto.builder().id("WP-PIT-FLOOR").name("Pit Bottom Load Face (410m)").position(new Position3DDto(-20.0, 410.0, 10.0)).type("LOADING_POINT").build()
        );

        List<TerrainDto.RoadDto> roads = List.of(
                TerrainDto.RoadDto.builder().id("ROAD-01").name("Main Surface Arterial").startWaypointId("WP-SURFACE-GATE").endWaypointId("WP-CRUSHER").lengthM(140.0).gradePercent(1.5).speedLimitKmh(45.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-02").name("Waste Dump Haulway").startWaypointId("WP-SURFACE-GATE").endWaypointId("WP-DUMP-NORTH").lengthM(190.0).gradePercent(2.5).speedLimitKmh(40.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-04").name("In-Pit Spiral Ramp 1").startWaypointId("WP-SURFACE-GATE").endWaypointId("WP-RAMP-B1").lengthM(110.0).gradePercent(9.5).speedLimitKmh(30.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-05").name("In-Pit Spiral Ramp 2").startWaypointId("WP-RAMP-B1").endWaypointId("WP-RAMP-B2").lengthM(125.0).gradePercent(10.0).speedLimitKmh(25.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-06").name("In-Pit Spiral Ramp 3").startWaypointId("WP-RAMP-B2").endWaypointId("WP-RAMP-B3").lengthM(130.0).gradePercent(9.8).speedLimitKmh(25.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-07").name("In-Pit Spiral Ramp 4").startWaypointId("WP-RAMP-B3").endWaypointId("WP-RAMP-B4").lengthM(120.0).gradePercent(10.2).speedLimitKmh(20.0).build(),
                TerrainDto.RoadDto.builder().id("ROAD-08").name("Pit Floor Connector").startWaypointId("WP-RAMP-B4").endWaypointId("WP-PIT-FLOOR").lengthM(95.0).gradePercent(8.5).speedLimitKmh(20.0).build()
        );

        List<TerrainDto.GeologicalLayerDto> layers = List.of(
                TerrainDto.GeologicalLayerDto.builder().name("Topsoil & Weathered Overburden").code("OB-01").depthStartM(0.0).depthEndM(12.0).colorHex("#8B5A2B").stabilityRating(0.88).build(),
                TerrainDto.GeologicalLayerDto.builder().name("Sandstone & Siltstone").code("SS-02").depthStartM(12.0).depthEndM(35.0).colorHex("#D2B48C").stabilityRating(0.92).build(),
                TerrainDto.GeologicalLayerDto.builder().name("High-Grade Iron Ore Band").code("ORE-HG").depthStartM(35.0).depthEndM(65.0).colorHex("#800000").stabilityRating(0.95).build(),
                TerrainDto.GeologicalLayerDto.builder().name("Quartzite & Basalt Footwall").code("QZ-04").depthStartM(65.0).depthEndM(120.0).colorHex("#708090").stabilityRating(0.98).build()
        );

        return TerrainDto.builder()
                .seed(terrainSeed)
                .gridWidth(64)
                .gridHeight(64)
                .cellSizeM(25.0)
                .minElevationM(410.0)
                .maxElevationM(515.0)
                .pitDepthM(90.0)
                .benchCount(benchCount)
                .benches(benches)
                .roads(roads)
                .waypoints(waypoints)
                .geologicalLayers(layers)
                .build();
    }

    public DigitalTwinStateDto getSnapshot() {
        long tick = tickCounter.incrementAndGet();
        simulationTimeSec += 0.5 * speedMultiplier;

        boolean isEmergency = "EMERGENCY_EVACUATION".equals(currentScenario);
        boolean isSlopeAlert = "SLOPE_INSTABILITY_WARNING".equals(currentScenario);
        boolean isGasBreach = "METHANE_GAS_BREACH".equals(currentScenario);
        boolean isStorm = "HEAVY_RAIN_FLOOD".equals(currentScenario);

        DigitalTwinStateDto.WeatherDto weather = DigitalTwinStateDto.WeatherDto.builder()
                .condition(isStorm ? "HEAVY_STORM" : "CLEAR_SUNNY")
                .ambientTempC(isStorm ? 19.5 : 28.5)
                .relativeHumidityPct(isStorm ? 98.0 : 42.0)
                .rainfallRateMmh(isStorm ? 52.0 : 0.0)
                .windSpeedKmh(isStorm ? 64.0 : 14.0)
                .roadFrictionCoefficient(isStorm ? 0.42 : 0.88)
                .build();

        List<DigitalTwinStateDto.VehicleStateDto> vehicles = List.of(
                DigitalTwinStateDto.VehicleStateDto.builder()
                        .id("VEH-HT-101").name("CAT 797F Ultra-Class Hauler #1").code("HT-101").type("HAUL_TRUCK")
                        .state("HAULING_EMPTY").position(new Position3DDto(15.0 + Math.sin(tick * 0.05) * 30.0, 480.0, 50.0 + Math.cos(tick * 0.05) * 30.0))
                        .velocityMs(8.5).headingDeg(145.0).payloadTonnes(0.0).maxCapacityTonnes(360.0).fuelLevelPercent(86.0).engineTempC(88.0).operatorName("Marcus Vance")
                        .build(),
                DigitalTwinStateDto.VehicleStateDto.builder()
                        .id("VEH-HT-102").name("CAT 797F Ultra-Class Hauler #2").code("HT-102").type("HAUL_TRUCK")
                        .state("HAULING_LOADED").position(new Position3DDto(65.0 - Math.sin(tick * 0.04) * 25.0, 465.0, -10.0 + Math.cos(tick * 0.04) * 25.0))
                        .velocityMs(4.2).headingDeg(320.0).payloadTonnes(352.0).maxCapacityTonnes(360.0).fuelLevelPercent(72.0).engineTempC(94.0).operatorName("Elena Rostova")
                        .build(),
                DigitalTwinStateDto.VehicleStateDto.builder()
                        .id("VEH-EX-201").name("CAT 6060 Hydraulic Mining Shovel").code("EX-201").type("EXCAVATOR")
                        .state("LOADING").position(new Position3DDto(-20.0, 410.0, 10.0))
                        .velocityMs(0.0).headingDeg(85.0).payloadTonnes(62.0).maxCapacityTonnes(65.0).fuelLevelPercent(80.0).engineTempC(91.0).operatorName("Kofi Mensah")
                        .build()
        );

        List<DigitalTwinStateDto.WorkerStateDto> workers = List.of(
                DigitalTwinStateDto.WorkerStateDto.builder().id("WRK-001").name("Marcus Vance").badgeNumber("MM-8801").role("TRUCK_OPERATOR").position(new Position3DDto(0.0, 500.0, 100.0)).assignedZoneId("ZONE-HAUL-01").heartRateBpm(isEmergency ? 115.0 : 78.0).fatigueIndex(0.24).inExclusionZone(false).ppeCompliant(true).build(),
                DigitalTwinStateDto.WorkerStateDto.builder().id("WRK-005").name("Sarah Jenkins").badgeNumber("MM-8805").role("SAFETY_OFFICER").position(new Position3DDto(10.0, 500.0, 80.0)).assignedZoneId("ZONE-SURFACE-ADMIN").heartRateBpm(isEmergency ? 105.0 : 72.0).fatigueIndex(0.16).inExclusionZone(false).ppeCompliant(true).build()
        );

        List<DigitalTwinStateDto.EquipmentStateDto> equipment = List.of(
                DigitalTwinStateDto.EquipmentStateDto.builder().id("EQ-CRUSH-01").name("Primary 60-110 Gyratory Crusher").code("CRUSH-01").type("PRIMARY_CRUSHER").position(new Position3DDto(120.0, 502.0, 140.0)).status("RUNNING").powerDrawKw(650.0).bearingTempC(68.5).vibrationAmplitudeMms(3.4).runtimeHours(12450.0).build()
        );

        List<DigitalTwinStateDto.SensorStateDto> sensors = List.of(
                DigitalTwinStateDto.SensorStateDto.builder().id("SNS-GAS-01").name("Sump Gas Monitor CH4").code("GAS-CH4-01").type("GAS_METHANE").position(new Position3DDto(-22.0, 410.0, 12.0)).zoneId("ZONE-PIT-FLOOR").currentValue(isGasBreach ? 1.65 : 0.12).unit("% LEL").status(isGasBreach ? "CRITICAL" : "NORMAL").build(),
                DigitalTwinStateDto.SensorStateDto.builder().id("SNS-GEO-SLOPE-01").name("East Wall Radar Displacement").code("RADAR-SLOPE-E1").type("SLOPE_DISPLACEMENT").position(new Position3DDto(110.0, 460.0, -10.0)).zoneId("ZONE-EAST-WALL").currentValue(isSlopeAlert ? 4.80 : 0.45).unit("mm/day").status(isSlopeAlert ? "WARNING" : "NORMAL").build()
        );

        int incidents = (isGasBreach ? 1 : 0) + (isSlopeAlert ? 1 : 0) + (isStorm ? 1 : 0) + (isEmergency ? 2 : 0);
        double safetyScore = isEmergency ? 0.45 : (incidents > 0 ? 0.75 : 0.98);

        return DigitalTwinStateDto.builder()
                .timestamp(Instant.now())
                .tickIndex(tick)
                .simulationTimeSec(simulationTimeSec)
                .scenario(currentScenario)
                .isRunning(isRunning)
                .speedMultiplier(speedMultiplier)
                .terrainSeed(seed)
                .weather(weather)
                .vehicles(vehicles)
                .workers(workers)
                .equipment(equipment)
                .sensors(sensors)
                .activeIncidentsCount(incidents)
                .overallMineSafetyScore(safetyScore)
                .fleetProductionRateTph(1360.0)
                .build();
    }

    public DigitalTwinStateDto controlSimulation(SimulationControlRequest request) {
        if ("PLAY".equalsIgnoreCase(request.getAction())) {
            this.isRunning = true;
        } else if ("PAUSE".equalsIgnoreCase(request.getAction())) {
            this.isRunning = false;
        } else if ("RESET".equalsIgnoreCase(request.getAction())) {
            this.tickCounter.set(0);
            this.simulationTimeSec = 0.0;
            this.currentScenario = "NORMAL_OPERATIONS";
            if (request.getSeed() != null) {
                this.seed = request.getSeed();
            }
        }

        if (request.getSpeedMultiplier() != null) {
            this.speedMultiplier = Math.max(0.1, Math.min(50.0, request.getSpeedMultiplier()));
        }

        if (request.getScenario() != null) {
            this.currentScenario = request.getScenario();
        }

        return getSnapshot();
    }
}
