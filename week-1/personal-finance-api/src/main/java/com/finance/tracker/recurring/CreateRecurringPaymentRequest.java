package com.finance.tracker.recurring;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateRecurringPaymentRequest(
        @NotBlank String name,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotBlank String category,
        @NotNull Long accountId,
        @NotNull RecurringFrequency frequency,
        @NotNull LocalDate nextDueDate
) {
}
