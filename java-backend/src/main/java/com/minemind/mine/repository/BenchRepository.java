package com.minemind.mine.repository;

import com.minemind.mine.entity.Bench;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenchRepository extends JpaRepository<Bench, String> {
    List<Bench> findAllByZoneIdAndIsDeletedFalseOrderByBenchNumberDesc(String zoneId);
}
