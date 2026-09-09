package com.minemind.safety.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import com.minemind.safety.dto.AlertCreateRequest;
import com.minemind.safety.dto.AlertResponse;
import com.minemind.safety.entity.Alert;
import com.minemind.safety.repository.AlertRepository;
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
public class AlertService {

    private final AlertRepository alertRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveAlerts(String mineId) {
        return alertRepository.findAllByMineIdAndIsResolvedFalseOrderByCreatedAtDesc(mineId)
                .stream().map(this::mapToAlertResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<AlertResponse> getAlertsPaginated(String mineId, Pageable pageable) {
        Page<Alert> page = alertRepository.findAllByMineIdOrderByCreatedAtDesc(mineId, pageable);
        return PageResponse.of(page.map(this::mapToAlertResponse));
    }

    @Transactional
    public AlertResponse createAlert(AlertCreateRequest request) {
        Alert alert = Alert.builder()
                .mineId(request.getMineId())
                .zoneId(request.getZoneId())
                .sourceType(request.getSourceType())
                .sourceId(request.getSourceId())
                .alertCode(request.getAlertCode())
                .title(request.getTitle())
                .message(request.getMessage())
                .level(request.getLevel())
                .isAcknowledged(false)
                .isResolved(false)
                .metadata(request.getMetadata())
                .build();

        Alert saved = alertRepository.save(alert);
        log.warn("SAFETY ALERT TRIGGERED [{}]: {} - {}", saved.getLevel(), saved.getTitle(), saved.getMessage());
        return mapToAlertResponse(saved);
    }

    @Transactional
    public void acknowledgeAlert(String id, String acknowledgedByUserId) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
        alert.setAcknowledged(true);
        alert.setAcknowledgedById(acknowledgedByUserId);
        alert.setAcknowledgedAt(Instant.now());
        alertRepository.save(alert);
    }

    @Transactional
    public void resolveAlert(String id, String resolvedByUserId, String notes) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
        alert.setResolved(true);
        alert.setResolvedById(resolvedByUserId);
        alert.setResolvedAt(Instant.now());
        alert.setResolutionNotes(notes);
        alertRepository.save(alert);
    }

    public AlertResponse mapToAlertResponse(Alert a) {
        return AlertResponse.builder()
                .id(a.getId())
                .mineId(a.getMineId())
                .zoneId(a.getZoneId())
                .sourceType(a.getSourceType())
                .sourceId(a.getSourceId())
                .alertCode(a.getAlertCode())
                .title(a.getTitle())
                .message(a.getMessage())
                .level(a.getLevel())
                .isAcknowledged(a.isAcknowledged())
                .acknowledgedById(a.getAcknowledgedById())
                .acknowledgedAt(a.getAcknowledgedAt())
                .isResolved(a.isResolved())
                .resolvedById(a.getResolvedById())
                .resolvedAt(a.getResolvedAt())
                .resolutionNotes(a.getResolutionNotes())
                .metadata(a.getMetadata())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
