package com.minemind.mine.repository;

import com.minemind.mine.entity.Zone;
import com.minemind.mine.enums.HazardLevel;
import com.minemind.mine.enums.ZoneStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, String> {

    List<Zone> findAllByMineIdAndIsDeletedFalse(String mineId);

    Page<Zone> findAllByMineIdAndIsDeletedFalse(String mineId, Pageable pageable);

    Optional<Zone> findByMineIdAndCodeAndIsDeletedFalse(String mineId, String code);

    long countByMineIdAndIsDeletedFalse(String mineId);

    long countByMineIdAndHazardLevelAndIsDeletedFalse(String mineId, HazardLevel hazardLevel);
}
