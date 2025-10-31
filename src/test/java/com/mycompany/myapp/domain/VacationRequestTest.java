package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EmployeeTestSamples.*;
import static com.mycompany.myapp.domain.VacationRequestTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VacationRequestTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(VacationRequest.class);
        VacationRequest vacationRequest1 = getVacationRequestSample1();
        VacationRequest vacationRequest2 = new VacationRequest();
        assertThat(vacationRequest1).isNotEqualTo(vacationRequest2);

        vacationRequest2.setId(vacationRequest1.getId());
        assertThat(vacationRequest1).isEqualTo(vacationRequest2);

        vacationRequest2 = getVacationRequestSample2();
        assertThat(vacationRequest1).isNotEqualTo(vacationRequest2);
    }

    @Test
    void employeeTest() {
        VacationRequest vacationRequest = getVacationRequestRandomSampleGenerator();
        Employee employeeBack = getEmployeeRandomSampleGenerator();

        vacationRequest.setEmployee(employeeBack);
        assertThat(vacationRequest.getEmployee()).isEqualTo(employeeBack);

        vacationRequest.employee(null);
        assertThat(vacationRequest.getEmployee()).isNull();
    }
}
