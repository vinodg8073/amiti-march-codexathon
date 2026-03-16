package com.finance.tracker.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummary(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal savingsBalance,
        BigDecimal monthlyBudget,
        BigDecimal budgetUsed,
        List<CategorySpend> categoryBreakdown,
        List<RecurringPaymentView> recurringPayments
) {
    public record CategorySpend(String category, BigDecimal amount) {
    }

    public record RecurringPaymentView(String description, BigDecimal amount, String nextDueDate) {
    }
}
