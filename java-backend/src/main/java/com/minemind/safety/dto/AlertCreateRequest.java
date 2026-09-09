package com.minemind.safety.dto;

import com.minemind.safety.enums.AlertLevel;
import com.minemind.safety.enums.AlertSourceType;
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
public class AlertCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String zoneId;

    @NotNull(message = "Source type is required")
    private AlertSourceType sourceType;

    private String sourceId;

    @NotBlank(message = "Alert code is required")
    private String alertCode;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Alert level is required")
    private AlertLevel level;

    private String metadata;
}
