package com.minemind.mine.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.mine.enums.CommodityType;
import com.minemind.mine.enums.MineStatus;
import com.minemind.mine.enums.MineType;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mine extends BaseEntity {

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private MineType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 100)
    private CommodityType commodity;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "elevation_meters")
    @Builder.Default
    private Double elevationMeters = 0.0;

    @Column(name = "total_area_hectares")
    @Builder.Default
    private Double totalAreaHectares = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private MineStatus status = MineStatus.ACTIVE;

    @Column(nullable = false, length = 100)
    private String country;

    @Column(name = "state_province", length = 100)
    private String stateProvince;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String timezone = "UTC";

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "mineId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Zone> zones = new ArrayList<>();
}
