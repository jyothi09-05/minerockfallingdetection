package com.minemind.mine.dto;

import com.minemind.mine.enums.CommodityType;
import com.minemind.mine.enums.MineStatus;
import com.minemind.mine.enums.MineType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MineUpdateRequest {
    private String name;
    private MineType type;
    private CommodityType commodity;
    private Double latitude;
    private Double longitude;
    private Double elevationMeters;
    private Double totalAreaHectares;
    private MineStatus status;
    private String country;
    private String stateProvince;
    private String timezone;
    private String metadata;
}
