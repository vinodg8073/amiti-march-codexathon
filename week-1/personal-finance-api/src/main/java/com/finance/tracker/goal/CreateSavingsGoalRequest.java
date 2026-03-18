package com.finance.tracker.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateSavingsGoalRequest(
        @NotBlank String name,
        @NotNull @DecimalMin("0.01") BigDecimal targetAmount,
        @NotNull LocalDate targetDate
) {
}
