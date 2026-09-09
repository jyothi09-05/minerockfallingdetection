package com.minemind.workforce.entity;

import com.minemind.common.entity.BaseEntity;
import com.minemind.workforce.enums.MedicalClearanceStatus;
import com.minemind.workforce.enums.WorkerRole;
import com.minemind.workforce.enums.WorkerStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker extends BaseEntity {

    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "assigned_mine_id", length = 36)
    private String assignedMineId;

    @Column(name = "current_zone_id", length = 36)
    private String currentZoneId;

    @Column(name = "badge_number", nullable = false, unique = true, length = 64)
    private String badgeNumber;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private WorkerRole role;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 50)
    private String emergencyContactPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "medical_clearance_status", nullable = false, length = 50)
    @Builder.Default
    private MedicalClearanceStatus medicalClearanceStatus = MedicalClearanceStatus.VALID;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private WorkerStatus status = WorkerStatus.OFF_DUTY;

    @Column(name = "rfid_tag_id", length = 100)
    private String rfidTagId;

    @Column(columnDefinition = "TEXT")
    private String metadata;

    @OneToMany(mappedBy = "workerId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<WorkerCertification> certifications = new ArrayList<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
