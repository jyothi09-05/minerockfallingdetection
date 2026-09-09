package com.minemind.digitaltwin;

import com.minemind.digitaltwin.dto.DigitalTwinStateDto;
import com.minemind.digitaltwin.dto.SimulationControlRequest;
import com.minemind.digitaltwin.dto.TerrainDto;
import com.minemind.digitaltwin.service.DigitalTwinService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DigitalTwinServiceTest {

    private DigitalTwinService digitalTwinService;

    @BeforeEach
    void setUp() {
        digitalTwinService = new DigitalTwinService();
    }

    @Test
    @DisplayName("Should generate terrain model with benches and waypoints")
    void testGenerateTerrain() {
        TerrainDto terrain = digitalTwinService.generateTerrain(42);

        assertThat(terrain).isNotNull();
        assertThat(terrain.getSeed()).isEqualTo(42);
        assertThat(terrain.getBenches()).hasSize(6);
        assertThat(terrain.getWaypoints()).isNotEmpty();
        assertThat(terrain.getRoads()).isNotEmpty();
        assertThat(terrain.getGeologicalLayers()).hasSize(4);
    }

    @Test
    @DisplayName("Should produce consistent simulation state snapshots")
    void testGetSnapshot() {
        DigitalTwinStateDto snapshot = digitalTwinService.getSnapshot();

        assertThat(snapshot).isNotNull();
        assertThat(snapshot.getTickIndex()).isGreaterThan(0L);
        assertThat(snapshot.getVehicles()).isNotEmpty();
        assertThat(snapshot.getWeather()).isNotNull();
        assertThat(snapshot.getSensors()).isNotEmpty();
        assertThat(snapshot.getOverallMineSafetyScore()).isBetween(0.0, 1.0);
    }

    @Test
    @DisplayName("Should alter scenario and respond to control commands")
    void testControlSimulation() {
        SimulationControlRequest req = SimulationControlRequest.builder()
                .action("PAUSE")
                .scenario("SLOPE_INSTABILITY_WARNING")
                .speedMultiplier(5.0)
                .build();

        DigitalTwinStateDto state = digitalTwinService.controlSimulation(req);

        assertThat(state.getIsRunning()).isFalse();
        assertThat(state.getScenario()).isEqualTo("SLOPE_INSTABILITY_WARNING");
        assertThat(state.getSpeedMultiplier()).isEqualTo(5.0);
    }
}
