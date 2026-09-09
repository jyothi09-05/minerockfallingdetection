package com.minemind.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private String id;
    private String organizationId;
    private String userId;
    private String username;
    private String action;
    private String resourceType;
    private String resourceId;
    private String ipAddress;
    private String status;
    private String errorMessage;
    private String details;
    private Instant createdAt;
}
