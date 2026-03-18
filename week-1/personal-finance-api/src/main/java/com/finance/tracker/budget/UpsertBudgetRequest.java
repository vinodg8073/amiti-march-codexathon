package com.finance.tracker.budget;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpsertBudgetRequest(
        @NotBlank String category,
        @NotBlank String month,
        @NotNull @DecimalMin("0.01") BigDecimal limitAmount
) {
}
