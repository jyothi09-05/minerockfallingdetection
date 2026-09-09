package com.minemind.asset.repository;

import com.minemind.asset.entity.EquipmentTelemetry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentTelemetryRepository extends JpaRepository<EquipmentTelemetry, String> {
    List<EquipmentTelemetry> findTop50ByEquipmentIdOrderByTimestampDesc(String equipmentId);
    Page<EquipmentTelemetry> findAllByEquipmentId(String equipmentId, Pageable pageable);
}
