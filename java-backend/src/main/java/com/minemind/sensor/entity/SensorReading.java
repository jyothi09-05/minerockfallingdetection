package com.minemind.sensor.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sensor_readings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SensorReading implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "sensor_id", nullable = false, length = 36)
    private String sensorId;

    @Column(nullable = false)
    @Builder.Default
    private Instant timestamp = Instant.now();

    @Column(nullable = false)
    private Double value;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "NORMAL";

    @Column(name = "quality_score", nullable = false)
    @Builder.Default
    private Double qualityScore = 1.0;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
