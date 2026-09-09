package com.minemind.asset.dto;

import com.minemind.asset.enums.FuelType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {
    private String id;
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
    private Instant updatedAt;
}
