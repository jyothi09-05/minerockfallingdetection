package com.minemind.mine.dto;

import com.minemind.mine.enums.BenchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchResponse {
    private String id;
    private String zoneId;
    private String name;
    private Integer benchNumber;
    private Double elevationMeters;
    private Double heightMeters;
    private Double widthMeters;
    private Double slopeAngleDegrees;
    private Double stabilityFactor;
    private BenchStatus status;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;
}
