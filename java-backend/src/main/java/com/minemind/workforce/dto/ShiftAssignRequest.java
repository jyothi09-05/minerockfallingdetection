package com.minemind.workforce.dto;

import com.minemind.workforce.enums.ShiftType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftAssignRequest {

    @NotBlank(message = "Worker ID is required")
    private String workerId;

    @NotBlank(message = "Mine ID is required")
    private String mineId;

    private String zoneId;

    @NotNull(message = "Shift type is required")
    private ShiftType shiftName;

    @NotNull(message = "Start time is required")
    private Instant startTime;

    @NotNull(message = "End time is required")
    private Instant endTime;

    private String notes;
}
