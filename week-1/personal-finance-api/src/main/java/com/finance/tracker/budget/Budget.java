package com.finance.tracker.budget;

import java.math.BigDecimal;

public record Budget(
        Long id,
        String category,
        String month,
        BigDecimal limitAmount
) {
}
