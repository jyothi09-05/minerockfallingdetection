package com.minemind.mine.repository;

import com.minemind.mine.entity.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadRepository extends JpaRepository<Road, String> {
    List<Road> findAllByMineIdAndIsDeletedFalse(String mineId);
}
