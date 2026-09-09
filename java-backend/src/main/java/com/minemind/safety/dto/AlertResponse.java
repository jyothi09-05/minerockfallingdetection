package com.minemind.safety.dto;

import com.minemind.safety.enums.AlertLevel;
import com.minemind.safety.enums.AlertSourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {
    private String id;
    private String mineId;
    private String zoneId;
    private AlertSourceType sourceType;
    private String sourceId;
    private String alertCode;
    private String title;
    private String message;
    private AlertLevel level;
    private boolean isAcknowledged;
    private String acknowledgedById;
    private Instant acknowledgedAt;
    private boolean isResolved;
    private String resolvedById;
    private Instant resolvedAt;
    private String resolutionNotes;
    private String metadata;
    private Instant createdAt;
}
