package com.minemind.mine.repository;

import com.minemind.mine.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
    Optional<Organization> findByCodeAndIsDeletedFalse(String code);
}
