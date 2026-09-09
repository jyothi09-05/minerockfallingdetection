package com.minemind.asset.controller;

import com.minemind.asset.dto.EquipmentCreateRequest;
import com.minemind.asset.dto.EquipmentResponse;
import com.minemind.asset.dto.TelemetryIngestRequest;
import com.minemind.asset.entity.EquipmentTelemetry;
import com.minemind.asset.service.EquipmentService;
import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/equipment")
@RequiredArgsConstructor
@Tag(name = "Heavy Equipment & Fleet Management", description = "Endpoints for machinery lifecycle, health score monitoring, and telemetry ingestion")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('ASSET_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'MAINTENANCE_ENGINEER', 'VIEWER')")
    @Operation(summary = "Get paginated list of equipment assets for a mine")
    public ResponseEntity<ApiResponse<PageResponse<EquipmentResponse>>> getEquipment(
            @PathVariable String mineId,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<EquipmentResponse> response = equipmentService.getEquipment(mineId, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ASSET_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'MAINTENANCE_ENGINEER', 'VIEWER')")
    @Operation(summary = "Get heavy machinery asset details by ID")
    public ResponseEntity<ApiResponse<EquipmentResponse>> getEquipmentById(@PathVariable String id) {
        EquipmentResponse response = equipmentService.getEquipmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ASSET_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'MAINTENANCE_ENGINEER')")
    @Operation(summary = "Register new heavy machinery asset")
    public ResponseEntity<ApiResponse<EquipmentResponse>> createEquipment(
            @Valid @RequestBody EquipmentCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        EquipmentResponse response = equipmentService.createEquipment(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Equipment registered successfully", response));
    }

    @PostMapping("/telemetry")
    @Operation(summary = "Ingest real-time equipment sensor telemetry packet")
    public ResponseEntity<ApiResponse<Void>> ingestTelemetry(@Valid @RequestBody TelemetryIngestRequest request) {
        equipmentService.recordTelemetry(request);
        return ResponseEntity.ok(ApiResponse.ok("Telemetry ingested successfully", null));
    }

    @GetMapping("/{id}/telemetry")
    @PreAuthorize("hasAuthority('ASSET_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'MAINTENANCE_ENGINEER', 'VIEWER')")
    @Operation(summary = "Get historical recent telemetry stream for equipment")
    public ResponseEntity<ApiResponse<List<EquipmentTelemetry>>> getTelemetryHistory(@PathVariable String id) {
        List<EquipmentTelemetry> history = equipmentService.getRecentTelemetry(id);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
