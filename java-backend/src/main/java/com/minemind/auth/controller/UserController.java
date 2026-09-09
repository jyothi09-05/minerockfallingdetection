package com.minemind.auth.controller;

import com.minemind.auth.dto.ChangePasswordRequest;
import com.minemind.auth.dto.RoleResponse;
import com.minemind.auth.dto.UpdateUserRequest;
import com.minemind.auth.dto.UserResponse;
import com.minemind.auth.service.UserService;
import com.minemind.common.dto.ApiResponse;
import com.minemind.common.dto.PageResponse;
import com.minemind.config.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management & RBAC", description = "Endpoints for managing users, roles, and security credentials")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse response = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN') or hasAuthority('USER_READ')")
    @Operation(summary = "Get paginated list of users")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        PageResponse<UserResponse> response = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN') or hasAuthority('USER_READ')")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN') or hasAuthority('USER_WRITE')")
    @Operation(summary = "Update user details and roles")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", response));
    }

    @PostMapping("/{id}/change-password")
    @Operation(summary = "Change password for user")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable String id,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Password updated successfully", null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN')")
    @Operation(summary = "Soft delete a user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable String id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        userService.deleteUser(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'MINE_ADMIN') or hasAuthority('USER_READ')")
    @Operation(summary = "Get all available platform roles and permissions")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> response = userService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
