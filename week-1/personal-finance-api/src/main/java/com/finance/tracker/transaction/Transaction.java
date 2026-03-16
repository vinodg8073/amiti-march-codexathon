package com.finance.tracker.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Transaction(
        Long id,
        String description,
        BigDecimal amount,
        TransactionType type,
        TransactionCategory category,
        LocalDate transactionDate,
        boolean recurring
) {
}
