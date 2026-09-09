package com.minemind.sensor.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.sensor.enums.CameraStatus;
import com.minemind.sensor.enums.CameraType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cameras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Camera extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "zone_id", length = 36)
    private String zoneId;

    @Column(name = "camera_code", nullable = false, unique = true, length = 64)
    private String cameraCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CameraType type;

    @Column(name = "stream_url", length = 512)
    private String streamUrl;

    @Column(length = 50)
    @Builder.Default
    private String resolution = "1080p";

    @Column(nullable = false)
    @Builder.Default
    private Integer fps = 30;

    private Double latitude;
    private Double longitude;

    @Column(name = "ptz_pan_degrees")
    @Builder.Default
    private Double ptzPanDegrees = 0.0;

    @Column(name = "ptz_tilt_degrees")
    @Builder.Default
    private Double ptzTiltDegrees = 0.0;

    @Column(name = "ptz_zoom_factor")
    @Builder.Default
    private Double ptzZoomFactor = 1.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private CameraStatus status = CameraStatus.ONLINE;

    @Column(name = "ai_analytics_enabled", nullable = false)
    @Builder.Default
    private boolean aiAnalyticsEnabled = true;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
