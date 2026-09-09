package com.minemind.safety.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.safety.dto.IncidentCreateRequest;
import com.minemind.safety.dto.IncidentResponse;
import com.minemind.safety.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@Tag(name = "Mine Safety & Incident Reporting", description = "Endpoints for logging HSE incidents, investigations, and root-cause analysis")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get paginated list of logged safety incidents")
    public ResponseEntity<ApiResponse<PageResponse<IncidentResponse>>> getIncidents(
            @PathVariable String mineId,
            @PageableDefault(size = 20, sort = "occurredAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<IncidentResponse> response = incidentService.getIncidents(mineId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get incident details by ID")
    public ResponseEntity<ApiResponse<IncidentResponse>> getIncidentById(@PathVariable String id) {
        IncidentResponse response = incidentService.getIncidentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Report a new safety or environmental incident")
    public ResponseEntity<ApiResponse<IncidentResponse>> reportIncident(
            @Valid @RequestBody IncidentCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        IncidentResponse response = incidentService.reportIncident(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Incident reported and logged", response));
    }
}
