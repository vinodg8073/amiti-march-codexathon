import { useEffect, useMemo, useState } from "react";
import {
  addGoalContribution,
  clearStoredToken,
  createAccount,
  createGoal,
  createRecurringPayment,
  createTransaction,
  deleteTransaction,
  fetchDashboard,
  fetchSession,
  fetchTransactions,
  getStoredToken,
  login,
  signup,
  storeToken,
  updateTransaction,
  upsertBudget
} from "./api";

const defaultCategories = [
  "HOUSING",
  "FOOD",
  "TRANSPORT",
  "UTILITIES",
  "ENTERTAINMENT",
  "HEALTH",
  "SAVINGS",
  "SALARY",
  "FREELANCE",
  "OTHER"
];

const accountTypes = ["CHECKING", "SAVINGS", "CREDIT_CARD", "CASH", "INVESTMENT"];
const recurringFrequencies = ["WEEKLY", "MONTHLY", "YEARLY"];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function buildTransactionForm(accountId = "") {
  return {
    description: "",
    amount: "",
    type: "EXPENSE",
    category: "FOOD",
    accountId,
    transactionDate: today(),
    recurring: false
  };
}

function buildRecurringForm(accountId = "") {
  return {
    name: "",
    amount: "",
    category: "UTILITIES",
    accountId,
    frequency: "MONTHLY",
    nextDueDate: today()
  };
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value ?? 0));
}

function normalizeTransactionPayload(form) {
  return {
    ...form,
    amount: Number(form.amount),
    accountId: Number(form.accountId)
  };
}

function normalizeRecurringPayload(form) {
  return {
    ...form,
    amount: Number(form.amount),
    accountId: Number(form.accountId)
  };
}

function percent(current, total) {
  if (!total) {
    return 0;
  }

  return Math.min(100, Math.round((Number(current) / Number(total)) * 100));
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function App() {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("Checking session...");
  const [authMode, setAuthMode] = useState("signup");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [transactionForm, setTransactionForm] = useState(buildTransactionForm());
  const [accountForm, setAccountForm] = useState({ name: "", type: "CHECKING" });
  const [budgetForm, setBudgetForm] = useState({ category: "FOOD", month: currentMonth(), limitAmount: "" });
  const [goalForm, setGoalForm] = useState({ name: "", targetAmount: "", targetDate: today() });
  const [recurringForm, setRecurringForm] = useState(buildRecurringForm());
  const [goalContribution, setGoalContribution] = useState({});

  const accounts = dashboard?.accounts ?? [];
  const budgets = dashboard?.budgets ?? [];
  const goals = dashboard?.goals ?? [];
  const recurringPayments = dashboard?.upcomingRecurringPayments ?? [];
  const topSpendingCategories = dashboard?.topSpendingCategories ?? [];
  const spendingTrends = dashboard?.spendingTrends ?? [];
  const categoryOptions = useMemo(() => {
    const dynamicCategories = [
      ...new Set([
        ...defaultCategories,
        ...transactions.map((transaction) => transaction.category),
        ...budgets.map((budget) => budget.category),
        ...recurringPayments.map((payment) => payment.category)
      ])
    ];
    return dynamicCategories.sort();
  }, [transactions, budgets, recurringPayments]);

  async function loadWorkspace(activeToken, { loadingMessage } = {}) {
    if (!activeToken) {
      setStatus("Please sign in to continue.");
      return;
    }

    if (loadingMessage) {
      setStatus(loadingMessage);
    }

    try {
      const [sessionData, dashboardData, transactionData] = await Promise.all([
        fetchSession(activeToken),
        fetchDashboard(activeToken),
        fetchTransactions(activeToken)
      ]);

      setUser(sessionData.user);
      setDashboard(dashboardData);
      setTransactions(transactionData);
      setStatus("");

      const defaultAccountId = String(dashboardData.accounts?.[0]?.id ?? "");
      setTransactionForm((current) => ({ ...current, accountId: current.accountId || defaultAccountId }));
      setRecurringForm((current) => ({ ...current, accountId: current.accountId || defaultAccountId }));
    } catch (error) {
      clearStoredToken();
      setToken("");
      setUser(null);
      setDashboard(null);
      setTransactions([]);
      setStatus(error.message);
    }
  }

  useEffect(() => {
    if (!token) {
      setStatus("Create an account or log in to manage your finances.");
      return;
    }

    loadWorkspace(token, { loadingMessage: "Loading your finance workspace..." });
  }, [token]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setStatus(authMode === "signup" ? "Creating your account..." : "Signing you in...");

    try {
      const response =
        authMode === "signup" ? await signup(authForm) : await login(authForm);
      storeToken(response.token);
      setToken(response.token);
      setUser(response.user);
      setAuthForm({ email: "", password: "" });
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleTransactionSubmit(event) {
    event.preventDefault();
    const isEditing = Boolean(editingTransactionId);
    setStatus(isEditing ? "Updating transaction..." : "Saving transaction...");

    try {
      const payload = normalizeTransactionPayload(transactionForm);
      if (isEditing) {
        await updateTransaction(token, editingTransactionId, payload);
      } else {
        await createTransaction(token, payload);
      }
      setEditingTransactionId(null);
      setTransactionForm(buildTransactionForm(String(accounts[0]?.id ?? "")));
      await loadWorkspace(token, { loadingMessage: "Refreshing your dashboard..." });
      setStatus(isEditing ? "Transaction updated." : "Transaction saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function startEditingTransaction(transaction) {
    setEditingTransactionId(transaction.id);
    setTransactionForm({
      description: transaction.description,
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      accountId: String(transaction.accountId),
      transactionDate: transaction.transactionDate,
      recurring: transaction.recurring
    });
    setStatus("Editing transaction.");
  }

  async function handleDeleteTransaction(transactionId) {
    setStatus("Deleting transaction...");
    try {
      await deleteTransaction(token, transactionId);
      if (editingTransactionId === transactionId) {
        setEditingTransactionId(null);
        setTransactionForm(buildTransactionForm(String(accounts[0]?.id ?? "")));
      }
      await loadWorkspace(token, { loadingMessage: "Refreshing your dashboard..." });
      setStatus("Transaction deleted.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleCreateAccount(event) {
    event.preventDefault();
    setStatus("Creating account...");
    try {
      await createAccount(token, accountForm);
      setAccountForm({ name: "", type: "CHECKING" });
      await loadWorkspace(token, { loadingMessage: "Refreshing accounts..." });
      setStatus("Account created.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleBudgetSubmit(event) {
    event.preventDefault();
    setStatus("Saving budget...");
    try {
      await upsertBudget(token, {
        ...budgetForm,
        limitAmount: Number(budgetForm.limitAmount)
      });
      setBudgetForm((current) => ({ ...current, limitAmount: "" }));
      await loadWorkspace(token, { loadingMessage: "Refreshing budgets..." });
      setStatus("Budget updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleGoalSubmit(event) {
    event.preventDefault();
    setStatus("Creating savings goal...");
    try {
      await createGoal(token, {
        ...goalForm,
        targetAmount: Number(goalForm.targetAmount)
      });
      setGoalForm({ name: "", targetAmount: "", targetDate: today() });
      await loadWorkspace(token, { loadingMessage: "Refreshing goals..." });
      setStatus("Savings goal created.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleGoalContribution(goalId) {
    const contributionAmount = Number(goalContribution[goalId]);
    if (!contributionAmount) {
      setStatus("Enter a contribution amount first.");
      return;
    }

    setStatus("Updating goal progress...");
    try {
      await addGoalContribution(token, goalId, { contributionAmount });
      setGoalContribution((current) => ({ ...current, [goalId]: "" }));
      await loadWorkspace(token, { loadingMessage: "Refreshing goals..." });
      setStatus("Goal progress updated.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleRecurringSubmit(event) {
    event.preventDefault();
    setStatus("Creating recurring payment...");
    try {
      await createRecurringPayment(token, normalizeRecurringPayload(recurringForm));
      setRecurringForm(buildRecurringForm(String(accounts[0]?.id ?? "")));
      await loadWorkspace(token, { loadingMessage: "Refreshing recurring payments..." });
      setStatus("Recurring payment created.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function handleLogout() {
    clearStoredToken();
    setToken("");
    setUser(null);
    setDashboard(null);
    setTransactions([]);
    setEditingTransactionId(null);
    setTransactionForm(buildTransactionForm());
    setRecurringForm(buildRecurringForm());
    setStatus("Signed out.");
  }

  if (!user) {
    return (
      <div className="app-shell auth-shell">
        <section className="auth-card panel">
          <p className="eyebrow">Week 1 Delivery</p>
          <h1>Personal Finance Tracker</h1>
          <p className="hero-copy">
            Sign up to create your secure workspace or log in to continue where you left off.
          </p>
          <div className="auth-toggle">
            <button
              className={authMode === "signup" ? "active" : ""}
              onClick={() => setAuthMode("signup")}
              type="button"
            >
              Sign up
            </button>
            <button
              className={authMode === "login" ? "active" : ""}
              onClick={() => setAuthMode("login")}
              type="button"
            >
              Log in
            </button>
          </div>
          <form className="auth-form" onSubmit={handleAuthSubmit}>
            <label>
              Email
              <input
                required
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              />
            </label>
            <button type="submit">{authMode === "signup" ? "Create account" : "Log in"}</button>
          </form>
          {status ? <p className="status">{status}</p> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Week 1 Delivery</p>
          <h1>Personal Finance Tracker</h1>
          <p className="hero-copy">
            Signed in as {user.email}. Manage transactions, budgets, reporting, goals, and recurring bills in one place.
          </p>
        </div>
        <div className="hero-actions">
          <div className="hero-card">
            <span>Net savings</span>
            <strong>{formatCurrency(dashboard?.snapshot?.netSavings)}</strong>
          </div>
          <button className="secondary-button" onClick={handleLogout} type="button">
            Log out
          </button>
        </div>
      </header>

      {status ? <p className="status">{status}</p> : null}

      <main className="grid">
        <section className="panel summary-grid full-width">
          <MetricCard label="Income" value={formatCurrency(dashboard?.snapshot?.totalIncome)} />
          <MetricCard label="Expenses" value={formatCurrency(dashboard?.snapshot?.totalExpenses)} />
          <MetricCard label="Accounts" value={String(accounts.length)} />
          <MetricCard label="Goals" value={String(goals.length)} />
        </section>

        <section className="panel full-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Transactions</p>
              <h2>{editingTransactionId ? "Edit transaction" : "Add transaction"}</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleTransactionSubmit}>
            <label>
              Description
              <input
                required
                value={transactionForm.description}
                onChange={(event) => setTransactionForm({ ...transactionForm, description: event.target.value })}
              />
            </label>
            <label>
              Amount
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={transactionForm.amount}
                onChange={(event) => setTransactionForm({ ...transactionForm, amount: event.target.value })}
              />
            </label>
            <label>
              Type
              <select
                value={transactionForm.type}
                onChange={(event) => setTransactionForm({ ...transactionForm, type: event.target.value })}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label>
              Category
              <select
                value={transactionForm.category}
                onChange={(event) => setTransactionForm({ ...transactionForm, category: event.target.value })}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Account
              <select
                required
                value={transactionForm.accountId}
                onChange={(event) => setTransactionForm({ ...transactionForm, accountId: event.target.value })}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                required
                type="date"
                value={transactionForm.transactionDate}
                onChange={(event) => setTransactionForm({ ...transactionForm, transactionDate: event.target.value })}
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={transactionForm.recurring}
                onChange={(event) => setTransactionForm({ ...transactionForm, recurring: event.target.checked })}
              />
              Mark as recurring expense
            </label>
            <div className="button-row">
              <button type="submit">{editingTransactionId ? "Update" : "Save"} transaction</button>
              {editingTransactionId ? (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setEditingTransactionId(null);
                    setTransactionForm(buildTransactionForm(String(accounts[0]?.id ?? "")));
                  }}
                  type="button"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Accounts</p>
              <h2>Add account</h2>
            </div>
          </div>
          <form className="form-grid compact-form" onSubmit={handleCreateAccount}>
            <label>
              Account name
              <input
                required
                value={accountForm.name}
                onChange={(event) => setAccountForm({ ...accountForm, name: event.target.value })}
              />
            </label>
            <label>
              Type
              <select
                value={accountForm.type}
                onChange={(event) => setAccountForm({ ...accountForm, type: event.target.value })}
              >
                {accountTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Create account</button>
          </form>
          <div className="stack-list">
            {accounts.map((account) => (
              <div className="row" key={account.id}>
                <span>{account.name}</span>
                <strong>{account.type}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Budgeting</p>
              <h2>Monthly budgets</h2>
            </div>
          </div>
          <form className="form-grid compact-form" onSubmit={handleBudgetSubmit}>
            <label>
              Category
              <select
                value={budgetForm.category}
                onChange={(event) => setBudgetForm({ ...budgetForm, category: event.target.value })}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Month
              <input
                required
                type="month"
                value={budgetForm.month}
                onChange={(event) => setBudgetForm({ ...budgetForm, month: event.target.value })}
              />
            </label>
            <label>
              Limit
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={budgetForm.limitAmount}
                onChange={(event) => setBudgetForm({ ...budgetForm, limitAmount: event.target.value })}
              />
            </label>
            <button type="submit">Save budget</button>
          </form>
          <div className="stack-list">
            {budgets.map((budget) => (
              <div className="budget-card" key={budget.id}>
                <div className="row no-border">
                  <strong>{budget.category}</strong>
                  <span className={budget.status === "OVER" ? "negative" : "positive"}>{budget.status}</span>
                </div>
                <p>{formatCurrency(budget.actualAmount)} of {formatCurrency(budget.limitAmount)} used</p>
                <div className="progress-track">
                  <div
                    className={budget.status === "OVER" ? "progress-fill over" : "progress-fill"}
                    style={{ width: `${percent(budget.actualAmount, budget.limitAmount)}%` }}
                  />
                </div>
                <small>Remaining: {formatCurrency(budget.remainingAmount)}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Reporting</p>
              <h2>Spending trends</h2>
            </div>
          </div>
          <div className="chart-list">
            {spendingTrends.map((trend) => (
              <div className="chart-row" key={trend.month}>
                <span>{trend.month}</span>
                <div className="chart-bar">
                  <div
                    className="chart-fill"
                    style={{ width: `${percent(trend.amount, dashboard?.snapshot?.totalExpenses || 1)}%` }}
                  />
                </div>
                <strong>{formatCurrency(trend.amount)}</strong>
              </div>
            ))}
          </div>
          <h3>Top spending categories</h3>
          <div className="stack-list">
            {topSpendingCategories.map((item) => (
              <div className="row" key={item.category}>
                <span>{item.category}</span>
                <strong>{formatCurrency(item.amount)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Savings goals</p>
              <h2>Create and track goals</h2>
            </div>
          </div>
          <form className="form-grid compact-form" onSubmit={handleGoalSubmit}>
            <label>
              Goal name
              <input
                required
                value={goalForm.name}
                onChange={(event) => setGoalForm({ ...goalForm, name: event.target.value })}
              />
            </label>
            <label>
              Target amount
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={goalForm.targetAmount}
                onChange={(event) => setGoalForm({ ...goalForm, targetAmount: event.target.value })}
              />
            </label>
            <label>
              Deadline
              <input
                required
                type="date"
                value={goalForm.targetDate}
                onChange={(event) => setGoalForm({ ...goalForm, targetDate: event.target.value })}
              />
            </label>
            <button type="submit">Create goal</button>
          </form>
          <div className="stack-list">
            {goals.map((goal) => (
              <div className="goal-card" key={goal.id}>
                <div className="row no-border">
                  <strong>{goal.name}</strong>
                  <span>{goal.targetDate}</span>
                </div>
                <p>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)} saved</p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${percent(goal.currentAmount, goal.targetAmount)}%` }} />
                </div>
                <div className="inline-form">
                  <input
                    min="0.01"
                    placeholder="Contribution"
                    step="0.01"
                    type="number"
                    value={goalContribution[goal.id] ?? ""}
                    onChange={(event) =>
                      setGoalContribution((current) => ({
                        ...current,
                        [goal.id]: event.target.value
                      }))
                    }
                  />
                  <button onClick={() => handleGoalContribution(goal.id)} type="button">
                    Add progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recurring</p>
              <h2>Bills and subscriptions</h2>
            </div>
          </div>
          <form className="form-grid compact-form" onSubmit={handleRecurringSubmit}>
            <label>
              Name
              <input
                required
                value={recurringForm.name}
                onChange={(event) => setRecurringForm({ ...recurringForm, name: event.target.value })}
              />
            </label>
            <label>
              Amount
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={recurringForm.amount}
                onChange={(event) => setRecurringForm({ ...recurringForm, amount: event.target.value })}
              />
            </label>
            <label>
              Category
              <select
                value={recurringForm.category}
                onChange={(event) => setRecurringForm({ ...recurringForm, category: event.target.value })}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Account
              <select
                value={recurringForm.accountId}
                onChange={(event) => setRecurringForm({ ...recurringForm, accountId: event.target.value })}
              >
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Frequency
              <select
                value={recurringForm.frequency}
                onChange={(event) => setRecurringForm({ ...recurringForm, frequency: event.target.value })}
              >
                {recurringFrequencies.map((frequency) => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Next due date
              <input
                required
                type="date"
                value={recurringForm.nextDueDate}
                onChange={(event) => setRecurringForm({ ...recurringForm, nextDueDate: event.target.value })}
              />
            </label>
            <button type="submit">Add recurring payment</button>
          </form>
          <div className="stack-list">
            {recurringPayments.map((payment) => (
              <div className="row" key={payment.id}>
                <div>
                  <strong>{payment.name}</strong>
                  <p>{payment.category} · {payment.frequency} · {payment.accountName}</p>
                </div>
                <div className="align-right">
                  <strong>{formatCurrency(payment.amount)}</strong>
                  <p>{payment.nextDueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel full-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2>All transactions</h2>
            </div>
          </div>
          <div className="table">
            <div className="table-head">
              <span>Description</span>
              <span>Category</span>
              <span>Account</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Actions</span>
            </div>
            {transactions.map((transaction) => (
              <div className="table-row" key={transaction.id}>
                <span>{transaction.description}</span>
                <span>{transaction.category}</span>
                <span>{transaction.accountName}</span>
                <span>{transaction.transactionDate}</span>
                <span className={transaction.type === "INCOME" ? "positive" : "negative"}>
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <div className="action-row">
                  <button onClick={() => startEditingTransaction(transaction)} type="button">Edit</button>
                  <button className="danger-button" onClick={() => handleDeleteTransaction(transaction.id)} type="button">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
