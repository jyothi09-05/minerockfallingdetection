package com.minemind.digitaltwin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationControlRequest {
    private String action; // PLAY, PAUSE, STEP, RESET
    private Double speedMultiplier;
    private String scenario; // NORMAL_OPERATIONS, HEAVY_RAIN_FLOOD, SLOPE_INSTABILITY_WARNING, METHANE_GAS_BREACH, EMERGENCY_EVACUATION
    private Integer seed;
}
