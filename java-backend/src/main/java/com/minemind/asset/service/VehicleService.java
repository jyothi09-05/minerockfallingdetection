package com.minemind.asset.service;

import com.minemind.asset.dto.VehicleCreateRequest;
import com.minemind.asset.dto.VehicleResponse;
import com.minemind.asset.entity.Vehicle;
import com.minemind.asset.enums.FuelType;
import com.minemind.asset.repository.EquipmentRepository;
import com.minemind.asset.repository.VehicleRepository;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final EquipmentRepository equipmentRepository;

    @Transactional
    public VehicleResponse linkVehicle(VehicleCreateRequest request) {
        if (!equipmentRepository.existsById(request.getEquipmentId())) {
            throw new ResourceNotFoundException("Equipment", "id", request.getEquipmentId());
        }

        if (vehicleRepository.findByEquipmentId(request.getEquipmentId()).isPresent()) {
            throw new ConflictException("Vehicle details already linked to this equipment asset.");
        }

        Vehicle vehicle = Vehicle.builder()
                .equipmentId(request.getEquipmentId())
                .licensePlate(request.getLicensePlate())
                .fuelType(request.getFuelType() != null ? request.getFuelType() : FuelType.DIESEL)
                .currentFuelLevelPercent(request.getCurrentFuelLevelPercent() != null ? request.getCurrentFuelLevelPercent() : 100.0)
                .currentSpeedKmh(request.getCurrentSpeedKmh() != null ? request.getCurrentSpeedKmh() : 0.0)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .headingDegrees(request.getHeadingDegrees() != null ? request.getHeadingDegrees() : 0.0)
                .assignedDriverId(request.getAssignedDriverId())
                .payloadWeightTonnes(request.getPayloadWeightTonnes() != null ? request.getPayloadWeightTonnes() : 0.0)
                .odometerKm(request.getOdometerKm() != null ? request.getOdometerKm() : 0.0)
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToVehicleResponse(saved);
    }

    public VehicleResponse mapToVehicleResponse(Vehicle v) {
        return VehicleResponse.builder()
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
                .build();
    }
}
