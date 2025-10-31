package com.mycompany.myapp.service.dto;

import java.time.LocalDate;

public record ApprovalCommand(
    String action, // APPROVE | APPROVE_WITH_CHANGES | REJECT
    LocalDate approvedStartDate,
    LocalDate approvedEndDate,
    Integer approvedDays,
    String approverComment
) {}
