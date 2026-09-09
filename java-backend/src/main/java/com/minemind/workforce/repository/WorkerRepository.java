package com.minemind.workforce.repository;

import com.minemind.workforce.entity.Worker;
import com.minemind.workforce.enums.WorkerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, String> {

    Optional<Worker> findByBadgeNumberAndIsDeletedFalse(String badgeNumber);

    boolean existsByBadgeNumber(String badgeNumber);

    Page<Worker> findAllByAssignedMineIdAndIsDeletedFalse(String mineId, Pageable pageable);

    List<Worker> findAllByCurrentZoneIdAndIsDeletedFalse(String zoneId);

    Page<Worker> findAllByAssignedMineIdAndStatusAndIsDeletedFalse(String mineId, WorkerStatus status, Pageable pageable);

    @Query("SELECT w FROM Worker w WHERE w.assignedMineId = :mineId AND w.isDeleted = false AND " +
            "(:keyword IS NULL OR LOWER(w.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(w.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(w.badgeNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Worker> searchWorkers(@Param("mineId") String mineId, @Param("keyword") String keyword, Pageable pageable);

    long countByAssignedMineIdAndStatusAndIsDeletedFalse(String mineId, WorkerStatus status);
}
