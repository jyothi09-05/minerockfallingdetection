package com.minemind.mine.dto;

import com.minemind.mine.enums.BenchStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BenchCreateRequest {

    @NotBlank(message = "Zone ID is required")
    private String zoneId;

    @NotBlank(message = "Bench name is required")
    private String name;

    @NotNull(message = "Bench number is required")
    private Integer benchNumber;

    @NotNull(message = "Elevation is required")
    private Double elevationMeters;

    private Double heightMeters;
    private Double widthMeters;
    private Double slopeAngleDegrees;
    private Double stabilityFactor;
    private BenchStatus status;
    private String metadata;
}
