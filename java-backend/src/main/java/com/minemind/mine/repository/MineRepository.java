package com.minemind.mine.repository;

import com.minemind.mine.entity.Mine;
import com.minemind.mine.enums.MineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MineRepository extends JpaRepository<Mine, String> {

    Optional<Mine> findByCodeAndIsDeletedFalse(String code);

    boolean existsByCode(String code);

    Page<Mine> findAllByIsDeletedFalse(Pageable pageable);

    Page<Mine> findAllByOrganizationIdAndIsDeletedFalse(String organizationId, Pageable pageable);

    Page<Mine> findAllByStatusAndIsDeletedFalse(MineStatus status, Pageable pageable);

    @Query("SELECT m FROM Mine m WHERE m.isDeleted = false AND " +
            "(:keyword IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(m.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Mine> searchMines(@Param("keyword") String keyword, Pageable pageable);

    long countByIsDeletedFalse();
    long countByStatusAndIsDeletedFalse(MineStatus status);
}
