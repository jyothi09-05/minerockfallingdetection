package com.minemind.sensor.dto;

import com.minemind.sensor.enums.CameraStatus;
import com.minemind.sensor.enums.CameraType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CameraCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String zoneId;

    @NotBlank(message = "Camera code is required")
    private String cameraCode;

    @NotBlank(message = "Camera name is required")
    private String name;

    @NotNull(message = "Camera type is required")
    private CameraType type;

    private String streamUrl;
    private String resolution;
    private Integer fps;
    private Double latitude;
    private Double longitude;
    private CameraStatus status;
    private Boolean aiAnalyticsEnabled;
    private String metadata;
}
