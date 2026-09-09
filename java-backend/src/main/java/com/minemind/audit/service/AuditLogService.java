package com.minemind.audit.service;

import com.minemind.audit.dto.AuditLogResponse;
import com.minemind.audit.entity.AuditLog;
import com.minemind.audit.repository.AuditLogRepository;
import com.minemind.common.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> getAuditLogs(Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.of(page.map(this::mapToAuditLogResponse));
    }

    @Async
    public void recordAudit(String orgId, String userId, String username, String action, String resourceType, String resourceId, String ip, String status, String details) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .organizationId(orgId)
                    .userId(userId)
                    .username(username)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .ipAddress(ip)
                    .status(status)
                    .details(details)
                    .build();
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("Failed to record audit log: {}", e.getMessage());
        }
    }

    public AuditLogResponse mapToAuditLogResponse(AuditLog a) {
        return AuditLogResponse.builder()
                .id(a.getId())
                .organizationId(a.getOrganizationId())
                .userId(a.getUserId())
                .username(a.getUsername())
                .action(a.getAction())
                .resourceType(a.getResourceType())
                .resourceId(a.getResourceId())
                .ipAddress(a.getIpAddress())
                .status(a.getStatus())
                .errorMessage(a.getErrorMessage())
                .details(a.getDetails())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
