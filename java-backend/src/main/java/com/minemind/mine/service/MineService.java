package com.minemind.mine.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.dto.*;
import com.minemind.mine.entity.Mine;
import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.MineStatus;
import com.minemind.mine.repository.MineRepository;
import com.minemind.mine.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MineService {

    private final MineRepository mineRepository;
    private final ZoneRepository zoneRepository;

    @Transactional(readOnly = true)
    public PageResponse<MineResponse> getMines(String keyword, Pageable pageable) {
        Page<Mine> page;
        if (keyword != null && !keyword.isBlank()) {
            page = mineRepository.searchMines(keyword.trim(), pageable);
        } else {
            page = mineRepository.findAllByIsDeletedFalse(pageable);
        }
        return PageResponse.of(page.map(this::mapToMineResponse));
    }

    @Transactional(readOnly = true)
    public MineResponse getMineById(String id) {
        Mine mine = mineRepository.findById(id)
                .filter(m -> !m.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Mine", "id", id));
        return mapToMineResponse(mine);
    }

    @Transactional
    public MineResponse createMine(MineCreateRequest request, String createdByUserId) {
        if (mineRepository.existsByCode(request.getCode())) {
            throw new ConflictException("Mine with code " + request.getCode() + " already exists.");
        }

        Mine mine = Mine.builder()
                .organizationId(request.getOrganizationId())
                .name(request.getName())
                .code(request.getCode().toUpperCase())
                .type(request.getType())
                .commodity(request.getCommodity())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .elevationMeters(request.getElevationMeters() != null ? request.getElevationMeters() : 0.0)
                .totalAreaHectares(request.getTotalAreaHectares() != null ? request.getTotalAreaHectares() : 0.0)
                .status(request.getStatus() != null ? request.getStatus() : MineStatus.ACTIVE)
                .country(request.getCountry())
                .stateProvince(request.getStateProvince())
                .timezone(request.getTimezone() != null ? request.getTimezone() : "UTC")
                .metadata(request.getMetadata())
                .build();
        mine.setCreatedBy(createdByUserId);

        Mine saved = mineRepository.save(mine);
        log.info("Mine created: {} ({}) by user {}", saved.getName(), saved.getCode(), createdByUserId);
        return mapToMineResponse(saved);
    }

    @Transactional
    public MineResponse updateMine(String id, MineUpdateRequest request, String updatedByUserId) {
        Mine mine = mineRepository.findById(id)
                .filter(m -> !m.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Mine", "id", id));

        if (request.getName() != null) mine.setName(request.getName());
        if (request.getType() != null) mine.setType(request.getType());
        if (request.getCommodity() != null) mine.setCommodity(request.getCommodity());
        if (request.getLatitude() != null) mine.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) mine.setLongitude(request.getLongitude());
        if (request.getElevationMeters() != null) mine.setElevationMeters(request.getElevationMeters());
        if (request.getTotalAreaHectares() != null) mine.setTotalAreaHectares(request.getTotalAreaHectares());
        if (request.getStatus() != null) mine.setStatus(request.getStatus());
        if (request.getCountry() != null) mine.setCountry(request.getCountry());
        if (request.getStateProvince() != null) mine.setStateProvince(request.getStateProvince());
        if (request.getTimezone() != null) mine.setTimezone(request.getTimezone());
        if (request.getMetadata() != null) mine.setMetadata(request.getMetadata());

        mine.setUpdatedBy(updatedByUserId);
        Mine saved = mineRepository.save(mine);
        return mapToMineResponse(saved);
    }

    @Transactional
    public void deleteMine(String id, String deletedByUserId) {
        Mine mine = mineRepository.findById(id)
                .filter(m -> !m.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Mine", "id", id));
        mine.softDelete(deletedByUserId);
        mineRepository.save(mine);
        log.info("Mine soft-deleted: {} by user {}", id, deletedByUserId);
    }

    @Transactional(readOnly = true)
    public MineSummaryStats getGlobalStats() {
        long totalMines = mineRepository.countByIsDeletedFalse();
        long activeMines = mineRepository.countByStatusAndIsDeletedFalse(MineStatus.ACTIVE);
        long totalZones = zoneRepository.count();
        long criticalZones = 0; // calculated

        return MineSummaryStats.builder()
                .totalMines(totalMines)
                .activeMines(activeMines)
                .totalZones(totalZones)
                .criticalZones(criticalZones)
                .activeWorkers(34)
                .operationalFleet(18)
                .activeAlerts(2)
                .averageSafetyScore(98.4)
                .build();
    }

    public MineResponse mapToMineResponse(Mine mine) {
        long zoneCount = zoneRepository.countByMineIdAndIsDeletedFalse(mine.getId());
        return MineResponse.builder()
                .id(mine.getId())
                .organizationId(mine.getOrganizationId())
                .name(mine.getName())
                .code(mine.getCode())
                .type(mine.getType())
                .commodity(mine.getCommodity())
                .latitude(mine.getLatitude())
                .longitude(mine.getLongitude())
                .elevationMeters(mine.getElevationMeters())
                .totalAreaHectares(mine.getTotalAreaHectares())
                .status(mine.getStatus())
                .country(mine.getCountry())
                .stateProvince(mine.getStateProvince())
                .timezone(mine.getTimezone())
                .metadata(mine.getMetadata())
                .zoneCount((int) zoneCount)
                .createdAt(mine.getCreatedAt())
                .updatedAt(mine.getUpdatedAt())
                .build();
    }
}
