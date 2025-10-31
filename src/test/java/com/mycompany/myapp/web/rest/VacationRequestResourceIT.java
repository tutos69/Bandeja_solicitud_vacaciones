package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.VacationRequestAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Employee;
import com.mycompany.myapp.domain.VacationRequest;
import com.mycompany.myapp.domain.enumeration.VacationStatus;
import com.mycompany.myapp.repository.UserRepository;
import com.mycompany.myapp.repository.VacationRequestRepository;
import com.mycompany.myapp.service.VacationRequestService;
import com.mycompany.myapp.service.dto.VacationRequestDTO;
import com.mycompany.myapp.service.mapper.VacationRequestMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VacationRequestResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class VacationRequestResourceIT {

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_REQUESTED_DAYS = 1;
    private static final Integer UPDATED_REQUESTED_DAYS = 2;

    private static final VacationStatus DEFAULT_STATUS = VacationStatus.PENDING;
    private static final VacationStatus UPDATED_STATUS = VacationStatus.APPROVED;

    private static final String DEFAULT_APPROVER_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_APPROVER_COMMENT = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_APPROVED_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_APPROVED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_APPROVED_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_APPROVED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_APPROVED_DAYS = 1;
    private static final Integer UPDATED_APPROVED_DAYS = 2;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DECIDED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DECIDED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/vacation-requests";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private VacationRequestRepository vacationRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private VacationRequestRepository vacationRequestRepositoryMock;

    @Autowired
    private VacationRequestMapper vacationRequestMapper;

    @Mock
    private VacationRequestService vacationRequestServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVacationRequestMockMvc;

    private VacationRequest vacationRequest;

    private VacationRequest insertedVacationRequest;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VacationRequest createEntity(EntityManager em) {
        VacationRequest vacationRequest = new VacationRequest()
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .requestedDays(DEFAULT_REQUESTED_DAYS)
            .status(DEFAULT_STATUS)
            .approverComment(DEFAULT_APPROVER_COMMENT)
            .approvedStartDate(DEFAULT_APPROVED_START_DATE)
            .approvedEndDate(DEFAULT_APPROVED_END_DATE)
            .approvedDays(DEFAULT_APPROVED_DAYS)
            .createdAt(DEFAULT_CREATED_AT)
            .decidedAt(DEFAULT_DECIDED_AT);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        vacationRequest.setEmployee(employee);
        return vacationRequest;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static VacationRequest createUpdatedEntity(EntityManager em) {
        VacationRequest updatedVacationRequest = new VacationRequest()
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .requestedDays(UPDATED_REQUESTED_DAYS)
            .status(UPDATED_STATUS)
            .approverComment(UPDATED_APPROVER_COMMENT)
            .approvedStartDate(UPDATED_APPROVED_START_DATE)
            .approvedEndDate(UPDATED_APPROVED_END_DATE)
            .approvedDays(UPDATED_APPROVED_DAYS)
            .createdAt(UPDATED_CREATED_AT)
            .decidedAt(UPDATED_DECIDED_AT);
        // Add required entity
        Employee employee;
        if (TestUtil.findAll(em, Employee.class).isEmpty()) {
            employee = EmployeeResourceIT.createUpdatedEntity(em);
            em.persist(employee);
            em.flush();
        } else {
            employee = TestUtil.findAll(em, Employee.class).get(0);
        }
        updatedVacationRequest.setEmployee(employee);
        return updatedVacationRequest;
    }

    @BeforeEach
    void initTest() {
        vacationRequest = createEntity(em);
    }

    @AfterEach
    void cleanup() {
        if (insertedVacationRequest != null) {
            vacationRequestRepository.delete(insertedVacationRequest);
            insertedVacationRequest = null;
        }
    }

    @Test
    @Transactional
    void createVacationRequest() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);
        var returnedVacationRequestDTO = om.readValue(
            restVacationRequestMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            VacationRequestDTO.class
        );

        // Validate the VacationRequest in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedVacationRequest = vacationRequestMapper.toEntity(returnedVacationRequestDTO);
        assertVacationRequestUpdatableFieldsEquals(returnedVacationRequest, getPersistedVacationRequest(returnedVacationRequest));

        insertedVacationRequest = returnedVacationRequest;
    }

    @Test
    @Transactional
    void createVacationRequestWithExistingId() throws Exception {
        // Create the VacationRequest with an existing ID
        vacationRequest.setId(1L);
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vacationRequest.setStartDate(null);

        // Create the VacationRequest, which fails.
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vacationRequest.setEndDate(null);

        // Create the VacationRequest, which fails.
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRequestedDaysIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vacationRequest.setRequestedDays(null);

        // Create the VacationRequest, which fails.
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vacationRequest.setStatus(null);

        // Create the VacationRequest, which fails.
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCreatedAtIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        vacationRequest.setCreatedAt(null);

        // Create the VacationRequest, which fails.
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        restVacationRequestMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVacationRequests() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        // Get all the vacationRequestList
        restVacationRequestMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vacationRequest.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].requestedDays").value(hasItem(DEFAULT_REQUESTED_DAYS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].approverComment").value(hasItem(DEFAULT_APPROVER_COMMENT)))
            .andExpect(jsonPath("$.[*].approvedStartDate").value(hasItem(DEFAULT_APPROVED_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].approvedEndDate").value(hasItem(DEFAULT_APPROVED_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].approvedDays").value(hasItem(DEFAULT_APPROVED_DAYS)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].decidedAt").value(hasItem(DEFAULT_DECIDED_AT.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacationRequestsWithEagerRelationshipsIsEnabled() throws Exception {
        when(vacationRequestServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacationRequestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(vacationRequestServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllVacationRequestsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(vacationRequestServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restVacationRequestMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(vacationRequestRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getVacationRequest() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        // Get the vacationRequest
        restVacationRequestMockMvc
            .perform(get(ENTITY_API_URL_ID, vacationRequest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vacationRequest.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.requestedDays").value(DEFAULT_REQUESTED_DAYS))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.approverComment").value(DEFAULT_APPROVER_COMMENT))
            .andExpect(jsonPath("$.approvedStartDate").value(DEFAULT_APPROVED_START_DATE.toString()))
            .andExpect(jsonPath("$.approvedEndDate").value(DEFAULT_APPROVED_END_DATE.toString()))
            .andExpect(jsonPath("$.approvedDays").value(DEFAULT_APPROVED_DAYS))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.decidedAt").value(DEFAULT_DECIDED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingVacationRequest() throws Exception {
        // Get the vacationRequest
        restVacationRequestMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVacationRequest() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vacationRequest
        VacationRequest updatedVacationRequest = vacationRequestRepository.findById(vacationRequest.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVacationRequest are not directly saved in db
        em.detach(updatedVacationRequest);
        updatedVacationRequest
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .requestedDays(UPDATED_REQUESTED_DAYS)
            .status(UPDATED_STATUS)
            .approverComment(UPDATED_APPROVER_COMMENT)
            .approvedStartDate(UPDATED_APPROVED_START_DATE)
            .approvedEndDate(UPDATED_APPROVED_END_DATE)
            .approvedDays(UPDATED_APPROVED_DAYS)
            .createdAt(UPDATED_CREATED_AT)
            .decidedAt(UPDATED_DECIDED_AT);
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(updatedVacationRequest);

        restVacationRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacationRequestDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vacationRequestDTO))
            )
            .andExpect(status().isOk());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedVacationRequestToMatchAllProperties(updatedVacationRequest);
    }

    @Test
    @Transactional
    void putNonExistingVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vacationRequestDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vacationRequestDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(vacationRequestDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVacationRequestWithPatch() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vacationRequest using partial update
        VacationRequest partialUpdatedVacationRequest = new VacationRequest();
        partialUpdatedVacationRequest.setId(vacationRequest.getId());

        partialUpdatedVacationRequest
            .startDate(UPDATED_START_DATE)
            .status(UPDATED_STATUS)
            .approvedStartDate(UPDATED_APPROVED_START_DATE)
            .createdAt(UPDATED_CREATED_AT)
            .decidedAt(UPDATED_DECIDED_AT);

        restVacationRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacationRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVacationRequest))
            )
            .andExpect(status().isOk());

        // Validate the VacationRequest in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVacationRequestUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedVacationRequest, vacationRequest),
            getPersistedVacationRequest(vacationRequest)
        );
    }

    @Test
    @Transactional
    void fullUpdateVacationRequestWithPatch() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the vacationRequest using partial update
        VacationRequest partialUpdatedVacationRequest = new VacationRequest();
        partialUpdatedVacationRequest.setId(vacationRequest.getId());

        partialUpdatedVacationRequest
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .requestedDays(UPDATED_REQUESTED_DAYS)
            .status(UPDATED_STATUS)
            .approverComment(UPDATED_APPROVER_COMMENT)
            .approvedStartDate(UPDATED_APPROVED_START_DATE)
            .approvedEndDate(UPDATED_APPROVED_END_DATE)
            .approvedDays(UPDATED_APPROVED_DAYS)
            .createdAt(UPDATED_CREATED_AT)
            .decidedAt(UPDATED_DECIDED_AT);

        restVacationRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVacationRequest.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedVacationRequest))
            )
            .andExpect(status().isOk());

        // Validate the VacationRequest in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertVacationRequestUpdatableFieldsEquals(
            partialUpdatedVacationRequest,
            getPersistedVacationRequest(partialUpdatedVacationRequest)
        );
    }

    @Test
    @Transactional
    void patchNonExistingVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vacationRequestDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vacationRequestDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(vacationRequestDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVacationRequest() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        vacationRequest.setId(longCount.incrementAndGet());

        // Create the VacationRequest
        VacationRequestDTO vacationRequestDTO = vacationRequestMapper.toDto(vacationRequest);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVacationRequestMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(vacationRequestDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the VacationRequest in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVacationRequest() throws Exception {
        // Initialize the database
        insertedVacationRequest = vacationRequestRepository.saveAndFlush(vacationRequest);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the vacationRequest
        restVacationRequestMockMvc
            .perform(delete(ENTITY_API_URL_ID, vacationRequest.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return vacationRequestRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected VacationRequest getPersistedVacationRequest(VacationRequest vacationRequest) {
        return vacationRequestRepository.findById(vacationRequest.getId()).orElseThrow();
    }

    protected void assertPersistedVacationRequestToMatchAllProperties(VacationRequest expectedVacationRequest) {
        assertVacationRequestAllPropertiesEquals(expectedVacationRequest, getPersistedVacationRequest(expectedVacationRequest));
    }

    protected void assertPersistedVacationRequestToMatchUpdatableProperties(VacationRequest expectedVacationRequest) {
        assertVacationRequestAllUpdatablePropertiesEquals(expectedVacationRequest, getPersistedVacationRequest(expectedVacationRequest));
    }
}
