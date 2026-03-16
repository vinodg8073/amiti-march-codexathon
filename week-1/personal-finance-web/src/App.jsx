import { useEffect, useState } from "react";
import { createTransaction, fetchDashboard, fetchTransactions } from "./api";

const categoryOptions = [
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

const initialForm = {
  description: "",
  amount: "",
  type: "EXPENSE",
  category: "FOOD",
  transactionDate: new Date().toISOString().slice(0, 10),
  recurring: false
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value ?? 0));
}

export default function App() {
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("Loading finance dashboard...");

  async function loadData() {
    try {
      const [dashboardData, transactionData] = await Promise.all([
        fetchDashboard(),
        fetchTransactions()
      ]);
      setDashboard(dashboardData);
      setTransactions(transactionData);
      setStatus("");
    } catch (error) {
      setStatus(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Saving transaction...");

    try {
      await createTransaction({
        ...form,
        amount: Number(form.amount)
      });
      setForm(initialForm);
      await loadData();
      setStatus("Transaction saved.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Version 1</p>
          <h1>Personal Finance Tracker</h1>
          <p className="hero-copy">
            Track spending, budgets, savings, and recurring payments from one
            clean dashboard.
          </p>
        </div>
        <div className="hero-card">
          <span>Budget usage</span>
          <strong>
            {dashboard
              ? `${Math.round((dashboard.budgetUsed / dashboard.monthlyBudget) * 100)}%`
              : "--"}
          </strong>
        </div>
      </header>

      {status ? <p className="status">{status}</p> : null}

      <main className="grid">
        <section className="panel summary-grid">
          <MetricCard
            label="Income"
            value={formatCurrency(dashboard?.totalIncome)}
          />
          <MetricCard
            label="Expenses"
            value={formatCurrency(dashboard?.totalExpenses)}
          />
          <MetricCard
            label="Savings"
            value={formatCurrency(dashboard?.savingsBalance)}
          />
          <MetricCard
            label="Monthly Budget"
            value={formatCurrency(dashboard?.monthlyBudget)}
          />
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Quick Log</p>
              <h2>Add transaction</h2>
            </div>
          </div>
          <form className="transaction-form" onSubmit={handleSubmit}>
            <label>
              Description
              <input
                required
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </label>
            <label>
              Amount
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: event.target.value })
                }
              />
            </label>
            <label>
              Type
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </label>
            <label>
              Category
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input
                required
                type="date"
                value={form.transactionDate}
                onChange={(event) =>
                  setForm({ ...form, transactionDate: event.target.value })
                }
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.recurring}
                onChange={(event) =>
                  setForm({ ...form, recurring: event.target.checked })
                }
              />
              Recurring payment
            </label>
            <button type="submit">Save transaction</button>
          </form>
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Month View</p>
              <h2>Spend by category</h2>
            </div>
          </div>
          <div className="stack-list">
            {dashboard?.categoryBreakdown?.map((item) => (
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
              <p className="eyebrow">Recurring</p>
              <h2>Upcoming bills</h2>
            </div>
          </div>
          <div className="stack-list">
            {dashboard?.recurringPayments?.map((item) => (
              <div className="row" key={`${item.description}-${item.nextDueDate}`}>
                <div>
                  <strong>{item.description}</strong>
                  <p>Due {item.nextDueDate}</p>
                </div>
                <strong>{formatCurrency(item.amount)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel full-width">
          <div className="section-heading">
            <div>
              <p className="eyebrow">History</p>
              <h2>Recent transactions</h2>
            </div>
          </div>
          <div className="table">
            <div className="table-head">
              <span>Description</span>
              <span>Category</span>
              <span>Date</span>
              <span>Amount</span>
            </div>
            {transactions.map((transaction) => (
              <div className="table-row" key={transaction.id}>
                <span>{transaction.description}</span>
                <span>{transaction.category}</span>
                <span>{transaction.transactionDate}</span>
                <span
                  className={
                    transaction.type === "INCOME" ? "positive" : "negative"
                  }
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
