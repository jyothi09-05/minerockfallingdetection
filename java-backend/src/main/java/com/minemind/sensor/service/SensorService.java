package com.minemind.sensor.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import com.minemind.sensor.dto.SensorCreateRequest;
import com.minemind.sensor.dto.SensorReadingRequest;
import com.minemind.sensor.dto.SensorResponse;
import com.minemind.sensor.entity.Sensor;
import com.minemind.sensor.entity.SensorReading;
import com.minemind.sensor.enums.SensorStatus;
import com.minemind.sensor.repository.SensorReadingRepository;
import com.minemind.sensor.repository.SensorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SensorService {

    private final SensorRepository sensorRepository;
    private final SensorReadingRepository readingRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public PageResponse<SensorResponse> getSensors(String mineId, Pageable pageable) {
        Page<Sensor> page = sensorRepository.findAllByMineIdAndIsDeletedFalse(mineId, pageable);
        return PageResponse.of(page.map(this::mapToSensorResponse));
    }

    @Transactional(readOnly = true)
    public SensorResponse getSensorById(String id) {
        Sensor sensor = sensorRepository.findById(id)
                .filter(s -> !s.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor", "id", id));
        return mapToSensorResponse(sensor);
    }

    @Transactional
    public SensorResponse createSensor(SensorCreateRequest request, String createdByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        if (sensorRepository.existsBySensorCode(request.getSensorCode())) {
            throw new ConflictException("Sensor with code " + request.getSensorCode() + " already exists.");
        }

        Sensor sensor = Sensor.builder()
                .mineId(request.getMineId())
                .zoneId(request.getZoneId())
                .sensorCode(request.getSensorCode().toUpperCase())
                .name(request.getName())
                .type(request.getType())
                .unitOfMeasurement(request.getUnitOfMeasurement())
                .minSafeThreshold(request.getMinSafeThreshold())
                .maxSafeThreshold(request.getMaxSafeThreshold())
                .warningThreshold(request.getWarningThreshold())
                .criticalThreshold(request.getCriticalThreshold())
                .samplingIntervalSeconds(request.getSamplingIntervalSeconds() != null ? request.getSamplingIntervalSeconds() : 5)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .elevationMeters(request.getElevationMeters())
                .status(request.getStatus() != null ? request.getStatus() : SensorStatus.ACTIVE)
                .metadata(request.getMetadata())
                .build();
        sensor.setCreatedBy(createdByUserId);

        Sensor saved = sensorRepository.save(sensor);
        log.info("Sensor registered: {} ({}) for mine {}", saved.getName(), saved.getSensorCode(), saved.getMineId());
        return mapToSensorResponse(saved);
    }

    @Transactional
    public void recordReading(SensorReadingRequest request) {
        Sensor sensor = sensorRepository.findById(request.getSensorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sensor", "id", request.getSensorId()));

        String status = "NORMAL";
        if (sensor.getCriticalThreshold() != null && request.getValue() >= sensor.getCriticalThreshold()) {
            status = "CRITICAL";
            sensor.setStatus(SensorStatus.CRITICAL);
        } else if (sensor.getWarningThreshold() != null && request.getValue() >= sensor.getWarningThreshold()) {
            status = "WARNING";
            sensor.setStatus(SensorStatus.WARNING);
        } else {
            sensor.setStatus(SensorStatus.ACTIVE);
        }

        sensor.setLatestReadingValue(request.getValue());
        sensor.setLatestReadingTime(Instant.now());
        sensorRepository.save(sensor);

        SensorReading reading = SensorReading.builder()
                .sensorId(sensor.getId())
                .timestamp(Instant.now())
                .value(request.getValue())
                .status(status)
                .qualityScore(1.0)
                .rawPayload(request.getRawPayload())
                .build();

        readingRepository.save(reading);
    }

    @Transactional(readOnly = true)
    public List<SensorReading> getRecentReadings(String sensorId) {
        return readingRepository.findTop100BySensorIdOrderByTimestampDesc(sensorId);
    }

    public SensorResponse mapToSensorResponse(Sensor s) {
        return SensorResponse.builder()
                .id(s.getId())
                .mineId(s.getMineId())
                .zoneId(s.getZoneId())
                .sensorCode(s.getSensorCode())
                .name(s.getName())
                .type(s.getType())
                .unitOfMeasurement(s.getUnitOfMeasurement())
                .minSafeThreshold(s.getMinSafeThreshold())
                .maxSafeThreshold(s.getMaxSafeThreshold())
                .warningThreshold(s.getWarningThreshold())
                .criticalThreshold(s.getCriticalThreshold())
                .samplingIntervalSeconds(s.getSamplingIntervalSeconds())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .elevationMeters(s.getElevationMeters())
                .status(s.getStatus())
                .latestReadingValue(s.getLatestReadingValue())
                .latestReadingTime(s.getLatestReadingTime())
                .metadata(s.getMetadata())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
