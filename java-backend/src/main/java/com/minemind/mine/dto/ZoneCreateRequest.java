package com.minemind.mine.dto;

import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.ZoneStatus;
import com.minemind.mine.enums.ZoneType;
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
public class ZoneCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    @NotBlank(message = "Zone name is required")
    private String name;

    @NotBlank(message = "Zone code is required")
    private String code;

    @NotNull(message = "Zone type is required")
    private ZoneType zoneType;

    private HazardLevel hazardLevel;
    private Integer maxPersonnelCapacity;
    private Integer maxVehicleCapacity;
    private String boundaryCoordinates;
    private Double elevationRangeMin;
    private Double elevationRangeMax;
    private ZoneStatus status;
    private String metadata;
}
