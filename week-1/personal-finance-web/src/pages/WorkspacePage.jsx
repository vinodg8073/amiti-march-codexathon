import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardNav from "../components/layout/DashboardNav";
import AuthCard from "../features/auth/AuthCard";
import AccountsPage from "../features/accounts/AccountsPage";
import BudgetsPage from "../features/budgets/BudgetsPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import GoalsPage from "../features/goals/GoalsPage";
import RecurringPage from "../features/recurring/RecurringPage";
import ReportsPage from "../features/reports/ReportsPage";
import SettingsPage from "../features/settings/SettingsPage";
import TransactionModal from "../features/transactions/TransactionModal";
import TransactionsPage from "../features/transactions/TransactionsPage";
import {
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
  storeSessionTokens,
  updateTransaction,
  upsertBudget
} from "../services/apiClient";
import { exportReportPdf, sendInAppNotification } from "../services/supportApiClient";
import {
  buildRecurringForm,
  buildTransactionForm,
  buildTransactionPayload,
  currentMonth,
  defaultCategories,
  today
} from "../features/workspace/workspaceShared";

const pageRouteMap = {
  Dashboard: "/app/dashboard",
  Transactions: "/app/transactions",
  Budgets: "/app/budgets",
  Goals: "/app/goals",
  Reports: "/app/reports",
  Recurring: "/app/recurring",
  Accounts: "/app/accounts",
  Settings: "/app/settings"
};

function getCurrentPage(pathname) {
  const match = Object.entries(pageRouteMap).find(([, route]) => route === pathname);
  return match?.[0] ?? "Dashboard";
}

function getAuthMode(pathname) {
  if (pathname === "/signup") {
    return "signup";
  }

  if (pathname === "/forgot-password") {
    return "forgot";
  }

  return "login";
}

export default function WorkspacePage() {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("Checking session...");
  const [authForm, setAuthForm] = useState({ displayName: "", email: "", password: "" });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetComposer, setShowBudgetComposer] = useState(false);
  const [showGoalComposer, setShowGoalComposer] = useState(false);
  const [showRecurringComposer, setShowRecurringComposer] = useState(false);
  const [showAccountComposer, setShowAccountComposer] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState({ date: "", type: "", category: "", accountId: "", search: "" });
  const [transactionForm, setTransactionForm] = useState(buildTransactionForm());
  const [accountForm, setAccountForm] = useState({ name: "", type: "CHECKING" });
  const [budgetForm, setBudgetForm] = useState({ category: "FOOD", month: currentMonth(), limitAmount: "" });
  const [goalForm, setGoalForm] = useState({ name: "", targetAmount: "", targetDate: today() });
  const [recurringForm, setRecurringForm] = useState(buildRecurringForm());

  const location = useLocation();
  const navigate = useNavigate();
  const authMode = getAuthMode(location.pathname);
  const currentPage = getCurrentPage(location.pathname);
  const isProtectedRoute = location.pathname.startsWith("/app");

  const accounts = dashboard?.accounts ?? [];
  const budgets = dashboard?.budgets ?? [];
  const goals = dashboard?.goals ?? [];
  const recurringPayments = dashboard?.upcomingRecurringPayments ?? [];

  const categoryOptions = useMemo(() => {
    const values = [...new Set([...defaultCategories, ...transactions.map((transaction) => transaction.category), ...budgets.map((budget) => budget.category), ...recurringPayments.map((payment) => payment.category)])];
    return values.sort();
  }, [transactions, budgets, recurringPayments]);

  const accountNameById = useMemo(() => new Map(accounts.map((account) => [String(account.id), account.name])), [accounts]);

  useEffect(() => {
    if (!token && isProtectedRoute) {
      navigate("/login", { replace: true });
    }
  }, [isProtectedRoute, navigate, token]);

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
      if (!location.pathname.startsWith("/app")) {
        navigate("/app/dashboard", { replace: true });
      }
    } catch (error) {
      clearStoredToken();
      setToken("");
      setUser(null);
      setDashboard(null);
      setTransactions([]);
      setStatus(error.message);
      navigate("/login", { replace: true });
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
      const response = authMode === "signup" ? await signup(authForm) : await login(authForm);
      storeSessionTokens(response);
      setToken(response.token);
      setUser(response.user);
      setAuthForm({ displayName: "", email: "", password: "" });
      setForgotPasswordEmail("");
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleForgotPasswordSubmit(event) {
    event.preventDefault();
    setStatus(`Password reset instructions placeholder sent to ${forgotPasswordEmail}.`);
  }

  function openAddTransaction() {
    setEditingTransactionId(null);
    setTransactionForm(buildTransactionForm(String(accounts[0]?.id ?? "")));
    setShowTransactionModal(true);
  }

  async function handleTransactionSubmit(event) {
    event.preventDefault();
    if (transactionForm.type === "TRANSFER") {
      setStatus("Transfer flow will be added with two-account backend support in the next slice.");
      return;
    }

    const isEditing = Boolean(editingTransactionId);
    setStatus(isEditing ? "Updating transaction..." : "Saving transaction...");
    try {
      const payload = buildTransactionPayload(transactionForm);
      if (isEditing) {
        await updateTransaction(token, editingTransactionId, payload);
      } else {
        await createTransaction(token, payload);
      }
      setEditingTransactionId(null);
      setShowTransactionModal(false);
      setTransactionForm(buildTransactionForm(String(accounts[0]?.id ?? "")));
      await loadWorkspace(token, { loadingMessage: "Refreshing your dashboard..." });
      setStatus(isEditing ? "Transaction updated." : "Transaction saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  function startEditingTransaction(transaction) {
    navigate("/app/transactions");
    setEditingTransactionId(transaction.id);
    setTransactionForm({
      type: transaction.type,
      amount: String(transaction.amount),
      transactionDate: transaction.transactionDate,
      accountId: String(transaction.accountId),
      category: transaction.category,
      merchant: transaction.description,
      note: "",
      tags: ""
    });
    setShowTransactionModal(true);
    setStatus("Editing transaction.");
  }

  async function handleDeleteTransaction(transactionId) {
    setStatus("Deleting transaction...");
    try {
      await deleteTransaction(token, transactionId);
      if (editingTransactionId === transactionId) {
        setEditingTransactionId(null);
        setShowTransactionModal(false);
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
      setShowAccountComposer(false);
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
      await upsertBudget(token, { ...budgetForm, limitAmount: Number(budgetForm.limitAmount) });
      setBudgetForm((current) => ({ ...current, limitAmount: "" }));
      setShowBudgetComposer(false);
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
      await createGoal(token, { ...goalForm, targetAmount: Number(goalForm.targetAmount) });
      setGoalForm({ name: "", targetAmount: "", targetDate: today() });
      setShowGoalComposer(false);
      await loadWorkspace(token, { loadingMessage: "Refreshing goals..." });
      setStatus("Savings goal created.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleExportPdf(filters) {
    setStatus("Preparing PDF export...");
    try {
      const blob = await exportReportPdf({
        userId: String(user?.id ?? user?.email ?? "demo-user"),
        reportName: `Finance Report ${filters.dateRange}`,
        rows: filters.rows.map((transaction) => ({
          date: transaction.transactionDate,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          accountId: transaction.accountId,
          description: transaction.description
        }))
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "finance-report-preview.pdf";
      anchor.click();
      window.URL.revokeObjectURL(url);
      setStatus("PDF export prepared from support service.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleSendTestNotification() {
    setStatus("Sending test notification...");
    try {
      await sendInAppNotification({
        userId: String(user?.id ?? user?.email ?? "demo-user"),
        channel: "IN_APP",
        title: "Finance Tracker test notification",
        message: "This is a support-service notification preview for your showcase build."
      });
      setStatus("Test notification accepted by support service.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function handleRecurringSubmit(event) {
    event.preventDefault();
    setStatus("Creating recurring payment...");
    try {
      await createRecurringPayment(token, { ...recurringForm, amount: Number(recurringForm.amount), accountId: Number(recurringForm.accountId) });
      setRecurringForm(buildRecurringForm(String(accounts[0]?.id ?? "")));
      setShowRecurringComposer(false);
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
    setShowTransactionModal(false);
    setShowBudgetComposer(false);
    setShowGoalComposer(false);
    setShowRecurringComposer(false);
    setShowAccountComposer(false);
    setTransactionForm(buildTransactionForm());
    setRecurringForm(buildRecurringForm());
    setStatus("Signed out.");
    navigate("/login", { replace: true });
  }

  if (!user) {
    return (
      <div className="app-shell auth-shell">
        <AuthCard
          authForm={authForm}
          authMode={authMode}
          forgotPasswordEmail={forgotPasswordEmail}
          onAuthFormChange={(field, value) => setAuthForm((current) => ({ ...current, [field]: value }))}
          onAuthModeChange={(mode) => navigate(mode === "signup" ? "/signup" : mode === "forgot" ? "/forgot-password" : "/login")}
          onAuthSubmit={handleAuthSubmit}
          onForgotPasswordChange={setForgotPasswordEmail}
          onForgotPasswordSubmit={handleForgotPasswordSubmit}
          status={status}
        />
      </div>
    );
  }

  return (
    <div className="app-shell dashboard-shell">
      <DashboardNav currentPage={currentPage} onLogout={handleLogout} onNavigate={(page) => navigate(pageRouteMap[page] || "/app/dashboard")} onOpenAddTransaction={openAddTransaction} user={user} />
      {status ? <p className="status dashboard-status">{status}</p> : null}
      {currentPage === "Dashboard" ? <DashboardPage dashboard={dashboard} goals={goals} recurringPayments={recurringPayments} transactions={transactions} /> : null}
      {currentPage === "Transactions" ? <TransactionsPage accountNameById={accountNameById} accounts={accounts} categoryOptions={categoryOptions} onDeleteTransaction={handleDeleteTransaction} onOpenAddTransaction={openAddTransaction} onStartEditingTransaction={startEditingTransaction} onTransactionFilterChange={(field, value) => setTransactionFilters((current) => ({ ...current, [field]: value }))} transactionFilters={transactionFilters} transactions={transactions} /> : null}
      {currentPage === "Budgets" ? <BudgetsPage budgetForm={budgetForm} budgets={budgets} categoryOptions={categoryOptions} onBudgetFormChange={(field, value) => setBudgetForm((current) => ({ ...current, [field]: value }))} onBudgetSubmit={handleBudgetSubmit} setShowBudgetComposer={setShowBudgetComposer} showBudgetComposer={showBudgetComposer} /> : null}
      {currentPage === "Goals" ? <GoalsPage goalForm={goalForm} goals={goals} onGoalFormChange={(field, value) => setGoalForm((current) => ({ ...current, [field]: value }))} onGoalSubmit={handleGoalSubmit} setShowGoalComposer={setShowGoalComposer} showGoalComposer={showGoalComposer} /> : null}
      {currentPage === "Reports" ? <ReportsPage accounts={accounts} onExportPdf={handleExportPdf} transactions={transactions} /> : null}
      {currentPage === "Recurring" ? <RecurringPage onRecurringFormChange={(field, value) => setRecurringForm((current) => ({ ...current, [field]: value }))} onRecurringSubmit={handleRecurringSubmit} recurringForm={recurringForm} recurringPayments={recurringPayments} setShowRecurringComposer={setShowRecurringComposer} showRecurringComposer={showRecurringComposer} /> : null}
      {currentPage === "Accounts" ? <AccountsPage accountForm={accountForm} accounts={accounts} onAccountFormChange={(field, value) => setAccountForm((current) => ({ ...current, [field]: value }))} onCreateAccount={handleCreateAccount} setShowAccountComposer={setShowAccountComposer} showAccountComposer={showAccountComposer} /> : null}
      {currentPage === "Settings" ? <SettingsPage onLogout={handleLogout} onSendTestNotification={handleSendTestNotification} user={user} /> : null}
      {showTransactionModal ? <TransactionModal accounts={accounts} categoryOptions={categoryOptions} editingTransactionId={editingTransactionId} onCancel={() => setShowTransactionModal(false)} onChange={(field, value) => setTransactionForm((current) => ({ ...current, [field]: value }))} onSubmit={handleTransactionSubmit} transactionForm={transactionForm} /> : null}
    </div>
  );
}
