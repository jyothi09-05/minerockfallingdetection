package com.minemind.mine.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.mine.dto.ZoneCreateRequest;
import com.minemind.mine.dto.ZoneResponse;
import com.minemind.mine.service.ZoneService;
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
@RequestMapping("/api/v1/zones")
@RequiredArgsConstructor
@Tag(name = "Mine Zone Management", description = "Endpoints for managing functional operational zones, hazard tiers, and geofencing")
public class ZoneController {

    private final ZoneService zoneService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get all operational zones belonging to a mine")
    public ResponseEntity<ApiResponse<List<ZoneResponse>>> getZonesByMine(@PathVariable String mineId) {
        List<ZoneResponse> response = zoneService.getZonesByMineId(mineId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get zone details by ID")
    public ResponseEntity<ApiResponse<ZoneResponse>> getZoneById(@PathVariable String id) {
        ZoneResponse response = zoneService.getZoneById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Create a new operational zone")
    public ResponseEntity<ApiResponse<ZoneResponse>> createZone(
            @Valid @RequestBody ZoneCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ZoneResponse response = zoneService.createZone(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Zone created successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Soft delete a zone")
    public ResponseEntity<ApiResponse<Void>> deleteZone(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        zoneService.deleteZone(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Zone removed successfully", null));
    }
}
