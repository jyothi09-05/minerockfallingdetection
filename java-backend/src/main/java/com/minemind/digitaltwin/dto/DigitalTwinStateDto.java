package com.minemind.digitaltwin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DigitalTwinStateDto {
    private Instant timestamp;
    private Long tickIndex;
    private Double simulationTimeSec;
    private String scenario;
    private Boolean isRunning;
    private Double speedMultiplier;
    private Integer terrainSeed;
    private WeatherDto weather;
    private List<VehicleStateDto> vehicles;
    private List<WorkerStateDto> workers;
    private List<EquipmentStateDto> equipment;
    private List<SensorStateDto> sensors;
    private Integer activeIncidentsCount;
    private Double overallMineSafetyScore;
    private Double fleetProductionRateTph;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeatherDto {
        private String condition;
        private Double ambientTempC;
        private Double relativeHumidityPct;
        private Double rainfallRateMmh;
        private Double windSpeedKmh;
        private Double roadFrictionCoefficient;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VehicleStateDto {
        private String id;
        private String name;
        private String code;
        private String type;
        private String state;
        private Position3DDto position;
        private Double velocityMs;
        private Double headingDeg;
        private Double payloadTonnes;
        private Double maxCapacityTonnes;
        private Double fuelLevelPercent;
        private Double engineTempC;
        private String operatorName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkerStateDto {
        private String id;
        private String name;
        private String badgeNumber;
        private String role;
        private Position3DDto position;
        private String assignedZoneId;
        private Double heartRateBpm;
        private Double fatigueIndex;
        private Boolean inExclusionZone;
        private Boolean ppeCompliant;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquipmentStateDto {
        private String id;
        private String name;
        private String code;
        private String type;
        private Position3DDto position;
        private String status;
        private Double powerDrawKw;
        private Double bearingTempC;
        private Double vibrationAmplitudeMms;
        private Double runtimeHours;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SensorStateDto {
        private String id;
        private String name;
        private String code;
        private String type;
        private Position3DDto position;
        private String zoneId;
        private Double currentValue;
        private String unit;
        private String status;
    }
}
