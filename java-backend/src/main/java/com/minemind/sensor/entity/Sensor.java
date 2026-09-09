package com.minemind.sensor.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.sensor.enums.SensorStatus;
import com.minemind.sensor.enums.SensorType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "sensors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sensor extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "zone_id", length = 36)
    private String zoneId;

    @Column(name = "sensor_code", nullable = false, unique = true, length = 64)
    private String sensorCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private SensorType type;

    @Column(name = "unit_of_measurement", nullable = false, length = 50)
    private String unitOfMeasurement;

    @Column(name = "min_safe_threshold")
    private Double minSafeThreshold;

    @Column(name = "max_safe_threshold")
    private Double maxSafeThreshold;

    @Column(name = "warning_threshold")
    private Double warningThreshold;

    @Column(name = "critical_threshold")
    private Double criticalThreshold;

    @Column(name = "sampling_interval_seconds", nullable = false)
    @Builder.Default
    private Integer samplingIntervalSeconds = 5;

    private Double latitude;
    private Double longitude;

    @Column(name = "elevation_meters")
    private Double elevationMeters;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private SensorStatus status = SensorStatus.ACTIVE;

    @Column(name = "latest_reading_value")
    private Double latestReadingValue;

    @Column(name = "latest_reading_time")
    private Instant latestReadingTime;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
