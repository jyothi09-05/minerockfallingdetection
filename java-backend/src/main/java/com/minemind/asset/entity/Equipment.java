package com.minemind.asset.entity;

import com.minemind.asset.enums.EquipmentStatus;
import com.minemind.asset.enums.EquipmentType;
import com.minemind.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "current_zone_id", length = 36)
    private String currentZoneId;

    @Column(name = "asset_tag", nullable = false, unique = true, length = 64)
    private String assetTag;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private EquipmentType type;

    @Column(name = "model_number", length = 100)
    private String modelNumber;

    @Column(name = "serial_number", length = 100)
    private String serialNumber;

    @Column(length = 100)
    private String manufacturer;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "capacity_tonnes")
    private Double capacityTonnes;

    @Column(name = "engine_power_kw")
    private Double enginePowerKw;

    @Column(name = "fuel_capacity_liters")
    private Double fuelCapacityLiters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private EquipmentStatus status = EquipmentStatus.OPERATIONAL;

    @Column(name = "health_score", nullable = false)
    @Builder.Default
    private Integer healthScore = 100;

    @Column(name = "operating_hours", nullable = false)
    @Builder.Default
    private Double operatingHours = 0.0;

    @Column(name = "last_maintenance_date")
    private Instant lastMaintenanceDate;

    @Column(name = "next_maintenance_due")
    private Instant nextMaintenanceDue;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
