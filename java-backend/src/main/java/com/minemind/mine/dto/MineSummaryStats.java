package com.minemind.mine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MineSummaryStats {
    private long totalMines;
    private long activeMines;
    private long totalZones;
    private long criticalZones;
    private long activeWorkers;
    private long operationalFleet;
    private long activeAlerts;
    private double averageSafetyScore;
}
