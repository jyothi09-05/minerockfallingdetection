package com.minemind.asset.repository;

import com.minemind.asset.entity.Equipment;
import com.minemind.asset.enums.EquipmentStatus;
import com.minemind.asset.enums.EquipmentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, String> {

    Optional<Equipment> findByAssetTagAndIsDeletedFalse(String assetTag);

    boolean existsByAssetTag(String assetTag);

    Page<Equipment> findAllByMineIdAndIsDeletedFalse(String mineId, Pageable pageable);

    Page<Equipment> findAllByMineIdAndTypeAndIsDeletedFalse(String mineId, EquipmentType type, Pageable pageable);

    Page<Equipment> findAllByMineIdAndStatusAndIsDeletedFalse(String mineId, EquipmentStatus status, Pageable pageable);

    @Query("SELECT e FROM Equipment e WHERE e.mineId = :mineId AND e.isDeleted = false AND " +
            "(:keyword IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.assetTag) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Equipment> searchEquipment(@Param("mineId") String mineId, @Param("keyword") String keyword, Pageable pageable);

    long countByMineIdAndStatusAndIsDeletedFalse(String mineId, EquipmentStatus status);
}
