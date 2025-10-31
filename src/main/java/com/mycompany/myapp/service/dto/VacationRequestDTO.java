package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.enumeration.VacationStatus;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.VacationRequest} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class VacationRequestDTO implements Serializable {

    private Long id;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    private Integer requestedDays;

    @NotNull
    private VacationStatus status;

    @Size(max = 500)
    private String approverComment;

    private LocalDate approvedStartDate;

    private LocalDate approvedEndDate;

    private Integer approvedDays;

    @NotNull
    private Instant createdAt;

    private Instant decidedAt;

    @NotNull
    private EmployeeDTO employee;

    private UserDTO approver;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getRequestedDays() {
        return requestedDays;
    }

    public void setRequestedDays(Integer requestedDays) {
        this.requestedDays = requestedDays;
    }

    public VacationStatus getStatus() {
        return status;
    }

    public void setStatus(VacationStatus status) {
        this.status = status;
    }

    public String getApproverComment() {
        return approverComment;
    }

    public void setApproverComment(String approverComment) {
        this.approverComment = approverComment;
    }

    public LocalDate getApprovedStartDate() {
        return approvedStartDate;
    }

    public void setApprovedStartDate(LocalDate approvedStartDate) {
        this.approvedStartDate = approvedStartDate;
    }

    public LocalDate getApprovedEndDate() {
        return approvedEndDate;
    }

    public void setApprovedEndDate(LocalDate approvedEndDate) {
        this.approvedEndDate = approvedEndDate;
    }

    public Integer getApprovedDays() {
        return approvedDays;
    }

    public void setApprovedDays(Integer approvedDays) {
        this.approvedDays = approvedDays;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getDecidedAt() {
        return decidedAt;
    }

    public void setDecidedAt(Instant decidedAt) {
        this.decidedAt = decidedAt;
    }

    public EmployeeDTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDTO employee) {
        this.employee = employee;
    }

    public UserDTO getApprover() {
        return approver;
    }

    public void setApprover(UserDTO approver) {
        this.approver = approver;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof VacationRequestDTO)) {
            return false;
        }

        VacationRequestDTO vacationRequestDTO = (VacationRequestDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, vacationRequestDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "VacationRequestDTO{" +
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
            ", employee=" + getEmployee() +
            ", approver=" + getApprover() +
            "}";
    }
}
