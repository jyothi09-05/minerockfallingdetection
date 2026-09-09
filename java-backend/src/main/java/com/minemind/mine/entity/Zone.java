package com.minemind.mine.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.ZoneStatus;
import com.minemind.mine.enums.ZoneType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Zone extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 64)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "zone_type", nullable = false, length = 50)
    private ZoneType zoneType;

    @Enumerated(EnumType.STRING)
    @Column(name = "hazard_level", nullable = false, length = 50)
    @Builder.Default
    private HazardLevel hazardLevel = HazardLevel.LOW;

    @Column(name = "max_personnel_capacity")
    @Builder.Default
    private Integer maxPersonnelCapacity = 50;

    @Column(name = "max_vehicle_capacity")
    @Builder.Default
    private Integer maxVehicleCapacity = 20;

    @Column(name = "boundary_coordinates", columnDefinition = "TEXT")
    private String boundaryCoordinates;

    @Column(name = "elevation_range_min")
    private Double elevationRangeMin;

    @Column(name = "elevation_range_max")
    private Double elevationRangeMax;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ZoneStatus status = ZoneStatus.ACTIVE;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "zoneId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Bench> benches = new ArrayList<>();
}
