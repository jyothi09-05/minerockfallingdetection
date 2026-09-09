package com.minemind.mine.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.dto.ZoneCreateRequest;
import com.minemind.mine.dto.ZoneResponse;
import com.minemind.mine.entity.Zone;
import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.ZoneStatus;
import com.minemind.mine.repository.BenchRepository;
import com.minemind.mine.repository.MineRepository;
import com.minemind.mine.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ZoneService {

    private final ZoneRepository zoneRepository;
    private final MineRepository mineRepository;
    private final BenchRepository benchRepository;

    @Transactional(readOnly = true)
    public List<ZoneResponse> getZonesByMineId(String mineId) {
        return zoneRepository.findAllByMineIdAndIsDeletedFalse(mineId)
                .stream().map(this::mapToZoneResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<ZoneResponse> getZonesPaginated(String mineId, Pageable pageable) {
        Page<Zone> page = zoneRepository.findAllByMineIdAndIsDeletedFalse(mineId, pageable);
        return PageResponse.of(page.map(this::mapToZoneResponse));
    }

    @Transactional(readOnly = true)
    public ZoneResponse getZoneById(String id) {
        Zone zone = zoneRepository.findById(id)
                .filter(z -> !z.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Zone", "id", id));
        return mapToZoneResponse(zone);
    }

    @Transactional
    public ZoneResponse createZone(ZoneCreateRequest request, String createdByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        if (zoneRepository.findByMineIdAndCodeAndIsDeletedFalse(request.getMineId(), request.getCode()).isPresent()) {
            throw new ConflictException("Zone with code " + request.getCode() + " already exists in this mine.");
        }

        Zone zone = Zone.builder()
                .mineId(request.getMineId())
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .zoneType(request.getZoneType())
                .hazardLevel(request.getHazardLevel() != null ? request.getHazardLevel() : HazardLevel.LOW)
                .maxPersonnelCapacity(request.getMaxPersonnelCapacity() != null ? request.getMaxPersonnelCapacity() : 50)
                .maxVehicleCapacity(request.getMaxVehicleCapacity() != null ? request.getMaxVehicleCapacity() : 20)
                .boundaryCoordinates(request.getBoundaryCoordinates())
                .elevationRangeMin(request.getElevationRangeMin())
                .elevationRangeMax(request.getElevationRangeMax())
                .status(request.getStatus() != null ? request.getStatus() : ZoneStatus.ACTIVE)
                .metadata(request.getMetadata())
                .build();
        zone.setCreatedBy(createdByUserId);

        Zone saved = zoneRepository.save(zone);
        log.info("Zone created: {} ({}) for mine {}", saved.getName(), saved.getCode(), saved.getMineId());
        return mapToZoneResponse(saved);
    }

    @Transactional
    public void deleteZone(String id, String deletedByUserId) {
        Zone zone = zoneRepository.findById(id)
                .filter(z -> !z.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Zone", "id", id));
        zone.softDelete(deletedByUserId);
        zoneRepository.save(zone);
    }

    public ZoneResponse mapToZoneResponse(Zone zone) {
        int benchCount = benchRepository.findAllByZoneIdAndIsDeletedFalseOrderByBenchNumberDesc(zone.getId()).size();
        return ZoneResponse.builder()
                .id(zone.getId())
                .mineId(zone.getMineId())
                .name(zone.getName())
                .code(zone.getCode())
                .zoneType(zone.getZoneType())
                .hazardLevel(zone.getHazardLevel())
                .maxPersonnelCapacity(zone.getMaxPersonnelCapacity())
                .maxVehicleCapacity(zone.getMaxVehicleCapacity())
                .boundaryCoordinates(zone.getBoundaryCoordinates())
                .elevationRangeMin(zone.getElevationRangeMin())
                .elevationRangeMax(zone.getElevationRangeMax())
                .status(zone.getStatus())
                .metadata(zone.getMetadata())
                .benchCount(benchCount)
                .createdAt(zone.getCreatedAt())
                .updatedAt(zone.getUpdatedAt())
                .build();
    }
}
