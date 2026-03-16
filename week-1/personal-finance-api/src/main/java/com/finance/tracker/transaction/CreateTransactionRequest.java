package com.finance.tracker.transaction;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateTransactionRequest(
        @NotBlank String description,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotNull TransactionType type,
        @NotNull TransactionCategory category,
        @NotNull LocalDate transactionDate,
        boolean recurring
) {
}
