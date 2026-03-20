package com.finance.tracker.finance;

import com.finance.tracker.account.Account;
import com.finance.tracker.account.AccountType;
import com.finance.tracker.account.CreateAccountRequest;
import com.finance.tracker.auth.AuthModels.AuthResponse;
import com.finance.tracker.auth.AuthModels.LoginRequest;
import com.finance.tracker.auth.AuthModels.RefreshTokenRequest;
import com.finance.tracker.auth.AuthModels.SignupRequest;
import com.finance.tracker.auth.AuthModels.UserView;
import com.finance.tracker.auth.JwtTokenService;
import com.finance.tracker.budget.Budget;
import com.finance.tracker.budget.BudgetStatus;
import com.finance.tracker.budget.UpsertBudgetRequest;
import com.finance.tracker.common.UnauthorizedException;
import com.finance.tracker.dashboard.DashboardSummary;
import com.finance.tracker.goal.CreateSavingsGoalRequest;
import com.finance.tracker.goal.SavingsGoal;
import com.finance.tracker.goal.UpdateGoalProgressRequest;
import com.finance.tracker.recurring.CreateRecurringPaymentRequest;
import com.finance.tracker.recurring.RecurringFrequency;
import com.finance.tracker.recurring.RecurringPayment;
import com.finance.tracker.transaction.CreateTransactionRequest;
import com.finance.tracker.transaction.Transaction;
import com.finance.tracker.transaction.TransactionType;
import com.finance.tracker.transaction.UpdateTransactionRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class FinanceWorkspaceService {
    private final AtomicLong userIdSequence = new AtomicLong(1);
    private final Map<String, UserRecord> usersByEmail = new HashMap<>();
    private final Map<Long, UserRecord> usersById = new HashMap<>();
    private final Map<String, Long> refreshTokensByToken = new HashMap<>();
    private final Map<Long, UserWorkspace> workspacesByUserId = new HashMap<>();
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public FinanceWorkspaceService(PasswordEncoder passwordEncoder, JwtTokenService jwtTokenService) {
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public synchronized AuthResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (usersByEmail.containsKey(email)) {
            throw new IllegalArgumentException("An account already exists for that email.");
        }

        long userId = userIdSequence.getAndIncrement();
        UserRecord userRecord = new UserRecord(
                userId,
                email,
                passwordEncoder.encode(request.password()),
                request.displayName().trim()
        );
        usersByEmail.put(email, userRecord);
        usersById.put(userId, userRecord);
        workspacesByUserId.put(userId, seedWorkspace());

        return issueAuthResponse(userRecord, true);
    }

    public synchronized AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        UserRecord userRecord = usersByEmail.get(email);
        if (userRecord == null || !passwordEncoder.matches(request.password(), userRecord.passwordHash())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return issueAuthResponse(userRecord, true);
    }

    public synchronized AuthResponse refresh(RefreshTokenRequest request) {
        JwtTokenService.TokenClaims claims = jwtTokenService.parseRefreshToken(request.refreshToken());
        Long userId = refreshTokensByToken.get(request.refreshToken());
        if (userId == null || !userId.equals(claims.userId())) {
            throw new UnauthorizedException("Refresh token is invalid or expired.");
        }

        refreshTokensByToken.remove(request.refreshToken());
        UserRecord userRecord = findUserById(claims.userId());
        return issueAuthResponse(userRecord, true);
    }

    public synchronized AuthResponse getSession(String authorizationHeader) {
        UserRecord userRecord = requireUser(authorizationHeader);
        String token = extractBearerToken(authorizationHeader);
        return new AuthResponse(token, null, toUserView(userRecord));
    }

    public synchronized List<Account> getAccounts(String authorizationHeader) {
        return List.copyOf(workspaceFor(authorizationHeader).accounts);
    }

    public synchronized Account createAccount(String authorizationHeader, CreateAccountRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        Account account = new Account(workspace.accountIdSequence.getAndIncrement(), request.name(), request.type());
        workspace.accounts.add(account);
        return account;
    }

    public synchronized List<Transaction> getTransactions(String authorizationHeader) {
        return workspaceFor(authorizationHeader).transactions.stream()
                .sorted(Comparator.comparing(Transaction::transactionDate).reversed())
                .toList();
    }

    public synchronized Transaction createTransaction(String authorizationHeader, CreateTransactionRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        Account account = findAccount(workspace, request.accountId());
        Transaction transaction = new Transaction(
                workspace.transactionIdSequence.getAndIncrement(),
                request.description(),
                request.amount(),
                request.type(),
                request.category(),
                account.id(),
                account.name(),
                request.transactionDate(),
                request.recurring()
        );
        workspace.transactions.add(transaction);
        return transaction;
    }

    public synchronized Transaction updateTransaction(String authorizationHeader, Long transactionId, UpdateTransactionRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        Account account = findAccount(workspace, request.accountId());

        for (int index = 0; index < workspace.transactions.size(); index++) {
            Transaction current = workspace.transactions.get(index);
            if (current.id().equals(transactionId)) {
                Transaction updated = new Transaction(
                        current.id(),
                        request.description(),
                        request.amount(),
                        request.type(),
                        request.category(),
                        account.id(),
                        account.name(),
                        request.transactionDate(),
                        request.recurring()
                );
                workspace.transactions.set(index, updated);
                return updated;
            }
        }

        throw new IllegalArgumentException("Transaction not found.");
    }

    public synchronized void deleteTransaction(String authorizationHeader, Long transactionId) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        boolean removed = workspace.transactions.removeIf(transaction -> transaction.id().equals(transactionId));
        if (!removed) {
            throw new IllegalArgumentException("Transaction not found.");
        }
    }

    public synchronized List<BudgetStatus> getBudgets(String authorizationHeader, String month) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        String monthValue = month == null || month.isBlank() ? YearMonth.now().toString() : month;
        return buildBudgetStatuses(workspace, monthValue);
    }

    public synchronized BudgetStatus upsertBudget(String authorizationHeader, UpsertBudgetRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);

        for (int index = 0; index < workspace.budgets.size(); index++) {
            Budget budget = workspace.budgets.get(index);
            if (budget.category().equalsIgnoreCase(request.category()) && budget.month().equals(request.month())) {
                Budget updated = new Budget(budget.id(), request.category(), request.month(), request.limitAmount());
                workspace.budgets.set(index, updated);
                return toBudgetStatus(updated, calculateSpentForCategory(workspace, request.category(), request.month()));
            }
        }

        Budget budget = new Budget(workspace.budgetIdSequence.getAndIncrement(), request.category(), request.month(), request.limitAmount());
        workspace.budgets.add(budget);
        return toBudgetStatus(budget, calculateSpentForCategory(workspace, request.category(), request.month()));
    }

    public synchronized List<SavingsGoal> getGoals(String authorizationHeader) {
        return List.copyOf(workspaceFor(authorizationHeader).goals);
    }

    public synchronized SavingsGoal createGoal(String authorizationHeader, CreateSavingsGoalRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        SavingsGoal goal = new SavingsGoal(
                workspace.goalIdSequence.getAndIncrement(),
                request.name(),
                request.targetAmount(),
                BigDecimal.ZERO,
                request.targetDate()
        );
        workspace.goals.add(goal);
        return goal;
    }

    public synchronized SavingsGoal addGoalContribution(String authorizationHeader, Long goalId, UpdateGoalProgressRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);

        for (int index = 0; index < workspace.goals.size(); index++) {
            SavingsGoal current = workspace.goals.get(index);
            if (current.id().equals(goalId)) {
                SavingsGoal updated = new SavingsGoal(
                        current.id(),
                        current.name(),
                        current.targetAmount(),
                        current.currentAmount().add(request.contributionAmount()),
                        current.targetDate()
                );
                workspace.goals.set(index, updated);
                return updated;
            }
        }

        throw new IllegalArgumentException("Goal not found.");
    }

    public synchronized List<RecurringPayment> getRecurringPayments(String authorizationHeader) {
        return workspaceFor(authorizationHeader).recurringPayments.stream()
                .sorted(Comparator.comparing(RecurringPayment::nextDueDate))
                .toList();
    }

    public synchronized RecurringPayment createRecurringPayment(String authorizationHeader, CreateRecurringPaymentRequest request) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        Account account = findAccount(workspace, request.accountId());
        RecurringPayment recurringPayment = new RecurringPayment(
                workspace.recurringIdSequence.getAndIncrement(),
                request.name(),
                request.amount(),
                request.category(),
                account.id(),
                account.name(),
                request.frequency(),
                request.nextDueDate()
        );
        workspace.recurringPayments.add(recurringPayment);
        return recurringPayment;
    }

    public synchronized DashboardSummary getDashboard(String authorizationHeader) {
        UserWorkspace workspace = workspaceFor(authorizationHeader);
        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expenses = BigDecimal.ZERO;
        Map<String, BigDecimal> categorySpend = new HashMap<>();
        Map<YearMonth, BigDecimal> monthlySpend = new LinkedHashMap<>();

        for (int monthOffset = 5; monthOffset >= 0; monthOffset--) {
            monthlySpend.put(YearMonth.now().minusMonths(monthOffset), BigDecimal.ZERO);
        }

        for (Transaction transaction : workspace.transactions) {
            if (transaction.type() == TransactionType.INCOME) {
                income = income.add(transaction.amount());
            } else {
                expenses = expenses.add(transaction.amount());
                categorySpend.merge(transaction.category(), transaction.amount(), BigDecimal::add);
                YearMonth month = YearMonth.from(transaction.transactionDate());
                if (monthlySpend.containsKey(month)) {
                    monthlySpend.put(month, monthlySpend.get(month).add(transaction.amount()));
                }
            }
        }

        List<DashboardSummary.CategorySpend> topCategories = categorySpend.entrySet().stream()
                .map(entry -> new DashboardSummary.CategorySpend(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(DashboardSummary.CategorySpend::amount).reversed())
                .limit(5)
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<DashboardSummary.TrendPoint> spendingTrends = monthlySpend.entrySet().stream()
                .map(entry -> new DashboardSummary.TrendPoint(entry.getKey().format(formatter), entry.getValue()))
                .toList();

        String activeMonth = YearMonth.now().toString();
        return new DashboardSummary(
                new DashboardSummary.FinancialSnapshot(income, expenses, income.subtract(expenses)),
                getAccounts(authorizationHeader),
                buildBudgetStatuses(workspace, activeMonth),
                topCategories,
                spendingTrends,
                getGoals(authorizationHeader),
                getRecurringPayments(authorizationHeader),
                getTransactions(authorizationHeader).stream().limit(8).toList()
        );
    }

    private AuthResponse issueAuthResponse(UserRecord userRecord, boolean includeRefreshToken) {
        String accessToken = jwtTokenService.createAccessToken(userRecord.id(), userRecord.email());
        String refreshToken = null;

        if (includeRefreshToken) {
            refreshToken = jwtTokenService.createRefreshToken(userRecord.id(), userRecord.email());
            refreshTokensByToken.put(refreshToken, userRecord.id());
        }

        return new AuthResponse(accessToken, refreshToken, toUserView(userRecord));
    }

    private UserRecord requireUser(String authorizationHeader) {
        String token = extractBearerToken(authorizationHeader);
        Long userId = jwtTokenService.parseAccessToken(token).userId();
        return findUserById(userId);
    }

    private UserRecord findUserById(Long userId) {
        UserRecord userRecord = usersById.get(userId);
        if (userRecord == null) {
            throw new UnauthorizedException("User not found.");
        }
        return userRecord;
    }

    private UserView toUserView(UserRecord userRecord) {
        return new UserView(userRecord.id(), userRecord.email(), userRecord.displayName());
    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new UnauthorizedException("Missing authorization token.");
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid authorization header.");
        }

        return authorizationHeader.substring("Bearer ".length());
    }

    private UserWorkspace workspaceFor(String authorizationHeader) {
        return workspacesByUserId.get(requireUser(authorizationHeader).id());
    }

    private Account findAccount(UserWorkspace workspace, Long accountId) {
        return workspace.accounts.stream()
                .filter(account -> account.id().equals(accountId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Account not found."));
    }

    private List<BudgetStatus> buildBudgetStatuses(UserWorkspace workspace, String month) {
        return workspace.budgets.stream()
                .filter(budget -> budget.month().equals(month))
                .map(budget -> toBudgetStatus(budget, calculateSpentForCategory(workspace, budget.category(), budget.month())))
                .sorted(Comparator.comparing(BudgetStatus::category))
                .toList();
    }

    private BudgetStatus toBudgetStatus(Budget budget, BigDecimal actualAmount) {
        BigDecimal remainingAmount = budget.limitAmount().subtract(actualAmount);
        String status = remainingAmount.signum() >= 0 ? "UNDER" : "OVER";
        return new BudgetStatus(
                budget.id(),
                budget.category(),
                budget.month(),
                budget.limitAmount(),
                actualAmount,
                remainingAmount,
                status
        );
    }

    private BigDecimal calculateSpentForCategory(UserWorkspace workspace, String category, String month) {
        YearMonth selectedMonth = YearMonth.parse(month);
        return workspace.transactions.stream()
                .filter(transaction -> transaction.type() == TransactionType.EXPENSE)
                .filter(transaction -> transaction.category().equalsIgnoreCase(category))
                .filter(transaction -> YearMonth.from(transaction.transactionDate()).equals(selectedMonth))
                .map(Transaction::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private UserWorkspace seedWorkspace() {
        UserWorkspace workspace = new UserWorkspace();

        Account checking = new Account(workspace.accountIdSequence.getAndIncrement(), "Main Checking", AccountType.CHECKING);
        Account creditCard = new Account(workspace.accountIdSequence.getAndIncrement(), "Rewards Credit Card", AccountType.CREDIT_CARD);
        workspace.accounts.add(checking);
        workspace.accounts.add(creditCard);

        workspace.transactions.add(new Transaction(
                workspace.transactionIdSequence.getAndIncrement(),
                "Monthly salary",
                new BigDecimal("7200.00"),
                TransactionType.INCOME,
                "SALARY",
                checking.id(),
                checking.name(),
                LocalDate.now().minusDays(10),
                false
        ));
        workspace.transactions.add(new Transaction(
                workspace.transactionIdSequence.getAndIncrement(),
                "Apartment rent",
                new BigDecimal("1900.00"),
                TransactionType.EXPENSE,
                "HOUSING",
                checking.id(),
                checking.name(),
                LocalDate.now().minusDays(8),
                true
        ));
        workspace.transactions.add(new Transaction(
                workspace.transactionIdSequence.getAndIncrement(),
                "Groceries",
                new BigDecimal("235.40"),
                TransactionType.EXPENSE,
                "FOOD",
                creditCard.id(),
                creditCard.name(),
                LocalDate.now().minusDays(4),
                false
        ));
        workspace.transactions.add(new Transaction(
                workspace.transactionIdSequence.getAndIncrement(),
                "Client invoice",
                new BigDecimal("950.00"),
                TransactionType.INCOME,
                "FREELANCE",
                checking.id(),
                checking.name(),
                LocalDate.now().minusDays(2),
                false
        ));

        YearMonth activeMonth = YearMonth.now();
        workspace.budgets.add(new Budget(workspace.budgetIdSequence.getAndIncrement(), "FOOD", activeMonth.toString(), new BigDecimal("600.00")));
        workspace.budgets.add(new Budget(workspace.budgetIdSequence.getAndIncrement(), "HOUSING", activeMonth.toString(), new BigDecimal("2000.00")));

        workspace.goals.add(new SavingsGoal(
                workspace.goalIdSequence.getAndIncrement(),
                "Emergency Fund",
                new BigDecimal("10000.00"),
                new BigDecimal("3200.00"),
                LocalDate.now().plusMonths(8)
        ));

        workspace.recurringPayments.add(new RecurringPayment(
                workspace.recurringIdSequence.getAndIncrement(),
                "Streaming Subscription",
                new BigDecimal("14.99"),
                "ENTERTAINMENT",
                creditCard.id(),
                creditCard.name(),
                RecurringFrequency.MONTHLY,
                LocalDate.now().plusDays(5)
        ));
        workspace.recurringPayments.add(new RecurringPayment(
                workspace.recurringIdSequence.getAndIncrement(),
                "Electricity Bill",
                new BigDecimal("88.00"),
                "UTILITIES",
                checking.id(),
                checking.name(),
                RecurringFrequency.MONTHLY,
                LocalDate.now().plusDays(9)
        ));

        return workspace;
    }

    private record UserRecord(Long id, String email, String passwordHash, String displayName) {
    }

    private static final class UserWorkspace {
        private final AtomicLong transactionIdSequence = new AtomicLong(1);
        private final AtomicLong accountIdSequence = new AtomicLong(1);
        private final AtomicLong budgetIdSequence = new AtomicLong(1);
        private final AtomicLong goalIdSequence = new AtomicLong(1);
        private final AtomicLong recurringIdSequence = new AtomicLong(1);
        private final List<Transaction> transactions = new ArrayList<>();
        private final List<Account> accounts = new ArrayList<>();
        private final List<Budget> budgets = new ArrayList<>();
        private final List<SavingsGoal> goals = new ArrayList<>();
        private final List<RecurringPayment> recurringPayments = new ArrayList<>();
    }
}
