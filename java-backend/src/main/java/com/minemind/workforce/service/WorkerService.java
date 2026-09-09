package com.minemind.workforce.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import com.minemind.workforce.dto.ShiftAssignRequest;
import com.minemind.workforce.dto.ShiftResponse;
import com.minemind.workforce.dto.WorkerCreateRequest;
import com.minemind.workforce.dto.WorkerResponse;
import com.minemind.workforce.entity.ShiftAssignment;
import com.minemind.workforce.entity.Worker;
import com.minemind.workforce.entity.WorkerCertification;
import com.minemind.workforce.enums.MedicalClearanceStatus;
import com.minemind.workforce.enums.ShiftStatus;
import com.minemind.workforce.enums.WorkerStatus;
import com.minemind.workforce.repository.ShiftAssignmentRepository;
import com.minemind.workforce.repository.WorkerCertificationRepository;
import com.minemind.workforce.repository.WorkerRepository;
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
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final WorkerCertificationRepository certRepository;
    private final ShiftAssignmentRepository shiftRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public PageResponse<WorkerResponse> getWorkers(String mineId, String keyword, Pageable pageable) {
        Page<Worker> page;
        if (keyword != null && !keyword.isBlank()) {
            page = workerRepository.searchWorkers(mineId, keyword.trim(), pageable);
        } else {
            page = workerRepository.findAllByAssignedMineIdAndIsDeletedFalse(mineId, pageable);
        }
        return PageResponse.of(page.map(this::mapToWorkerResponse));
    }

    @Transactional(readOnly = true)
    public WorkerResponse getWorkerById(String id) {
        Worker worker = workerRepository.findById(id)
                .filter(w -> !w.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Worker", "id", id));
        return mapToWorkerResponse(worker);
    }

    @Transactional
    public WorkerResponse createWorker(WorkerCreateRequest request, String createdByUserId) {
        if (workerRepository.existsByBadgeNumber(request.getBadgeNumber())) {
            throw new ConflictException("Worker with badge number " + request.getBadgeNumber() + " already exists.");
        }

        Worker worker = Worker.builder()
                .organizationId(request.getOrganizationId())
                .userId(request.getUserId())
                .assignedMineId(request.getAssignedMineId())
                .currentZoneId(request.getCurrentZoneId())
                .badgeNumber(request.getBadgeNumber().toUpperCase())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(request.getRole())
                .bloodGroup(request.getBloodGroup())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .medicalClearanceStatus(request.getMedicalClearanceStatus() != null ? request.getMedicalClearanceStatus() : MedicalClearanceStatus.VALID)
                .status(request.getStatus() != null ? request.getStatus() : WorkerStatus.OFF_DUTY)
                .rfidTagId(request.getRfidTagId())
                .metadata(request.getMetadata())
                .build();
        worker.setCreatedBy(createdByUserId);

        Worker saved = workerRepository.save(worker);
        log.info("Worker registered: {} ({}) for mine {}", saved.getFullName(), saved.getBadgeNumber(), saved.getAssignedMineId());
        return mapToWorkerResponse(saved);
    }

    @Transactional
    public ShiftResponse assignShift(ShiftAssignRequest request) {
        if (!workerRepository.existsById(request.getWorkerId())) {
            throw new ResourceNotFoundException("Worker", "id", request.getWorkerId());
        }

        ShiftAssignment assignment = ShiftAssignment.builder()
                .workerId(request.getWorkerId())
                .mineId(request.getMineId())
                .zoneId(request.getZoneId())
                .shiftName(request.getShiftName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(ShiftStatus.SCHEDULED)
                .notes(request.getNotes())
                .build();

        ShiftAssignment saved = shiftRepository.save(assignment);
        return mapToShiftResponse(saved);
    }

    public WorkerResponse mapToWorkerResponse(Worker worker) {
        List<String> certNames = certRepository.findAllByWorkerId(worker.getId())
                .stream().map(WorkerCertification::getCertificationName)
                .collect(Collectors.toList());

        return WorkerResponse.builder()
                .id(worker.getId())
                .organizationId(worker.getOrganizationId())
                .userId(worker.getUserId())
                .assignedMineId(worker.getAssignedMineId())
                .currentZoneId(worker.getCurrentZoneId())
                .badgeNumber(worker.getBadgeNumber())
                .firstName(worker.getFirstName())
                .lastName(worker.getLastName())
                .fullName(worker.getFullName())
                .role(worker.getRole())
                .bloodGroup(worker.getBloodGroup())
                .emergencyContactName(worker.getEmergencyContactName())
                .emergencyContactPhone(worker.getEmergencyContactPhone())
                .medicalClearanceStatus(worker.getMedicalClearanceStatus())
                .status(worker.getStatus())
                .rfidTagId(worker.getRfidTagId())
                .metadata(worker.getMetadata())
                .activeCertifications(certNames)
                .createdAt(worker.getCreatedAt())
                .updatedAt(worker.getUpdatedAt())
                .build();
    }

    public ShiftResponse mapToShiftResponse(ShiftAssignment s) {
        return ShiftResponse.builder()
                .id(s.getId())
                .workerId(s.getWorkerId())
                .mineId(s.getMineId())
                .zoneId(s.getZoneId())
                .shiftName(s.getShiftName())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .status(s.getStatus())
                .notes(s.getNotes())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
