package com.minemind.safety.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.safety.dto.AlertCreateRequest;
import com.minemind.safety.dto.AlertResponse;
import com.minemind.safety.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Tag(name = "Safety Alerts & Emergency Dispatch", description = "Endpoints for real-time safety alerts, acknowledgments, and emergency broadcasts")
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/active/{mineId}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get list of currently active unresolved safety alerts")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts(@PathVariable String mineId) {
        List<AlertResponse> response = alertService.getActiveAlerts(mineId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Trigger a new safety alert or evacuation broadcast")
    public ResponseEntity<ApiResponse<AlertResponse>> createAlert(@Valid @RequestBody AlertCreateRequest request) {
        AlertResponse response = alertService.createAlert(request);
        return ResponseEntity.ok(ApiResponse.created("Alert dispatched", response));
    }

    @PostMapping("/{id}/acknowledge")
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Acknowledge receipt of a safety alert")
    public ResponseEntity<ApiResponse<Void>> acknowledgeAlert(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        alertService.acknowledgeAlert(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Alert acknowledged", null));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Resolve and archive a safety alert")
    public ResponseEntity<ApiResponse<Void>> resolveAlert(
            @PathVariable String id,
            @RequestParam(required = false) String notes,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        alertService.resolveAlert(id, userDetails.getId(), notes);
        return ResponseEntity.ok(ApiResponse.ok("Alert resolved", null));
    }
}
