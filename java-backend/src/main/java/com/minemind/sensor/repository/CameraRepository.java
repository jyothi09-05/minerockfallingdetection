package com.minemind.sensor.repository;

import com.minemind.sensor.entity.Camera;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CameraRepository extends JpaRepository<Camera, String> {
    List<Camera> findAllByMineIdAndIsDeletedFalse(String mineId);
    Page<Camera> findAllByMineIdAndIsDeletedFalse(String mineId, Pageable pageable);
    Optional<Camera> findByCameraCodeAndIsDeletedFalse(String cameraCode);
}
