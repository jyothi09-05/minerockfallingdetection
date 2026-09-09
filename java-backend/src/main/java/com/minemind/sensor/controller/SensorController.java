package com.minemind.sensor.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.sensor.dto.SensorCreateRequest;
import com.minemind.sensor.dto.SensorReadingRequest;
import com.minemind.sensor.dto.SensorResponse;
import com.minemind.sensor.entity.SensorReading;
import com.minemind.sensor.service.SensorService;
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
@RequestMapping("/api/v1/sensors")
@RequiredArgsConstructor
@Tag(name = "IoT Environmental & Geotechnical Sensors", description = "Endpoints for environmental sensors (gas, seismic, slope radar, water level) and telemetry ingestion")
public class SensorController {

    private final SensorService sensorService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'GEOLOGIST', 'VIEWER')")
    @Operation(summary = "Get paginated sensor registry for a mine")
    public ResponseEntity<ApiResponse<PageResponse<SensorResponse>>> getSensors(
            @PathVariable String mineId,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<SensorResponse> response = sensorService.getSensors(mineId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'GEOLOGIST', 'VIEWER')")
    @Operation(summary = "Get sensor details by ID")
    public ResponseEntity<ApiResponse<SensorResponse>> getSensorById(@PathVariable String id) {
        SensorResponse response = sensorService.getSensorById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SAFETY_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER')")
    @Operation(summary = "Register a new telemetry sensor")
    public ResponseEntity<ApiResponse<SensorResponse>> createSensor(
            @Valid @RequestBody SensorCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        SensorResponse response = sensorService.createSensor(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Sensor registered successfully", response));
    }

    @PostMapping("/readings")
    @Operation(summary = "Ingest real-time IoT sensor reading")
    public ResponseEntity<ApiResponse<Void>> ingestReading(@Valid @RequestBody SensorReadingRequest request) {
        sensorService.recordReading(request);
        return ResponseEntity.ok(ApiResponse.ok("Reading recorded", null));
    }

    @GetMapping("/{id}/readings")
    @PreAuthorize("hasAuthority('SAFETY_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'GEOLOGIST', 'VIEWER')")
    @Operation(summary = "Get recent high-frequency sensor readings")
    public ResponseEntity<ApiResponse<List<SensorReading>>> getRecentReadings(@PathVariable String id) {
        List<SensorReading> readings = sensorService.getRecentReadings(id);
        return ResponseEntity.ok(ApiResponse.ok(readings));
    }
}
