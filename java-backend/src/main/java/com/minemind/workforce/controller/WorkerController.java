package com.minemind.workforce.controller;

import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
import com.minemind.workforce.dto.ShiftAssignRequest;
import com.minemind.workforce.dto.ShiftResponse;
import com.minemind.workforce.dto.WorkerCreateRequest;
import com.minemind.workforce.dto.WorkerResponse;
import com.minemind.workforce.service.WorkerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workers")
@RequiredArgsConstructor
@Tag(name = "Workforce & Safety Personnel Hub", description = "Endpoints for mine personnel, certifications, shift scheduling, and zone presence")
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping("/by-mine/{mineId}")
    @PreAuthorize("hasAuthority('WORKER_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get paginated workforce roster for a mine site")
    public ResponseEntity<ApiResponse<PageResponse<WorkerResponse>>> getWorkers(
            @PathVariable String mineId,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<WorkerResponse> response = workerService.getWorkers(mineId, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('WORKER_READ') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'SAFETY_OFFICER', 'VIEWER')")
    @Operation(summary = "Get detailed worker personnel profile")
    public ResponseEntity<ApiResponse<WorkerResponse>> getWorkerById(@PathVariable String id) {
        WorkerResponse response = workerService.getWorkerById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WORKER_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Register new mine personnel")
    public ResponseEntity<ApiResponse<WorkerResponse>> createWorker(
            @Valid @RequestBody WorkerCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        WorkerResponse response = workerService.createWorker(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.created("Worker registered successfully", response));
    }

    @PostMapping("/shifts")
    @PreAuthorize("hasAuthority('WORKER_WRITE') or hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN', 'MINE_MANAGER')")
    @Operation(summary = "Assign a shift roster to a worker")
    public ResponseEntity<ApiResponse<ShiftResponse>> assignShift(@Valid @RequestBody ShiftAssignRequest request) {
        ShiftResponse response = workerService.assignShift(request);
        return ResponseEntity.ok(ApiResponse.created("Shift scheduled successfully", response));
    }
}
