package com.minemind.workforce.repository;

import com.minemind.workforce.entity.ShiftAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, String> {
    List<ShiftAssignment> findAllByWorkerIdOrderByStartTimeDesc(String workerId);
    List<ShiftAssignment> findAllByMineIdOrderByStartTimeDesc(String mineId);
}
