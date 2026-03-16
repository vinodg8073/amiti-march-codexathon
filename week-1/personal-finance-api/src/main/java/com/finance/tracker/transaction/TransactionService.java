package com.finance.tracker.transaction;

import com.finance.tracker.dashboard.DashboardSummary;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TransactionService {
    private final List<Transaction> transactions = new ArrayList<>();
    private final AtomicLong idSequence = new AtomicLong(1);

    public TransactionService() {
        seedSampleData();
    }

    public List<Transaction> findAll() {
        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::transactionDate).reversed())
                .toList();
    }

    public Transaction create(CreateTransactionRequest request) {
        Transaction transaction = new Transaction(
                idSequence.getAndIncrement(),
                request.description(),
                request.amount(),
                request.type(),
                request.category(),
                request.transactionDate(),
                request.recurring()
        );
        transactions.add(transaction);
        return transaction;
    }

    public DashboardSummary buildDashboardSummary() {
        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;
        Map<TransactionCategory, BigDecimal> categorySpend = new EnumMap<>(TransactionCategory.class);
        List<DashboardSummary.RecurringPaymentView> recurringPayments = new ArrayList<>();

        for (Transaction transaction : transactions) {
            if (transaction.type() == TransactionType.INCOME) {
                income = income.add(transaction.amount());
            } else {
                expenses = expenses.add(transaction.amount());
                categorySpend.merge(transaction.category(), transaction.amount(), BigDecimal::add);
            }

            if (transaction.recurring()) {
                recurringPayments.add(new DashboardSummary.RecurringPaymentView(
                        transaction.description(),
                        transaction.amount(),
                        transaction.transactionDate().plusMonths(1).toString()
                ));
            }
        }

        List<DashboardSummary.CategorySpend> categoryBreakdown = categorySpend.entrySet().stream()
                .map(entry -> new DashboardSummary.CategorySpend(entry.getKey().name(), entry.getValue()))
                .sorted(Comparator.comparing(DashboardSummary.CategorySpend::amount).reversed())
                .toList();

        BigDecimal monthlyBudget = new BigDecimal("5000.00");
        return new DashboardSummary(
                income,
                expenses,
                income.subtract(expenses),
                monthlyBudget,
                expenses,
                categoryBreakdown,
                recurringPayments
        );
    }

    private void seedSampleData() {
        create(new CreateTransactionRequest(
                "Monthly salary",
                new BigDecimal("7200.00"),
                TransactionType.INCOME,
                TransactionCategory.SALARY,
                LocalDate.now().minusDays(10),
                true
        ));
        create(new CreateTransactionRequest(
                "Rent",
                new BigDecimal("1900.00"),
                TransactionType.EXPENSE,
                TransactionCategory.HOUSING,
                LocalDate.now().minusDays(7),
                true
        ));
        create(new CreateTransactionRequest(
                "Groceries",
                new BigDecimal("240.50"),
                TransactionType.EXPENSE,
                TransactionCategory.FOOD,
                LocalDate.now().minusDays(3),
                false
        ));
        create(new CreateTransactionRequest(
                "Freelance invoice",
                new BigDecimal("850.00"),
                TransactionType.INCOME,
                TransactionCategory.FREELANCE,
                LocalDate.now().minusDays(1),
                false
        ));
    }
}
