package com.minemind.sensor.repository;

import com.minemind.sensor.entity.Sensor;
import com.minemind.sensor.enums.SensorStatus;
import com.minemind.sensor.enums.SensorType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorRepository extends JpaRepository<Sensor, String> {

    Optional<Sensor> findBySensorCodeAndIsDeletedFalse(String sensorCode);

    boolean existsBySensorCode(String sensorCode);

    List<Sensor> findAllByMineIdAndIsDeletedFalse(String mineId);

    Page<Sensor> findAllByMineIdAndIsDeletedFalse(String mineId, Pageable pageable);

    List<Sensor> findAllByZoneIdAndIsDeletedFalse(String zoneId);

    Page<Sensor> findAllByMineIdAndTypeAndIsDeletedFalse(String mineId, SensorType type, Pageable pageable);

    Page<Sensor> findAllByMineIdAndStatusAndIsDeletedFalse(String mineId, SensorStatus status, Pageable pageable);
}
