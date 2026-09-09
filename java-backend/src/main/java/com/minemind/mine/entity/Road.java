package com.minemind.mine.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.mine.enums.RoadStatus;
import com.minemind.mine.enums.RoadSurface;
import com.minemind.mine.enums.RoadType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Road extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 64)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "road_type", nullable = false, length = 50)
    private RoadType roadType;

    @Enumerated(EnumType.STRING)
    @Column(name = "surface_type", nullable = false, length = 50)
    @Builder.Default
    private RoadSurface surfaceType = RoadSurface.GRAVEL;

    @Column(name = "length_meters", nullable = false)
    private Double lengthMeters;

    @Column(name = "average_width_meters", nullable = false)
    @Builder.Default
    private Double averageWidthMeters = 25.0;

    @Column(name = "max_gradient_percent", nullable = false)
    @Builder.Default
    private Double maxGradientPercent = 8.0;

    @Column(name = "speed_limit_kmh", nullable = false)
    @Builder.Default
    private Integer speedLimitKmh = 40;

    @Column(name = "max_weight_capacity_tonnes", nullable = false)
    @Builder.Default
    private Double maxWeightCapacityTonnes = 400.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private RoadStatus status = RoadStatus.OPEN;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
