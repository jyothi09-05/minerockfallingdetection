package com.minemind.mine.dto;

import com.minemind.mine.enums.CommodityType;
import com.minemind.mine.enums.MineStatus;
import com.minemind.mine.enums.MineType;
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
public class MineCreateRequest {

    @NotBlank(message = "Organization ID is required")
    private String organizationId;

    @NotBlank(message = "Mine name is required")
    private String name;

    @NotBlank(message = "Mine code is required")
    private String code;

    @NotNull(message = "Mine type is required")
    private MineType type;

    @NotNull(message = "Commodity type is required")
    private CommodityType commodity;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private Double elevationMeters;
    private Double totalAreaHectares;
    private MineStatus status;

    @NotBlank(message = "Country is required")
    private String country;

    private String stateProvince;
    private String timezone;
    private String metadata;
}
