package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.VacationRequest;
import com.mycompany.myapp.domain.enumeration.VacationStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the VacationRequest entity.
 */
@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    @Query("select vacationRequest from VacationRequest vacationRequest where vacationRequest.approver.login = ?#{authentication.name}")
    List<VacationRequest> findByApproverIsCurrentUser();

    default Optional<VacationRequest> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<VacationRequest> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<VacationRequest> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select vacationRequest from VacationRequest vacationRequest left join fetch vacationRequest.approver",
        countQuery = "select count(vacationRequest) from VacationRequest vacationRequest"
    )
    Page<VacationRequest> findAllWithToOneRelationships(Pageable pageable);

    @Query("select vacationRequest from VacationRequest vacationRequest left join fetch vacationRequest.approver")
    List<VacationRequest> findAllWithToOneRelationships();

    @Query(
        "select vacationRequest from VacationRequest vacationRequest left join fetch vacationRequest.approver where vacationRequest.id =:id"
    )
    Optional<VacationRequest> findOneWithToOneRelationships(@Param("id") Long id);

    Page<VacationRequest> findByEmployeeUserLogin(String login, Pageable pageable);

    Page<VacationRequest> findByStatus(VacationStatus status, Pageable pageable);
}
