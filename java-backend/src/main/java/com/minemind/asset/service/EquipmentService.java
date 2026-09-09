package com.minemind.asset.service;

import com.minemind.asset.dto.*;
import com.minemind.asset.entity.Equipment;
import com.minemind.asset.entity.EquipmentTelemetry;
import com.minemind.asset.entity.Vehicle;
import com.minemind.asset.enums.EquipmentStatus;
import com.minemind.asset.repository.EquipmentRepository;
import com.minemind.asset.repository.EquipmentTelemetryRepository;
import com.minemind.asset.repository.VehicleRepository;
import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final VehicleRepository vehicleRepository;
    private final EquipmentTelemetryRepository telemetryRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public PageResponse<EquipmentResponse> getEquipment(String mineId, String keyword, Pageable pageable) {
        Page<Equipment> page;
        if (keyword != null && !keyword.isBlank()) {
            page = equipmentRepository.searchEquipment(mineId, keyword.trim(), pageable);
        } else {
            page = equipmentRepository.findAllByMineIdAndIsDeletedFalse(mineId, pageable);
        }
        return PageResponse.of(page.map(this::mapToEquipmentResponse));
    }

    @Transactional(readOnly = true)
    public EquipmentResponse getEquipmentById(String id) {
        Equipment equipment = equipmentRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", id));
        return mapToEquipmentResponse(equipment);
    }

    @Transactional
    public EquipmentResponse createEquipment(EquipmentCreateRequest request, String createdByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        if (equipmentRepository.existsByAssetTag(request.getAssetTag())) {
            throw new ConflictException("Asset with tag " + request.getAssetTag() + " already exists.");
        }

        Equipment equipment = Equipment.builder()
                .mineId(request.getMineId())
                .currentZoneId(request.getCurrentZoneId())
                .assetTag(request.getAssetTag().toUpperCase())
                .name(request.getName())
                .type(request.getType())
                .modelNumber(request.getModelNumber())
                .serialNumber(request.getSerialNumber())
                .manufacturer(request.getManufacturer())
                .manufactureYear(request.getManufactureYear())
                .capacityTonnes(request.getCapacityTonnes())
                .enginePowerKw(request.getEnginePowerKw())
                .fuelCapacityLiters(request.getFuelCapacityLiters())
                .status(request.getStatus() != null ? request.getStatus() : EquipmentStatus.OPERATIONAL)
                .healthScore(100)
                .operatingHours(0.0)
                .metadata(request.getMetadata())
                .build();
        equipment.setCreatedBy(createdByUserId);

        Equipment saved = equipmentRepository.save(equipment);
        log.info("Equipment registered: {} ({}) for mine {}", saved.getName(), saved.getAssetTag(), saved.getMineId());
        return mapToEquipmentResponse(saved);
    }

    @Transactional
    public void recordTelemetry(TelemetryIngestRequest request) {
        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", request.getEquipmentId()));

        EquipmentTelemetry telemetry = EquipmentTelemetry.builder()
                .equipmentId(equipment.getId())
                .timestamp(Instant.now())
                .engineTempCelsius(request.getEngineTempCelsius())
                .oilPressurePsi(request.getOilPressurePsi())
                .vibrationAmplitudeMms(request.getVibrationAmplitudeMms())
                .hydraulicPressureBar(request.getHydraulicPressureBar())
                .fuelFlowRateLph(request.getFuelFlowRateLph())
                .batteryVoltageVolts(request.getBatteryVoltageVolts())
                .rawPayload(request.getRawPayload())
                .build();

        telemetryRepository.save(telemetry);

        // Simple health score degradation algorithm based on telemetry thresholds
        if (request.getEngineTempCelsius() != null && request.getEngineTempCelsius() > 105.0) {
            equipment.setHealthScore(Math.max(20, equipment.getHealthScore() - 10));
            equipment.setStatus(EquipmentStatus.CRITICAL_FAULT);
            equipmentRepository.save(equipment);
        }
    }

    @Transactional(readOnly = true)
    public List<EquipmentTelemetry> getRecentTelemetry(String equipmentId) {
        return telemetryRepository.findTop50ByEquipmentIdOrderByTimestampDesc(equipmentId);
    }

    public EquipmentResponse mapToEquipmentResponse(Equipment equipment) {
        VehicleResponse vResp = vehicleRepository.findByEquipmentId(equipment.getId())
                .map(v -> VehicleResponse.builder()
                        .id(v.getId())
                        .equipmentId(v.getEquipmentId())
                        .licensePlate(v.getLicensePlate())
                        .fuelType(v.getFuelType())
                        .currentFuelLevelPercent(v.getCurrentFuelLevelPercent())
                        .currentSpeedKmh(v.getCurrentSpeedKmh())
                        .latitude(v.getLatitude())
                        .longitude(v.getLongitude())
                        .headingDegrees(v.getHeadingDegrees())
                        .assignedDriverId(v.getAssignedDriverId())
                        .payloadWeightTonnes(v.getPayloadWeightTonnes())
                        .odometerKm(v.getOdometerKm())
                        .updatedAt(v.getUpdatedAt())
                        .build())
                .orElse(null);

        return EquipmentResponse.builder()
                .id(equipment.getId())
                .mineId(equipment.getMineId())
                .currentZoneId(equipment.getCurrentZoneId())
                .assetTag(equipment.getAssetTag())
                .name(equipment.getName())
                .type(equipment.getType())
                .modelNumber(equipment.getModelNumber())
                .serialNumber(equipment.getSerialNumber())
                .manufacturer(equipment.getManufacturer())
                .manufactureYear(equipment.getManufactureYear())
                .capacityTonnes(equipment.getCapacityTonnes())
                .enginePowerKw(equipment.getEnginePowerKw())
                .fuelCapacityLiters(equipment.getFuelCapacityLiters())
                .status(equipment.getStatus())
                .healthScore(equipment.getHealthScore())
                .operatingHours(equipment.getOperatingHours())
                .lastMaintenanceDate(equipment.getLastMaintenanceDate())
                .nextMaintenanceDue(equipment.getNextMaintenanceDue())
                .metadata(equipment.getMetadata())
                .vehicleDetails(vResp)
                .createdAt(equipment.getCreatedAt())
                .updatedAt(equipment.getUpdatedAt())
                .build();
    }
}
