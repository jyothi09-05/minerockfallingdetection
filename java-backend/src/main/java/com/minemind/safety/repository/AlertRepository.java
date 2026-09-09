package com.minemind.safety.repository;

import com.minemind.safety.entity.Alert;
import com.minemind.safety.enums.AlertLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findAllByMineIdAndIsResolvedFalseOrderByCreatedAtDesc(String mineId);
    Page<Alert> findAllByMineIdOrderByCreatedAtDesc(String mineId, Pageable pageable);
    long countByMineIdAndIsResolvedFalse(String mineId);
    long countByMineIdAndLevelAndIsResolvedFalse(String mineId, AlertLevel level);
}
