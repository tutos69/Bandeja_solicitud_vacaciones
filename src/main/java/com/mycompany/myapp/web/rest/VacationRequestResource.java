package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.enumeration.VacationStatus;
import com.mycompany.myapp.repository.VacationRequestRepository;
import com.mycompany.myapp.security.SecurityUtils;
import com.mycompany.myapp.service.VacationRequestService;
import com.mycompany.myapp.service.dto.ApprovalCommand;
import com.mycompany.myapp.service.dto.VacationRequestDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.VacationRequest}.
 */
@RestController
@RequestMapping("/api/vacation-requests")
public class VacationRequestResource {

    private static final Logger LOG = LoggerFactory.getLogger(VacationRequestResource.class);

    private static final String ENTITY_NAME = "vacationRequest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VacationRequestService vacationRequestService;

    private final VacationRequestRepository vacationRequestRepository;

    public VacationRequestResource(VacationRequestService vacationRequestService, VacationRequestRepository vacationRequestRepository) {
        this.vacationRequestService = vacationRequestService;
        this.vacationRequestRepository = vacationRequestRepository;
    }

    /**
     * {@code POST  /vacation-requests} : Create a new vacationRequest.
     *
     * @param vacationRequestDTO the vacationRequestDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vacationRequestDTO, or with status {@code 400 (Bad Request)} if the vacationRequest has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<VacationRequestDTO> createVacationRequest(@Valid @RequestBody VacationRequestDTO vacationRequestDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save VacationRequest : {}", vacationRequestDTO);
        if (vacationRequestDTO.getId() != null) {
            throw new BadRequestAlertException("A new vacationRequest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        vacationRequestDTO = vacationRequestService.save(vacationRequestDTO);
        return ResponseEntity.created(new URI("/api/vacation-requests/" + vacationRequestDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, vacationRequestDTO.getId().toString()))
            .body(vacationRequestDTO);
    }

    /**
     * {@code PUT  /vacation-requests/:id} : Updates an existing vacationRequest.
     *
     * @param id the id of the vacationRequestDTO to save.
     * @param vacationRequestDTO the vacationRequestDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacationRequestDTO,
     * or with status {@code 400 (Bad Request)} if the vacationRequestDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vacationRequestDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<VacationRequestDTO> updateVacationRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody VacationRequestDTO vacationRequestDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update VacationRequest : {}, {}", id, vacationRequestDTO);
        if (vacationRequestDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacationRequestDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacationRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        vacationRequestDTO = vacationRequestService.update(vacationRequestDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacationRequestDTO.getId().toString()))
            .body(vacationRequestDTO);
    }

    /**
     * {@code PATCH  /vacation-requests/:id} : Partial updates given fields of an existing vacationRequest, field will ignore if it is null
     *
     * @param id the id of the vacationRequestDTO to save.
     * @param vacationRequestDTO the vacationRequestDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vacationRequestDTO,
     * or with status {@code 400 (Bad Request)} if the vacationRequestDTO is not valid,
     * or with status {@code 404 (Not Found)} if the vacationRequestDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the vacationRequestDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<VacationRequestDTO> partialUpdateVacationRequest(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody VacationRequestDTO vacationRequestDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update VacationRequest partially : {}, {}", id, vacationRequestDTO);
        if (vacationRequestDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vacationRequestDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vacationRequestRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<VacationRequestDTO> result = vacationRequestService.partialUpdate(vacationRequestDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vacationRequestDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /vacation-requests} : get all the vacationRequests.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vacationRequests in body.
     */
    @GetMapping("")
    public List<VacationRequestDTO> getAllVacationRequests(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all VacationRequests");
        return vacationRequestService.findAll();
    }

    /**
     * {@code GET  /vacation-requests/:id} : get the "id" vacationRequest.
     *
     * @param id the id of the vacationRequestDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vacationRequestDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VacationRequestDTO> getVacationRequest(@PathVariable("id") Long id) {
        LOG.debug("REST request to get VacationRequest : {}", id);
        Optional<VacationRequestDTO> vacationRequestDTO = vacationRequestService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vacationRequestDTO);
    }

    /**
     * {@code DELETE  /vacation-requests/:id} : delete the "id" vacationRequest.
     *
     * @param id the id of the vacationRequestDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVacationRequest(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete VacationRequest : {}", id);
        vacationRequestService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    // 1) Crear solicitud (empleado)
    @PostMapping("/vacation-requests")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<VacationRequestDTO> create(@RequestBody VacationRequestDTO dto) {
        var login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        var saved = vacationRequestService.createForCurrentUser(dto, login); // asigna employee, valida 0/10/20
        return ResponseEntity.ok(saved);
    }

    // 2) Listar MIS solicitudes (empleado)
    @GetMapping("/vacation-requests/mine")
    @PreAuthorize("hasRole('ROLE_USER')")
    public Page<VacationRequestDTO> myRequests(@ParameterObject Pageable pageable) {
        var login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        return vacationRequestService.findByEmployeeLogin(login, pageable);
    }

    // 3) Listar TODAS para revisión (RH)
    @GetMapping("/vacation-requests/review")
    @PreAuthorize("hasRole('ROLE_HR')")
    public Page<VacationRequestDTO> toReview(@RequestParam Optional<VacationStatus> status, @ParameterObject Pageable pageable) {
        return vacationRequestService.findForReview(status, pageable);
    }

    // 4) Aprobar / modificar / negar (RH)
    @PostMapping("/vacation-requests/{id}/decision")
    @PreAuthorize("hasRole('ROLE_HR')")
    public ResponseEntity<VacationRequestDTO> decide(@PathVariable Long id, @RequestBody ApprovalCommand cmd) {
        var login = SecurityUtils.getCurrentUserLogin().orElseThrow();
        var updated = vacationRequestService.decide(id, cmd, login);
        return ResponseEntity.ok(updated);
    }
}
