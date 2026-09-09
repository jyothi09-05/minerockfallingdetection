package com.minemind.auth;

import com.minemind.auth.dto.LoginRequest;
import com.minemind.auth.entity.Role;
import com.minemind.auth.entity.User;
import com.minemind.auth.enums.AccountStatus;
import com.minemind.auth.enums.RoleType;
import com.minemind.auth.repository.UserRepository;
import com.minemind.auth.service.AuthService;
import com.minemind.common.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private HttpServletRequest httpRequest;

    @Test
    void testLoginWithUnknownUser_ThrowsUnauthorized() {
        AuthService authService = new AuthService(
                authenticationManager, userRepository, null, null, null, passwordEncoder,
                mock(com.minemind.auth.service.SecurityEventService.class),
                mock(com.minemind.auth.service.UserService.class)
        );

        when(userRepository.findByUsernameOrEmail("nonexistent")).thenReturn(Optional.empty());
        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");

        LoginRequest req = LoginRequest.builder()
                .identifier("nonexistent")
                .password("password123")
                .build();

        assertThrows(UnauthorizedException.class, () -> authService.login(req, httpRequest));
    }
}
