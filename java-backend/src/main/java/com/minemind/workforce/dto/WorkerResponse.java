package com.minemind.workforce.dto;

import com.minemind.workforce.enums.MedicalClearanceStatus;
import com.minemind.workforce.enums.WorkerRole;
import com.minemind.workforce.enums.WorkerStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkerResponse {
    private String id;
    private String organizationId;
    private String userId;
    private String assignedMineId;
    private String currentZoneId;
    private String badgeNumber;
    private String firstName;
    private String lastName;
    private String fullName;
    private WorkerRole role;
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private MedicalClearanceStatus medicalClearanceStatus;
    private WorkerStatus status;
    private String rfidTagId;
    private String metadata;
    private List<String> activeCertifications;
    private Instant createdAt;
    private Instant updatedAt;
}
