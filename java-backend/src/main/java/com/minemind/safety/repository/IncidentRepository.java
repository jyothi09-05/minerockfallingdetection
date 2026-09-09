package com.minemind.safety.repository;

import com.minemind.safety.entity.Incident;
import com.minemind.safety.enums.IncidentSeverity;
import com.minemind.safety.enums.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {
    Optional<Incident> findByIncidentNumberAndIsDeletedFalse(String incidentNumber);
    Page<Incident> findAllByMineIdAndIsDeletedFalse(String mineId, Pageable pageable);
    Page<Incident> findAllByMineIdAndSeverityAndIsDeletedFalse(String mineId, IncidentSeverity severity, Pageable pageable);
    Page<Incident> findAllByMineIdAndStatusAndIsDeletedFalse(String mineId, IncidentStatus status, Pageable pageable);
}
