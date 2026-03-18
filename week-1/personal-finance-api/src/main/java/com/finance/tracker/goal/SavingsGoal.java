package com.finance.tracker.goal;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SavingsGoal(
        Long id,
        String name,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        LocalDate targetDate
) {
}
