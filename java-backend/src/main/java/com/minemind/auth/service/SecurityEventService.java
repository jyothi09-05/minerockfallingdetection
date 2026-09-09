package com.minemind.auth.service;

import com.minemind.auth.entity.SecurityEvent;
import com.minemind.auth.enums.SecurityEventType;
import com.minemind.auth.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SecurityEventService {

    private final SecurityEventRepository securityEventRepository;

    @Async
    public void recordEvent(String userId, SecurityEventType eventType, String ipAddress, String userAgent, String status, String details) {
        try {
            SecurityEvent event = SecurityEvent.builder()
                    .userId(userId)
                    .eventType(eventType)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .status(status)
                    .details(details)
                    .build();
            securityEventRepository.save(event);
        } catch (Exception e) {
            log.error("Failed to persist security event: {}", e.getMessage());
        }
    }
}
