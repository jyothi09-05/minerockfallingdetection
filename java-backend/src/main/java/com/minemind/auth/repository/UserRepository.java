package com.minemind.auth.repository;

import com.minemind.auth.entity.User;
import com.minemind.auth.enums.AccountStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsernameAndIsDeletedFalse(String username);

    Optional<User> findByEmailAndIsDeletedFalse(String email);

    @Query("SELECT u FROM User u WHERE (u.username = :identifier OR u.email = :identifier) AND u.isDeleted = false")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findAllByIsDeletedFalse(Pageable pageable);

    Page<User> findAllByOrganizationIdAndIsDeletedFalse(String organizationId, Pageable pageable);

    Page<User> findAllByStatusAndIsDeletedFalse(AccountStatus status, Pageable pageable);
}
