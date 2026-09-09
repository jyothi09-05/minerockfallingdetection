package com.minemind.mine.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.mine.dto.RoadCreateRequest;
import com.minemind.mine.dto.RoadResponse;
import com.minemind.mine.service.RoadService;
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
@RequestMapping("/api/v1/roads")
@RequiredArgsConstructor
@Tag(name = "Mine Haul Road Management", description = "Endpoints for haul roads, ramps, escape corridors, and capacity constraints")
public class RoadController {

    private final RoadService roadService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get all haul roads and access routes for a mine site")
    public ResponseEntity<ApiResponse<List<RoadResponse>>> getRoadsByMine(@PathVariable String mineId) {
        List<RoadResponse> response = roadService.getRoadsByMineId(mineId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Register a new haul road or access path")
    public ResponseEntity<ApiResponse<RoadResponse>> createRoad(
            @Valid @RequestBody RoadCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        RoadResponse response = roadService.createRoad(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Road registered successfully", response));
    }
}
