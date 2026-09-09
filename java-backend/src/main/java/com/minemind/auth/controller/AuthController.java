package com.minemind.auth.controller;

import com.minemind.auth.dto.AuthResponse;
import com.minemind.auth.dto.LoginRequest;
import com.minemind.auth.dto.RegisterRequest;
import com.minemind.auth.service.AuthService;
import com.minemind.common.dto.ApiResponse;
import com.minemind.config.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Authorization", description = "Endpoints for JWT authentication, registration, session management, and logout")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials and generate JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request, httpRequest);
        return ResponseEntity.ok(ApiResponse.created("User registered successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke user active sessions and logout")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal CustomUserDetails userDetails, HttpServletRequest httpRequest) {
        if (userDetails != null) {
            authService.logout(userDetails.getId(), httpRequest);
        }
        return ResponseEntity.ok(ApiResponse.ok("Logout successful", null));
    }
}
