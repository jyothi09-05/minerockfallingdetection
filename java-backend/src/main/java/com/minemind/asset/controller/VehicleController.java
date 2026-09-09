package com.minemind.asset.controller;

import com.minemind.asset.dto.VehicleCreateRequest;
import com.minemind.asset.dto.VehicleResponse;
import com.minemind.asset.service.VehicleService;
import com.minemind.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@Tag(name = "Vehicle & Haul Fleet Telemetry", description = "Endpoints for vehicle location, speed, fuel, and payload tracking")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping("/link")
    @PreAuthorize("hasAuthority('ASSET_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Link vehicle telemetry profile to an equipment asset")
    public ResponseEntity<ApiResponse<VehicleResponse>> linkVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        VehicleResponse response = vehicleService.linkVehicle(request);
        return ResponseEntity.ok(ApiResponse.created("Vehicle profile linked successfully", response));
    }
}
