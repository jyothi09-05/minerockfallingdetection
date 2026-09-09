package com.minemind.config;

import com.minemind.auth.entity.User;
import com.minemind.auth.enums.AccountStatus;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String id;
    private final String username;
    private final String email;
    private final String password;
    private final String organizationId;
    private final AccountStatus status;
    private final boolean isAccountLocked;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();
        this.organizationId = user.getOrganizationId();
        this.status = user.getStatus();
        this.isAccountLocked = user.isAccountLocked();

        Set<GrantedAuthority> auths = new HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                auths.add(new SimpleGrantedAuthority(role.getName()));
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(perm ->
                            auths.add(new SimpleGrantedAuthority(perm.getName()))
                    );
                }
            });
        }
        this.authorities = auths;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isAccountLocked && status != AccountStatus.LOCKED && status != AccountStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == AccountStatus.ACTIVE;
    }
}
