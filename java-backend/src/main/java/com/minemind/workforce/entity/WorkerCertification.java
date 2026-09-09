package com.minemind.workforce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "worker_certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerCertification implements Serializable {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "worker_id", nullable = false, length = 36)
    private String workerId;

    @Column(name = "certification_name", nullable = false, length = 255)
    private String certificationName;

    @Column(name = "certificate_number", length = 100)
    private String certificateNumber;

    @Column(name = "issuing_authority", length = 255)
    private String issuingAuthority;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";

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
