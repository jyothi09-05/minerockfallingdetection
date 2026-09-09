package com.minemind.mine.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.mine.dto.MineCreateRequest;
import com.minemind.mine.dto.MineResponse;
import com.minemind.mine.dto.MineSummaryStats;
import com.minemind.mine.dto.MineUpdateRequest;
import com.minemind.mine.service.MineService;
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
@RequestMapping("/api/v1/mines")
@RequiredArgsConstructor
@Tag(name = "Mine Site Management", description = "Endpoints for managing mine sites, spatial metadata, and global operational metrics")
public class MineController {

    private final MineService mineService;

    @GetMapping
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get paginated list of mines with search filtering")
    public ResponseEntity<ApiResponse<PageResponse<MineResponse>>> getMines(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<MineResponse> response = mineService.getMines(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get mine site details by ID")
    public ResponseEntity<ApiResponse<MineResponse>> getMineById(@PathVariable String id) {
        MineResponse response = mineService.getMineById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Create a new mine site")
    public ResponseEntity<ApiResponse<MineResponse>> createMine(
            @Valid @RequestBody MineCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MineResponse response = mineService.createMine(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Mine site registered successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MINE_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Update mine site metadata and status")
    public ResponseEntity<ApiResponse<MineResponse>> updateMine(
            @PathVariable String id,
            @Valid @RequestBody MineUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        MineResponse response = mineService.updateMine(id, request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Mine site updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MINE_DELETE') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Soft delete / decommission a mine site")
    public ResponseEntity<ApiResponse<Void>> deleteMine(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        mineService.deleteMine(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Mine site decommissioned successfully", null));
    }

    @GetMapping("/stats/summary")
    @PreAuthorize("hasAuthority('MINE_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'VIEWER')")
    @Operation(summary = "Get global cross-mine operations telemetry and safety index")
    public ResponseEntity<ApiResponse<MineSummaryStats>> getGlobalStats() {
        MineSummaryStats stats = mineService.getGlobalStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
