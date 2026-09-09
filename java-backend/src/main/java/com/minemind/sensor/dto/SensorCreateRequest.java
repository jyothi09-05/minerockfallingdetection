package com.minemind.sensor.dto;

import com.minemind.sensor.enums.SensorStatus;
import com.minemind.sensor.enums.SensorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String zoneId;

    @NotBlank(message = "Sensor code is required")
    private String sensorCode;

    @NotBlank(message = "Sensor name is required")
    private String name;

    @NotNull(message = "Sensor type is required")
    private SensorType type;

    @NotBlank(message = "Unit of measurement is required")
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
    private String metadata;
}
