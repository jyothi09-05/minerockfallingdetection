package com.minemind.auth.repository;

import com.minemind.auth.entity.SecurityEvent;
import com.minemind.auth.enums.SecurityEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, String> {
    Page<SecurityEvent> findAllByUserId(String userId, Pageable pageable);
    Page<SecurityEvent> findAllByEventType(SecurityEventType eventType, Pageable pageable);
}
