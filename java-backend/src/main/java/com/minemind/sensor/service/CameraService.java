package com.minemind.sensor.service;

import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import com.minemind.mine.repository.MineRepository;
import com.minemind.sensor.dto.CameraCreateRequest;
import com.minemind.sensor.dto.CameraResponse;
import com.minemind.sensor.entity.Camera;
import com.minemind.sensor.enums.CameraStatus;
import com.minemind.sensor.repository.CameraRepository;
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
public class CameraService {

    private final CameraRepository cameraRepository;
    private final MineRepository mineRepository;

    @Transactional(readOnly = true)
    public List<CameraResponse> getCamerasByMineId(String mineId) {
        return cameraRepository.findAllByMineIdAndIsDeletedFalse(mineId)
                .stream().map(this::mapToCameraResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<CameraResponse> getCamerasPaginated(String mineId, Pageable pageable) {
        Page<Camera> page = cameraRepository.findAllByMineIdAndIsDeletedFalse(mineId, pageable);
        return PageResponse.of(page.map(this::mapToCameraResponse));
    }

    @Transactional
    public CameraResponse createCamera(CameraCreateRequest request, String createdByUserId) {
        if (!mineRepository.existsById(request.getMineId())) {
            throw new ResourceNotFoundException("Mine", "id", request.getMineId());
        }

        if (cameraRepository.findByCameraCodeAndIsDeletedFalse(request.getCameraCode()).isPresent()) {
            throw new ConflictException("Camera with code " + request.getCameraCode() + " already exists.");
        }

        Camera camera = Camera.builder()
                .mineId(request.getMineId())
                .zoneId(request.getZoneId())
                .cameraCode(request.getCameraCode().toUpperCase())
                .name(request.getName())
                .type(request.getType())
                .streamUrl(request.getStreamUrl())
                .resolution(request.getResolution() != null ? request.getResolution() : "1080p")
                .fps(request.getFps() != null ? request.getFps() : 30)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus() != null ? request.getStatus() : CameraStatus.ONLINE)
                .aiAnalyticsEnabled(request.getAiAnalyticsEnabled() != null ? request.getAiAnalyticsEnabled() : true)
                .metadata(request.getMetadata())
                .build();
        camera.setCreatedBy(createdByUserId);

        Camera saved = cameraRepository.save(camera);
        log.info("Camera registered: {} ({}) for mine {}", saved.getName(), saved.getCameraCode(), saved.getMineId());
        return mapToCameraResponse(saved);
    }

    public CameraResponse mapToCameraResponse(Camera c) {
        return CameraResponse.builder()
                .id(c.getId())
                .mineId(c.getMineId())
                .zoneId(c.getZoneId())
                .cameraCode(c.getCameraCode())
                .name(c.getName())
                .type(c.getType())
                .streamUrl(c.getStreamUrl())
                .resolution(c.getResolution())
                .fps(c.getFps())
                .latitude(c.getLatitude())
                .longitude(c.getLongitude())
                .ptzPanDegrees(c.getPtzPanDegrees())
                .ptzTiltDegrees(c.getPtzTiltDegrees())
                .ptzZoomFactor(c.getPtzZoomFactor())
                .status(c.getStatus())
                .aiAnalyticsEnabled(c.isAiAnalyticsEnabled())
                .metadata(c.getMetadata())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
