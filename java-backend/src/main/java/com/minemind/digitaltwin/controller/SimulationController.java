package com.minemind.digitaltwin.controller;

import com.minemind.common.response.ApiResponse;
import com.minemind.digitaltwin.dto.DigitalTwinStateDto;
import com.minemind.digitaltwin.dto.SimulationControlRequest;
import com.minemind.digitaltwin.service.DigitalTwinService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/simulation")
@RequiredArgsConstructor
@Tag(name = "Simulation Control", description = "Endpoints for controlling multi-agent mining simulation runtime")
public class SimulationController {

    private final DigitalTwinService digitalTwinService;

    @PostMapping("/control")
    @Operation(summary = "Send control commands to the simulation engine (play, pause, step, speed, scenario, reset)")
    public ResponseEntity<ApiResponse<DigitalTwinStateDto>> controlSimulation(
            @RequestBody SimulationControlRequest request
    ) {
        DigitalTwinStateDto state = digitalTwinService.controlSimulation(request);
        return ResponseEntity.ok(ApiResponse.ok(state));
    }
}
