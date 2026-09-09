package com.minemind.auth.dto;

import com.minemind.auth.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String organizationId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String jobTitle;
    private String department;
    private AccountStatus status;
    private Instant lastLoginAt;
    private Set<String> roles;
    private Instant createdAt;
    private Instant updatedAt;
}
