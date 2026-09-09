package com.minemind.mine.service;

import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.dto.RoadCreateRequest;
import com.minemind.mine.dto.RoadResponse;
import com.minemind.mine.entity.Road;
import com.minemind.mine.enums.RoadStatus;
import com.minemind.mine.enums.RoadSurface;
import com.minemind.mine.repository.MineRepository;
import com.minemind.mine.repository.RoadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadService {

    private final RoadRepository roadRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public List<RoadResponse> getRoadsByMineId(String mineId) {
        return roadRepository.findAllByMineIdAndIsDeletedFalse(mineId)
                .stream().map(this::mapToRoadResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoadResponse createRoad(RoadCreateRequest request, String createdByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        Road road = Road.builder()
                .mineId(request.getMineId())
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .roadType(request.getRoadType())
                .surfaceType(request.getSurfaceType() != null ? request.getSurfaceType() : RoadSurface.GRAVEL)
                .lengthMeters(request.getLengthMeters())
                .averageWidthMeters(request.getAverageWidthMeters() != null ? request.getAverageWidthMeters() : 25.0)
                .maxGradientPercent(request.getMaxGradientPercent() != null ? request.getMaxGradientPercent() : 8.0)
                .speedLimitKmh(request.getSpeedLimitKmh() != null ? request.getSpeedLimitKmh() : 40)
                .maxWeightCapacityTonnes(request.getMaxWeightCapacityTonnes() != null ? request.getMaxWeightCapacityTonnes() : 400.0)
                .status(request.getStatus() != null ? request.getStatus() : RoadStatus.OPEN)
                .metadata(request.getMetadata())
                .build();
        road.setCreatedBy(createdByUserId);

        Road saved = roadRepository.save(road);
        return mapToRoadResponse(saved);
    }

    public RoadResponse mapToRoadResponse(Road road) {
        return RoadResponse.builder()
                .id(road.getId())
                .mineId(road.getMineId())
                .name(road.getName())
                .code(road.getCode())
                .roadType(road.getRoadType())
                .surfaceType(road.getSurfaceType())
                .lengthMeters(road.getLengthMeters())
                .averageWidthMeters(road.getAverageWidthMeters())
                .maxGradientPercent(road.getMaxGradientPercent())
                .speedLimitKmh(road.getSpeedLimitKmh())
                .maxWeightCapacityTonnes(road.getMaxWeightCapacityTonnes())
                .status(road.getStatus())
                .metadata(road.getMetadata())
                .createdAt(road.getCreatedAt())
                .updatedAt(road.getUpdatedAt())
                .build();
    }
}
