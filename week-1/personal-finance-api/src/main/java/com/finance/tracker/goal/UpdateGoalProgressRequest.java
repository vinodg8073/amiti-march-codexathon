package com.finance.tracker.goal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateGoalProgressRequest(
        @NotNull @DecimalMin("0.01") BigDecimal contributionAmount
) {
}
