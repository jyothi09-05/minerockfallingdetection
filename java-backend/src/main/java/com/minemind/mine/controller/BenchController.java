package com.minemind.mine.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.mine.dto.BenchCreateRequest;
import com.minemind.mine.dto.BenchResponse;
import com.minemind.mine.service.BenchService;
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
@RequestMapping("/api/v1/benches")
@RequiredArgsConstructor
@Tag(name = "Mine Bench & Slope Management", description = "Endpoints for managing pit benches, elevation contours, and geotechnical safety factors")
public class BenchController {

    private final BenchService benchService;

    @GetMapping("/by-zone/{zoneId}")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'GEOLOGIST', 'VIEWER')")
    @Operation(summary = "Get all benches belonging to a zone ordered by elevation")
    public ResponseEntity<ApiResponse<List<BenchResponse>>> getBenchesByZone(@PathVariable String zoneId) {
        List<BenchResponse> response = benchService.getBenchesByZoneId(zoneId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'GEOLOGIST')")
    @Operation(summary = "Create a new bench structure")
    public ResponseEntity<ApiResponse<BenchResponse>> createBench(
            @Valid @RequestBody BenchCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        BenchResponse response = benchService.createBench(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Bench created successfully", response));
    }
}
