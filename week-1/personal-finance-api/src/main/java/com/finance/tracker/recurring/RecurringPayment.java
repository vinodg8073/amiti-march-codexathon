package com.finance.tracker.recurring;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RecurringPayment(
        Long id,
        String name,
        BigDecimal amount,
        String category,
        Long accountId,
        String accountName,
        RecurringFrequency frequency,
        LocalDate nextDueDate
) {
}
