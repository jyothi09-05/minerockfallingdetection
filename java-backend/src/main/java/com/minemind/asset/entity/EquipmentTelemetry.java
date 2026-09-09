package com.minemind.asset.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "equipment_telemetry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipmentTelemetry implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "equipment_id", nullable = false, length = 36)
    private String equipmentId;

    @Column(nullable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();

    @Column(name = "engine_temp_celsius")
    private Double engineTempCelsius;

    @Column(name = "oil_pressure_psi")
    private Double oilPressurePsi;

    @Column(name = "vibration_amplitude_mms")
    private Double vibrationAmplitudeMms;

    @Column(name = "hydraulic_pressure_bar")
    private Double hydraulicPressureBar;

    @Column(name = "fuel_flow_rate_lph")
    private Double fuelFlowRateLph;

    @Column(name = "battery_voltage_volts")
    private Double batteryVoltageVolts;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
