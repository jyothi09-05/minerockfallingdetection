package com.minemind.asset.entity;

import com.minemind.asset.enums.FuelType;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "equipment_id", nullable = false, unique = true, length = 36)
    private String equipmentId;

    @Column(name = "license_plate", length = 50)
    private String licensePlate;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 50)
    @Builder.Default
    private FuelType fuelType = FuelType.DIESEL;

    @Column(name = "current_fuel_level_percent")
    @Builder.Default
    private Double currentFuelLevelPercent = 100.0;

    @Column(name = "current_speed_kmh")
    @Builder.Default
    private Double currentSpeedKmh = 0.0;

    private Double latitude;
    private Double longitude;

    @Column(name = "heading_degrees")
    @Builder.Default
    private Double headingDegrees = 0.0;

    @Column(name = "assigned_driver_id", length = 36)
    private String assignedDriverId;

    @Column(name = "payload_weight_tonnes")
    @Builder.Default
    private Double payloadWeightTonnes = 0.0;

    @Column(name = "odometer_km")
    @Builder.Default
    private Double odometerKm = 0.0;

    @Column(name = "tire_pressure_psi", columnDefinition = "TEXT")
    private String tirePressurePsi;

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.updatedAt == null) {
            this.updatedAt = Instant.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
