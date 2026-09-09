package com.minemind.asset.dto;

import com.minemind.asset.enums.FuelType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCreateRequest {

    @NotBlank(message = "Equipment ID is required")
    private String equipmentId;

    private String licensePlate;
    private FuelType fuelType;
    private Double currentFuelLevelPercent;
    private Double currentSpeedKmh;
    private Double latitude;
    private Double longitude;
    private Double headingDegrees;
    private String assignedDriverId;
    private Double payloadWeightTonnes;
    private Double odometerKm;
}
