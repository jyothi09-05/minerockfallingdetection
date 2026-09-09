package com.minemind.workforce.dto;

import com.minemind.workforce.enums.ShiftStatus;
import com.minemind.workforce.enums.ShiftType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponse {
    private String id;
    private String workerId;
    private String mineId;
    private String zoneId;
    private ShiftType shiftName;
    private Instant startTime;
    private Instant endTime;
    private ShiftStatus status;
    private String notes;
    private Instant createdAt;
}
