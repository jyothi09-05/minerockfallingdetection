package com.minemind.safety.entity;

import com.minemind.safety.enums.AlertLevel;
import com.minemind.safety.enums.AlertSourceType;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "zone_id", length = 36)
    private String zoneId;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 50)
    private AlertSourceType sourceType;

    @Column(name = "source_id", length = 36)
    private String sourceId;

    @Column(name = "alert_code", nullable = false, length = 64)
    private String alertCode;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private AlertLevel level;

    @Column(name = "is_acknowledged", nullable = false)
    @Builder.Default
    private boolean isAcknowledged = false;

    @Column(name = "acknowledged_by_id", length = 36)
    private String acknowledgedById;

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "is_resolved", nullable = false)
    @Builder.Default
    private boolean isResolved = false;

    @Column(name = "resolved_by_id", length = 36)
    private String resolvedById;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
