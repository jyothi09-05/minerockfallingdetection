package com.minemind.mine.dto;

import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.ZoneStatus;
import com.minemind.mine.enums.ZoneType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneResponse {
    private String id;
    private String mineId;
    private String name;
    private String code;
    private ZoneType zoneType;
    private HazardLevel hazardLevel;
    private Integer maxPersonnelCapacity;
    private Integer maxVehicleCapacity;
    private String boundaryCoordinates;
    private Double elevationRangeMin;
    private Double elevationRangeMax;
    private ZoneStatus status;
    private String metadata;
    private int benchCount;
    private Instant createdAt;
    private Instant updatedAt;
}
