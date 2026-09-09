package com.minemind.audit.controller;

import com.minemind.audit.dto.AuditLogResponse;
import com.minemind.audit.service.AuditLogService;
import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Trail & Compliance Records", description = "Endpoints for exploring immutable operational and security audit logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_READ') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get paginated immutable audit log records")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> getAuditLogs(
            @PageableDefault(size = 25, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<AuditLogResponse> response = auditLogService.getAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
