package com.minemind.workforce.entity;

import com.minemind.workforce.enums.ShiftStatus;
import com.minemind.workforce.enums.ShiftType;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "shift_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftAssignment implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "worker_id", nullable = false, length = 36)
    private String workerId;

    @Column(name = "mine_id", nullable = false, length = 36)
    private String mineId;

    @Column(name = "zone_id", length = 36)
    private String zoneId;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_name", nullable = false, length = 50)
    private ShiftType shiftName;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ShiftStatus status = ShiftStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String notes;

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
