package com.minemind.safety.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.safety.enums.IncidentCategory;
import com.minemind.safety.enums.IncidentSeverity;
import com.minemind.safety.enums.IncidentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident extends BaseEntity {

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "zone_id", length = 36)
    private String zoneId;

    @Column(name = "incident_number", nullable = false, unique = true, length = 64)
    private String incidentNumber;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(name = "reported_by_id", length = 36)
    private String reportedById;

    @Column(name = "assigned_investigator_id", length = 36)
    private String assignedInvestigatorId;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "contained_at")
    private Instant containedAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "injuries_count")
    @Builder.Default
    private Integer injuriesCount = 0;

    @Column(name = "fatalities_count")
    @Builder.Default
    private Integer fatalitiesCount = 0;

    @Column(name = "estimated_cost_usd")
    @Builder.Default
    private Double estimatedCostUsd = 0.0;

    @Column(name = "root_cause_analysis", columnDefinition = "TEXT")
    private String rootCauseAnalysis;

    @Column(name = "corrective_actions", columnDefinition = "TEXT")
    private String correctiveActions;

    @Column(columnDefinition = "TEXT")
    private String metadata;
}
