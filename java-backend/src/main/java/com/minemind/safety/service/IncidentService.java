package com.minemind.safety.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import com.minemind.safety.dto.IncidentCreateRequest;
import com.minemind.safety.dto.IncidentResponse;
import com.minemind.safety.entity.Incident;
import com.minemind.safety.enums.IncidentStatus;
import com.minemind.safety.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public PageResponse<IncidentResponse> getIncidents(String mineId, Pageable pageable) {
        Page<Incident> page = incidentRepository.findAllByMineIdAndIsDeletedFalse(mineId, pageable);
        return PageResponse.of(page.map(this::mapToIncidentResponse));
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(String id) {
        Incident incident = incidentRepository.findById(id)
                .filter(i -> !i.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
        return mapToIncidentResponse(incident);
    }

    @Transactional
    public IncidentResponse reportIncident(IncidentCreateRequest request, String reportedByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        String incidentNum = "INC-" + System.currentTimeMillis() % 1000000;

        Incident incident = Incident.builder()
                .mineId(request.getMineId())
                .zoneId(request.getZoneId())
                .incidentNumber(incidentNum)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .severity(request.getSeverity())
                .status(request.getStatus() != null ? request.getStatus() : IncidentStatus.REPORTED)
                .reportedById(reportedByUserId)
                .assignedInvestigatorId(request.getAssignedInvestigatorId())
                .occurredAt(request.getOccurredAt())
                .injuriesCount(request.getInjuriesCount() != null ? request.getInjuriesCount() : 0)
                .fatalitiesCount(request.getFatalitiesCount() != null ? request.getFatalitiesCount() : 0)
                .estimatedCostUsd(request.getEstimatedCostUsd() != null ? request.getEstimatedCostUsd() : 0.0)
                .rootCauseAnalysis(request.getRootCauseAnalysis())
                .correctiveActions(request.getCorrectiveActions())
                .metadata(request.getMetadata())
                .build();
        incident.setCreatedBy(reportedByUserId);

        Incident saved = incidentRepository.save(incident);
        log.warn("SAFETY INCIDENT LOGGED: {} ({}) Severity: {}", saved.getTitle(), saved.getIncidentNumber(), saved.getSeverity());
        return mapToIncidentResponse(saved);
    }

    public IncidentResponse mapToIncidentResponse(Incident i) {
        return IncidentResponse.builder()
                .id(i.getId())
                .mineId(i.getMineId())
                .zoneId(i.getZoneId())
                .incidentNumber(i.getIncidentNumber())
                .title(i.getTitle())
                .description(i.getDescription())
                .category(i.getCategory())
                .severity(i.getSeverity())
                .status(i.getStatus())
                .reportedById(i.getReportedById())
                .assignedInvestigatorId(i.getAssignedInvestigatorId())
                .occurredAt(i.getOccurredAt())
                .containedAt(i.getContainedAt())
                .resolvedAt(i.getResolvedAt())
                .injuriesCount(i.getInjuriesCount())
                .fatalitiesCount(i.getFatalitiesCount())
                .estimatedCostUsd(i.getEstimatedCostUsd())
                .rootCauseAnalysis(i.getRootCauseAnalysis())
                .correctiveActions(i.getCorrectiveActions())
                .metadata(i.getMetadata())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
