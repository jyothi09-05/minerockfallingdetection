package com.minemind.workforce.repository;

import com.minemind.workforce.entity.WorkerCertification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkerCertificationRepository extends JpaRepository<WorkerCertification, String> {
    List<WorkerCertification> findAllByWorkerId(String workerId);
}
