package com.minemind.sensor.dto;

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
public class SensorReadingRequest {

    @NotBlank(message = "Sensor ID is required")
    private String sensorId;

    @NotNull(message = "Reading value is required")
    private Double value;

    private String rawPayload;
}
