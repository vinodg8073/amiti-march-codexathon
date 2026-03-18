package com.finance.tracker.dashboard;

import com.finance.tracker.account.Account;
import com.finance.tracker.budget.BudgetStatus;
import com.finance.tracker.goal.SavingsGoal;
import com.finance.tracker.recurring.RecurringPayment;
import com.finance.tracker.transaction.Transaction;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummary(
        FinancialSnapshot snapshot,
        List<Account> accounts,
        List<BudgetStatus> budgets,
        List<CategorySpend> topSpendingCategories,
        List<TrendPoint> spendingTrends,
        List<SavingsGoal> goals,
        List<RecurringPayment> upcomingRecurringPayments,
        List<Transaction> recentTransactions
) {
    public record FinancialSnapshot(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal netSavings
    ) {
    }

    public record CategorySpend(String category, BigDecimal amount) {
    }

    public record TrendPoint(String month, BigDecimal amount) {
    }
}
