package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VacationRequestDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(VacationRequestDTO.class);
        VacationRequestDTO vacationRequestDTO1 = new VacationRequestDTO();
        vacationRequestDTO1.setId(1L);
        VacationRequestDTO vacationRequestDTO2 = new VacationRequestDTO();
        assertThat(vacationRequestDTO1).isNotEqualTo(vacationRequestDTO2);
        vacationRequestDTO2.setId(vacationRequestDTO1.getId());
        assertThat(vacationRequestDTO1).isEqualTo(vacationRequestDTO2);
        vacationRequestDTO2.setId(2L);
        assertThat(vacationRequestDTO1).isNotEqualTo(vacationRequestDTO2);
        vacationRequestDTO1.setId(null);
        assertThat(vacationRequestDTO1).isNotEqualTo(vacationRequestDTO2);
    }
}
