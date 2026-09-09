package com.minemind.mine.dto;

import com.minemind.mine.enums.RoadStatus;
import com.minemind.mine.enums.RoadSurface;
import com.minemind.mine.enums.RoadType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadResponse {
    private String id;
    private String mineId;
    private String name;
    private String code;
    private RoadType roadType;
    private RoadSurface surfaceType;
    private Double lengthMeters;
    private Double averageWidthMeters;
    private Double maxGradientPercent;
    private Integer speedLimitKmh;
    private Double maxWeightCapacityTonnes;
    private RoadStatus status;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
