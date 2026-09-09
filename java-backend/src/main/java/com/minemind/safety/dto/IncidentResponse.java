package com.minemind.safety.dto;

import com.minemind.safety.enums.IncidentCategory;
import com.minemind.safety.enums.IncidentSeverity;
import com.minemind.safety.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private String id;
    private String mineId;
    private String zoneId;
    private String incidentNumber;
    private String title;
    private String description;
    private IncidentCategory category;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private String reportedById;
    private String assignedInvestigatorId;
    private Instant occurredAt;
    private Instant containedAt;
    private Instant resolvedAt;
    private Integer injuriesCount;
    private Integer fatalitiesCount;
    private Double estimatedCostUsd;
    private String rootCauseAnalysis;
    private String correctiveActions;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
