package com.minemind.mine.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.mine.enums.BenchStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "benches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bench extends BaseEntity {

    @Column(name = "zone_id", nullable = false, length = 36)
    private String zoneId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "bench_number", nullable = false)
    private Integer benchNumber;

    @Column(name = "elevation_meters", nullable = false)
    private Double elevationMeters;

    @Column(name = "height_meters", nullable = false)
    @Builder.Default
    private Double heightMeters = 15.0;

    @Column(name = "width_meters", nullable = false)
    @Builder.Default
    private Double widthMeters = 30.0;

    @Column(name = "slope_angle_degrees", nullable = false)
    @Builder.Default
    private Double slopeAngleDegrees = 65.0;

    @Column(name = "stability_factor", nullable = false)
    @Builder.Default
    private Double stabilityFactor = 1.5;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private BenchStatus status = BenchStatus.OPERATIONAL;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
