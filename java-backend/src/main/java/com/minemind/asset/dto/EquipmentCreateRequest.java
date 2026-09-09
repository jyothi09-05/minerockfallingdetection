package com.minemind.asset.dto;

import com.minemind.asset.enums.EquipmentStatus;
import com.minemind.asset.enums.EquipmentType;
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
public class EquipmentCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String currentZoneId;

    @NotBlank(message = "Asset tag is required")
    private String assetTag;

    @NotBlank(message = "Equipment name is required")
    private String name;

    @NotNull(message = "Equipment type is required")
    private EquipmentType type;

    private String modelNumber;
    private String serialNumber;
    private String manufacturer;
    private Integer manufactureYear;
    private Double capacityTonnes;
    private Double enginePowerKw;
    private Double fuelCapacityLiters;
    private EquipmentStatus status;
    private String metadata;
}
