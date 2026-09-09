package com.minemind.sensor.dto;

import com.minemind.sensor.enums.CameraStatus;
import com.minemind.sensor.enums.CameraType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraResponse {
    private String id;
    private String mineId;
    private String zoneId;
    private String cameraCode;
    private String name;
    private CameraType type;
    private String streamUrl;
    private String resolution;
    private Integer fps;
    private Double latitude;
    private Double longitude;
    private Double ptzPanDegrees;
    private Double ptzTiltDegrees;
    private Double ptzZoomFactor;
    private CameraStatus status;
    private boolean aiAnalyticsEnabled;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
