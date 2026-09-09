package com.minemind.asset.dto;

import com.minemind.asset.enums.EquipmentStatus;
import com.minemind.asset.enums.EquipmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentResponse {
    private String id;
    private String mineId;
    private String currentZoneId;
    private String assetTag;
    private String name;
    private EquipmentType type;
    private String modelNumber;
    private String serialNumber;
    private String manufacturer;
    private Integer manufactureYear;
    private Double capacityTonnes;
    private Double enginePowerKw;
    private Double fuelCapacityLiters;
    private EquipmentStatus status;
    private Integer healthScore;
    private Double operatingHours;
    private Instant lastMaintenanceDate;
    private Instant nextMaintenanceDue;
    private String metadata;
    private VehicleResponse vehicleDetails;
    private Instant createdAt;
    private Instant updatedAt;
}
