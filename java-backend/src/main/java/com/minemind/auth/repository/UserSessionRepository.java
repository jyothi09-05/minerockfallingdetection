package com.minemind.auth.repository;

import com.minemind.auth.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, String> {
    Optional<UserSession> findByRefreshTokenHashAndIsRevokedFalse(String refreshTokenHash);
    List<UserSession> findAllByUserIdAndIsRevokedFalse(String userId);
    void deleteAllByExpiresAtBefore(Instant now);
}
