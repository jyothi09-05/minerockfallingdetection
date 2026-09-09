package com.minemind.config;

import com.minemind.common.util.SecurityUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class JpaAuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> SecurityUtils.getCurrentUsername().or(() -> Optional.of("SYSTEM"));
    }
}
