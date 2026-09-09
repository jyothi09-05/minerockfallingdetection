package com.minemind.workforce.dto;

import com.minemind.workforce.enums.MedicalClearanceStatus;
import com.minemind.workforce.enums.WorkerRole;
import com.minemind.workforce.enums.WorkerStatus;
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
public class WorkerCreateRequest {

    @NotBlank(message = "Organization ID is required")
    private String organizationId;

    private String userId;
    private String assignedMineId;
    private String currentZoneId;

    @NotBlank(message = "Badge number is required")
    private String badgeNumber;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Worker role is required")
    private WorkerRole role;

    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private MedicalClearanceStatus medicalClearanceStatus;
    private WorkerStatus status;
    private String rfidTagId;
    private String metadata;
}
