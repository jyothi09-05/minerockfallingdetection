package com.minemind.auth.service;

import com.minemind.auth.dto.*;
import com.minemind.auth.entity.Role;
import com.minemind.auth.entity.User;
import com.minemind.auth.entity.UserSession;
import com.minemind.auth.enums.AccountStatus;
import com.minemind.auth.enums.RoleType;
import com.minemind.auth.enums.SecurityEventType;
import com.minemind.auth.repository.RoleRepository;
import com.minemind.auth.repository.UserRepository;
import com.minemind.auth.repository.UserSessionRepository;
import com.minemind.common.exception.BadRequestException;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.UnauthorizedException;
import com.minemind.config.CustomUserDetails;
import com.minemind.config.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSessionRepository userSessionRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final SecurityEventService securityEventService;
    private final UserService userService;

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        User user = userRepository.findByUsernameOrEmail(request.getIdentifier())
                .orElseThrow(() -> {
                    securityEventService.recordEvent(null, SecurityEventType.LOGIN_FAILURE, clientIp, userAgent, "FAILURE", "Unknown user: " + request.getIdentifier());
                    return new UnauthorizedException("Invalid username or password");
                });

        if (user.isAccountLocked()) {
            securityEventService.recordEvent(user.getId(), SecurityEventType.LOGIN_FAILURE, clientIp, userAgent, "WARNING", "Locked account login attempt");
            throw new UnauthorizedException("Account is temporarily locked. Please try again later.");
        }

        if (user.getStatus() != AccountStatus.ACTIVE) {
            securityEventService.recordEvent(user.getId(), SecurityEventType.LOGIN_FAILURE, clientIp, userAgent, "WARNING", "Inactive account status: " + user.getStatus());
            throw new UnauthorizedException("Account is not active (" + user.getStatus() + "). Contact system administrator.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Reset failed login counter and update last login time
            user.setFailedLoginAttempts(0);
            user.setLastLoginAt(Instant.now());
            user.setLastLoginIp(clientIp);
            userRepository.save(user);

            // Generate tokens
            String accessToken = tokenProvider.generateAccessToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken();

            // Persist session
            UserSession session = UserSession.builder()
                    .userId(user.getId())
                    .refreshTokenHash(passwordEncoder.encode(refreshToken))
                    .ipAddress(clientIp)
                    .userAgent(userAgent)
                    .expiresAt(Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs()))
                    .isRevoked(false)
                    .build();
            userSessionRepository.save(session);

            securityEventService.recordEvent(user.getId(), SecurityEventType.LOGIN_SUCCESS, clientIp, userAgent, "SUCCESS", "User login successful");

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
            Set<String> permissions = user.getRoles().stream()
                    .flatMap(r -> r.getPermissions().stream())
                    .map(p -> p.getName())
                    .collect(Collectors.toSet());

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(tokenProvider.getExpirationMs() / 1000)
                    .user(userService.mapToUserResponse(user))
                    .roles(roles)
                    .permissions(permissions)
                    .build();

        } catch (Exception ex) {
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setLockoutUntil(Instant.now().plusSeconds(900)); // 15 mins lock
                securityEventService.recordEvent(user.getId(), SecurityEventType.ACCOUNT_LOCKED, clientIp, userAgent, "WARNING", "5 failed attempts - lockout triggered");
            }
            userRepository.save(user);
            securityEventService.recordEvent(user.getId(), SecurityEventType.LOGIN_FAILURE, clientIp, userAgent, "FAILURE", "Bad credentials");
            throw new UnauthorizedException("Invalid username or password");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered");
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoleNames() != null && !request.getRoleNames().isEmpty()) {
            for (String roleName : request.getRoleNames()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
                roles.add(role);
            }
        } else {
            Role defaultRole = roleRepository.findByName(RoleType.ROLE_VIEWER.name())
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .id("role-viewer-default")
                            .name(RoleType.ROLE_VIEWER.name())
                            .displayName("Viewer")
                            .isSystemRole(true)
                            .build()));
            roles.add(defaultRole);
        }

        User user = User.builder()
                .organizationId(request.getOrganizationId())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .jobTitle(request.getJobTitle())
                .department(request.getDepartment())
                .status(AccountStatus.ACTIVE)
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);
        securityEventService.recordEvent(savedUser.getId(), SecurityEventType.ROLE_ASSIGNMENT, clientIp, userAgent, "SUCCESS", "User self-registered");

        // Automatically create session & login
        LoginRequest loginReq = LoginRequest.builder()
                .identifier(savedUser.getUsername())
                .password(request.getPassword())
                .build();

        return login(loginReq, httpRequest);
    }

    @Transactional
    public void logout(String userId, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        userSessionRepository.findAllByUserIdAndIsRevokedFalse(userId)
                .forEach(session -> {
                    session.setRevoked(true);
                    userSessionRepository.save(session);
                });

        securityEventService.recordEvent(userId, SecurityEventType.LOGOUT, clientIp, userAgent, "SUCCESS", "User session revoked");
    }
}
