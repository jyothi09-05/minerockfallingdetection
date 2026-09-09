package com.minemind.digitaltwin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TerrainDto {
    private Integer seed;
    private Integer gridWidth;
    private Integer gridHeight;
    private Double cellSizeM;
    private Double minElevationM;
    private Double maxElevationM;
    private Double pitDepthM;
    private Integer benchCount;
    private List<BenchDto> benches;
    private List<RoadDto> roads;
    private List<WaypointDto> waypoints;
    private List<GeologicalLayerDto> geologicalLayers;
    private List<List<Double>> heightmapMatrix;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BenchDto {
        private String benchId;
        private String name;
        private Integer levelIndex;
        private Double elevationM;
        private Double heightM;
        private Double widthM;
        private String status;
        private Double riskScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadDto {
        private String id;
        private String name;
        private String startWaypointId;
        private String endWaypointId;
        private Double lengthM;
        private Double gradePercent;
        private Double speedLimitKmh;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WaypointDto {
        private String id;
        private String name;
        private Position3DDto position;
        private String type;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeologicalLayerDto {
        private String name;
        private String code;
        private Double depthStartM;
        private Double depthEndM;
        private String colorHex;
        private Double stabilityRating;
    }
}
