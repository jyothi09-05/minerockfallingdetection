package com.minemind.mine.dto;

import com.minemind.mine.enums.RoadStatus;
import com.minemind.mine.enums.RoadSurface;
import com.minemind.mine.enums.RoadType;
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
public class RoadCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    @NotBlank(message = "Road name is required")
    private String name;

    @NotBlank(message = "Road code is required")
    private String code;

    @NotNull(message = "Road type is required")
    private RoadType roadType;

    private RoadSurface surfaceType;

    @NotNull(message = "Length in meters is required")
    private Double lengthMeters;

    private Double averageWidthMeters;
    private Double maxGradientPercent;
    private Integer speedLimitKmh;
    private Double maxWeightCapacityTonnes;
    private RoadStatus status;
    private String metadata;
}
