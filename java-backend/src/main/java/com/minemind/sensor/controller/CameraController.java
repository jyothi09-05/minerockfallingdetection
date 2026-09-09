package com.minemind.sensor.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.sensor.dto.CameraCreateRequest;
import com.minemind.sensor.dto.CameraResponse;
import com.minemind.sensor.service.CameraService;
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
@RequestMapping("/api/v1/cameras")
@RequiredArgsConstructor
@Tag(name = "CCTV & Thermal Camera Feeds", description = "Endpoints for camera stream management and AI video analytics registry")
public class CameraController {

    private final CameraService cameraService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get list of CCTV and thermal cameras for a mine")
    public ResponseEntity<ApiResponse<List<CameraResponse>>> getCameras(@PathVariable String mineId) {
        List<CameraResponse> response = cameraService.getCamerasByMineId(mineId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Register new camera stream")
    public ResponseEntity<ApiResponse<CameraResponse>> createCamera(
            @Valid @RequestBody CameraCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        CameraResponse response = cameraService.createCamera(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Camera registered successfully", response));
    }
}
