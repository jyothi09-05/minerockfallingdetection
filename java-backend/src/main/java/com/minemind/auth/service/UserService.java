package com.minemind.auth.service;

import com.minemind.auth.dto.*;
import com.minemind.auth.entity.Role;
import com.minemind.auth.entity.User;
import com.minemind.auth.enums.AccountStatus;
import com.minemind.auth.repository.RoleRepository;
import com.minemind.auth.repository.UserRepository;
import com.minemind.common.dto.PageResponse;
import com.minemind.common.exception.BadRequestException;
import com.minemind.common.exception.ConflictException;
import com.minemind.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findAllByIsDeletedFalse(pageable);
        return PageResponse.of(page.map(this::mapToUserResponse));
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getJobTitle() != null) user.setJobTitle(request.getJobTitle());
        if (request.getDepartment() != null) user.setDepartment(request.getDepartment());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        if (request.getRoleNames() != null && !request.getRoleNames().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : request.getRoleNames()) {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        User saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Transactional
    public void changePassword(String id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String id, String deletedBy) {
        User user = userRepository.findById(id)
                .filter(u -> !u.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.softDelete(deletedBy);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream().map(role -> RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .displayName(role.getDisplayName())
                .description(role.getDescription())
                .isSystemRole(role.isSystemRole())
                .permissions(role.getPermissions().stream().map(p -> p.getName()).collect(Collectors.toSet()))
                .build()
        ).collect(Collectors.toList());
    }

    public UserResponse mapToUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .organizationId(user.getOrganizationId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .jobTitle(user.getJobTitle())
                .department(user.getDepartment())
                .status(user.getStatus())
                .lastLoginAt(user.getLastLoginAt())
                .roles(roleNames)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
