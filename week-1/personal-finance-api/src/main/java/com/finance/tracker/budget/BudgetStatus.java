package com.finance.tracker.budget;

import java.math.BigDecimal;

public record BudgetStatus(
        Long id,
        String category,
        String month,
        BigDecimal limitAmount,
        BigDecimal actualAmount,
        BigDecimal remainingAmount,
        String status
) {
}
