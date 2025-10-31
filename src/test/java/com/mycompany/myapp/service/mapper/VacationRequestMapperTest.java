package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.VacationRequestAsserts.*;
import static com.mycompany.myapp.domain.VacationRequestTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class VacationRequestMapperTest {

    private VacationRequestMapper vacationRequestMapper;

    @BeforeEach
    void setUp() {
        vacationRequestMapper = new VacationRequestMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getVacationRequestSample1();
        var actual = vacationRequestMapper.toEntity(vacationRequestMapper.toDto(expected));
        assertVacationRequestAllPropertiesEquals(expected, actual);
    }
}
