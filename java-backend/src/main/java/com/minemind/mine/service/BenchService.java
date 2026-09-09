package com.minemind.mine.service;

import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.dto.BenchCreateRequest;
import com.minemind.mine.dto.BenchResponse;
import com.minemind.mine.entity.Bench;
import com.minemind.mine.enums.BenchStatus;
import com.minemind.mine.repository.BenchRepository;
import com.minemind.mine.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BenchService {

    private final BenchRepository benchRepository;
    private final ZoneRepository zoneRepository;

    @Transactional(readOnly = true)
    public List<BenchResponse> getBenchesByZoneId(String zoneId) {
        return benchRepository.findAllByZoneIdAndIsDeletedFalseOrderByBenchNumberDesc(zoneId)
                .stream().map(this::mapToBenchResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BenchResponse createBench(BenchCreateRequest request, String createdByUserId) {
        if (!zoneRepository.existsById(request.getZoneId())) {
            throw new ResourceNotFoundException("Zone", "id", request.getZoneId());
        }

        Bench bench = Bench.builder()
                .zoneId(request.getZoneId())
                .name(request.getName())
                .benchNumber(request.getBenchNumber())
                .elevationMeters(request.getElevationMeters())
                .heightMeters(request.getHeightMeters() != null ? request.getHeightMeters() : 15.0)
                .widthMeters(request.getWidthMeters() != null ? request.getWidthMeters() : 30.0)
                .slopeAngleDegrees(request.getSlopeAngleDegrees() != null ? request.getSlopeAngleDegrees() : 65.0)
                .stabilityFactor(request.getStabilityFactor() != null ? request.getStabilityFactor() : 1.5)
                .status(request.getStatus() != null ? request.getStatus() : BenchStatus.OPERATIONAL)
                .metadata(request.getMetadata())
                .build();
        bench.setCreatedBy(createdByUserId);

        Bench saved = benchRepository.save(bench);
        return mapToBenchResponse(saved);
    }

    public BenchResponse mapToBenchResponse(Bench bench) {
        return BenchResponse.builder()
                .id(bench.getId())
                .zoneId(bench.getZoneId())
                .name(bench.getName())
                .benchNumber(bench.getBenchNumber())
                .elevationMeters(bench.getElevationMeters())
                .heightMeters(bench.getHeightMeters())
                .widthMeters(bench.getWidthMeters())
                .slopeAngleDegrees(bench.getSlopeAngleDegrees())
                .stabilityFactor(bench.getStabilityFactor())
                .status(bench.getStatus())
                .metadata(bench.getMetadata())
                .createdAt(bench.getCreatedAt())
                .updatedAt(bench.getUpdatedAt())
                .build();
    }
}
