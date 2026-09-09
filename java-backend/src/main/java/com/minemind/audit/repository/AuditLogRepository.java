package com.minemind.audit.repository;

import com.minemind.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    Page<AuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<AuditLog> findAllByResourceTypeOrderByCreatedAtDesc(String resourceType, Pageable pageable);
    Page<AuditLog> findAllByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
