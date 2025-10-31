package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.VacationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A VacationRequest.
 */
@Entity
@Table(name = "vacation_request")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VacationRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull
    @Column(name = "requested_days", nullable = false)
    private Integer requestedDays;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VacationStatus status;

    @Size(max = 500)
    @Column(name = "approver_comment", length = 500)
    private String approverComment;

    @Column(name = "approved_start_date")
    private LocalDate approvedStartDate;

    @Column(name = "approved_end_date")
    private LocalDate approvedEndDate;

    @Column(name = "approved_days")
    private Integer approvedDays;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "decided_at")
    private Instant decidedAt;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    private User approver;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public VacationRequest id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public VacationRequest startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public VacationRequest endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getRequestedDays() {
        return this.requestedDays;
    }

    public VacationRequest requestedDays(Integer requestedDays) {
        this.setRequestedDays(requestedDays);
        return this;
    }

    public void setRequestedDays(Integer requestedDays) {
        this.requestedDays = requestedDays;
    }

    public VacationStatus getStatus() {
        return this.status;
    }

    public VacationRequest status(VacationStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(VacationStatus status) {
        this.status = status;
    }

    public String getApproverComment() {
        return this.approverComment;
    }

    public VacationRequest approverComment(String approverComment) {
        this.setApproverComment(approverComment);
        return this;
    }

    public void setApproverComment(String approverComment) {
        this.approverComment = approverComment;
    }

    public LocalDate getApprovedStartDate() {
        return this.approvedStartDate;
    }

    public VacationRequest approvedStartDate(LocalDate approvedStartDate) {
        this.setApprovedStartDate(approvedStartDate);
        return this;
    }

    public void setApprovedStartDate(LocalDate approvedStartDate) {
        this.approvedStartDate = approvedStartDate;
    }

    public LocalDate getApprovedEndDate() {
        return this.approvedEndDate;
    }

    public VacationRequest approvedEndDate(LocalDate approvedEndDate) {
        this.setApprovedEndDate(approvedEndDate);
        return this;
    }

    public void setApprovedEndDate(LocalDate approvedEndDate) {
        this.approvedEndDate = approvedEndDate;
    }

    public Integer getApprovedDays() {
        return this.approvedDays;
    }

    public VacationRequest approvedDays(Integer approvedDays) {
        this.setApprovedDays(approvedDays);
        return this;
    }

    public void setApprovedDays(Integer approvedDays) {
        this.approvedDays = approvedDays;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public VacationRequest createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getDecidedAt() {
        return this.decidedAt;
    }

    public VacationRequest decidedAt(Instant decidedAt) {
        this.setDecidedAt(decidedAt);
        return this;
    }

    public void setDecidedAt(Instant decidedAt) {
        this.decidedAt = decidedAt;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public VacationRequest employee(Employee employee) {
        this.setEmployee(employee);
        return this;
    }

    public User getApprover() {
        return this.approver;
    }

    public void setApprover(User user) {
        this.approver = user;
    }

    public VacationRequest approver(User user) {
        this.setApprover(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VacationRequest)) {
            return false;
        }
        return getId() != null && getId().equals(((VacationRequest) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VacationRequest{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", requestedDays=" + getRequestedDays() +
            ", status='" + getStatus() + "'" +
            ", approverComment='" + getApproverComment() + "'" +
            ", approvedStartDate='" + getApprovedStartDate() + "'" +
            ", approvedEndDate='" + getApprovedEndDate() + "'" +
            ", approvedDays=" + getApprovedDays() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", decidedAt='" + getDecidedAt() + "'" +
            "}";
    }
}
