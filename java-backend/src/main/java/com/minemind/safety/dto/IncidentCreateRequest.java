package com.minemind.safety.dto;

import com.minemind.safety.enums.IncidentCategory;
import com.minemind.safety.enums.IncidentSeverity;
import com.minemind.safety.enums.IncidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentCreateRequest {

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String zoneId;

    @NotBlank(message = "Incident title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private IncidentCategory category;

    @NotNull(message = "Severity is required")
    private IncidentSeverity severity;

    private IncidentStatus status;
    private String assignedInvestigatorId;

    @NotNull(message = "Occurred timestamp is required")
    private Instant occurredAt;

    private Integer injuriesCount;
    private Integer fatalitiesCount;
    private Double estimatedCostUsd;
    private String rootCauseAnalysis;
    private String correctiveActions;
    private String metadata;
}
