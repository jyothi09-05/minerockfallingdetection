package com.minemind.sensor.dto;

import com.minemind.sensor.enums.SensorStatus;
import com.minemind.sensor.enums.SensorType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorResponse {
    private String id;
    private String mineId;
    private String zoneId;
    private String sensorCode;
    private String name;
    private SensorType type;
    private String unitOfMeasurement;
    private Double minSafeThreshold;
    private Double maxSafeThreshold;
    private Double warningThreshold;
    private Double criticalThreshold;
    private Integer samplingIntervalSeconds;
    private Double latitude;
    private Double longitude;
    private Double elevationMeters;
    private SensorStatus status;
    private Double latestReadingValue;
    private Instant latestReadingTime;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
