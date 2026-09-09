package com.minemind.asset.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelemetryIngestRequest {

    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;

    private Double engineTempCelsius;
    private Double oilPressurePsi;
    private Double vibrationAmplitudeMms;
    private Double hydraulicPressureBar;
    private Double fuelFlowRateLph;
    private Double batteryVoltageVolts;
    private String rawPayload;
}
