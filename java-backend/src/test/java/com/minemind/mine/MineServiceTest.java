package com.minemind.mine;

import com.minemind.mine.dto.MineCreateRequest;
import com.minemind.mine.dto.MineResponse;
import com.minemind.mine.entity.Mine;
import com.minemind.mine.enums.CommodityType;
import com.minemind.mine.enums.MineStatus;
import com.minemind.mine.enums.MineType;
import com.minemind.mine.repository.MineRepository;
import com.minemind.mine.repository.ZoneRepository;
import com.minemind.mine.service.MineService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MineServiceTest {

    @Mock
    private MineRepository mineRepository;

    @Mock
    private ZoneRepository zoneRepository;

    @InjectMocks
    private MineService mineService;

    @Test
    void testCreateMine_Success() {
        MineCreateRequest request = MineCreateRequest.builder()
                .organizationId("org-123")
                .name("Prometheus Pit")
                .code("PROM-01")
                .type(MineType.OPEN_PIT)
                .commodity(CommodityType.COPPER)
                .latitude(-21.45)
                .longitude(119.82)
                .country("Australia")
                .build();

        Mine mockMine = Mine.builder()
                .organizationId("org-123")
                .name("Prometheus Pit")
                .code("PROM-01")
                .type(MineType.OPEN_PIT)
                .commodity(CommodityType.COPPER)
                .latitude(-21.45)
                .longitude(119.82)
                .country("Australia")
                .status(MineStatus.ACTIVE)
                .build();
        mockMine.setId("mine-123");

        when(mineRepository.existsByCode("PROM-01")).thenReturn(false);
        when(mineRepository.save(any(Mine.class))).thenReturn(mockMine);
        when(zoneRepository.countByMineIdAndIsDeletedFalse("mine-123")).thenReturn(0L);

        MineResponse response = mineService.createMine(request, "user-admin");

        assertNotNull(response);
        assertEquals("Prometheus Pit", response.getName());
        assertEquals("PROM-01", response.getCode());
        verify(mineRepository, times(1)).save(any(Mine.class));
    }
}
