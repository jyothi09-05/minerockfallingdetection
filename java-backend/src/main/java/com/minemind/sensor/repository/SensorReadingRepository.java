package com.minemind.sensor.repository;

import com.minemind.sensor.entity.SensorReading;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, String> {
    List<SensorReading> findTop100BySensorIdOrderByTimestampDesc(String sensorId);
    Page<SensorReading> findAllBySensorId(String sensorId, Pageable pageable);
}
