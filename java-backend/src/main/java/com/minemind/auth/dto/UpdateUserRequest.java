package com.minemind.auth.dto;

import com.minemind.auth.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String jobTitle;
    private String department;
    private AccountStatus status;
    private Set<String> roleNames;
}
