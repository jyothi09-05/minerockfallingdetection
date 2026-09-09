package com.minemind.digitaltwin.controller;

import com.minemind.common.response.ApiResponse;
import com.minemind.digitaltwin.dto.DigitalTwinStateDto;
import com.minemind.digitaltwin.dto.TerrainDto;
import com.minemind.digitaltwin.service.DigitalTwinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/digital-twin")
@RequiredArgsConstructor
@Tag(name = "Digital Twin", description = "Endpoints for 3D/2D digital twin terrain and live physical state")
public class DigitalTwinController {

    private final DigitalTwinService digitalTwinService;

    @GetMapping("/terrain")
    @Operation(summary = "Get procedural terrain model with benches, ramps, and geology")
    public ResponseEntity<ApiResponse<TerrainDto>> getTerrain(
            @RequestParam(defaultValue = "42") int seed
    ) {
        TerrainDto terrain = digitalTwinService.generateTerrain(seed);
        return ResponseEntity.ok(ApiResponse.ok(terrain));
    }

    @GetMapping("/state")
    @Operation(summary = "Get current synchronized digital twin state snapshot")
    public ResponseEntity<ApiResponse<DigitalTwinStateDto>> getState() {
        DigitalTwinStateDto state = digitalTwinService.getSnapshot();
        return ResponseEntity.ok(ApiResponse.ok(state));
    }
}
