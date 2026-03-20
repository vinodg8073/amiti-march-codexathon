import { formatCategoryLabel, formatCurrency, formatShortDate, percent } from "../workspace/workspaceShared";

function SummaryCard({ accent, hint, label, value }) {
  return (
    <article className={`summary-card ${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </article>
  );
}

function CategoryChart({ items }) {
  const total = items.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);
  const segments = items.length
    ? items
        .map((item, index) => {
          const colors = ["#17324d", "#0b6e4f", "#d97706", "#2563eb", "#b42318"];
          const start = items.slice(0, index).reduce((sum, current) => sum + ((Number(current.amount ?? 0) / (total || 1)) * 100), 0);
          const end = start + ((Number(item.amount ?? 0) / (total || 1)) * 100);
          return `${colors[index % colors.length]} ${start}% ${end}%`;
        })
        .join(", ")
    : "#dbe7f3 0% 100%";

  return (
    <div className="dashboard-chart-split">
      <div className="dashboard-donut-wrap">
        <div className="dashboard-donut" style={{ background: `conic-gradient(${segments})` }}>
          <div className="dashboard-donut-hole">
            <strong>{formatCurrency(total)}</strong>
            <span>Spent</span>
          </div>
        </div>
      </div>
      <div className="dashboard-legend">
        {items.map((item) => (
          <div className="dashboard-legend-row" key={item.category}>
            <span>{formatCategoryLabel(item.category)}</span>
            <strong>{formatCurrency(item.amount)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ items }) {
  const highest = Math.max(...items.map((item) => Number(item.amount ?? 0)), 1);

  return (
    <div className="trend-chart">
      {items.map((item) => (
        <div className="trend-bar-group" key={item.month}>
          <div className="trend-bar-track">
            <div className="trend-bar-fill" style={{ height: `${Math.max(12, (Number(item.amount ?? 0) / highest) * 100)}%` }} />
          </div>
          <span>{item.month}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage({ dashboard, goals, recurringPayments, transactions }) {
  const recentTransactions = transactions.slice(0, 3);
  const upcomingBills = recurringPayments.slice(0, 3);
  const leadGoal = goals[0];
  const topSpendingCategories = dashboard?.topSpendingCategories ?? [];
  const spendingTrends = dashboard?.spendingTrends ?? [];

  return (
    <main className="dashboard-grid">
      <section className="dashboard-summary-row">
        <SummaryCard accent="balance" label="Balance" value={formatCurrency(dashboard?.snapshot?.netSavings)} />
        <SummaryCard accent="income" label="Income" value={formatCurrency(dashboard?.snapshot?.totalIncome)} />
        <SummaryCard accent="expense" label="Expense" value={formatCurrency(dashboard?.snapshot?.totalExpenses)} />
        <SummaryCard accent="goal" hint={leadGoal ? `${percent(leadGoal.currentAmount, leadGoal.targetAmount)}% complete` : "No goals yet"} label="Savings Goal" value={leadGoal ? leadGoal.name : "Create one"} />
      </section>
      <section className="dashboard-card dashboard-chart-card">
        <div className="dashboard-card-heading"><h2>Spending by Category</h2></div>
        <CategoryChart items={topSpendingCategories} />
      </section>
      <section className="dashboard-card dashboard-chart-card">
        <div className="dashboard-card-heading"><h2>Income vs Expense Trend</h2></div>
        <TrendChart items={spendingTrends} />
      </section>
      <section className="dashboard-card">
        <div className="dashboard-card-heading"><h2>Recent Transactions</h2></div>
        <div className="dashboard-list">
          {recentTransactions.map((transaction) => (
            <div className="dashboard-list-row" key={transaction.id}>
              <div><strong>{transaction.description}</strong></div>
              <span className={transaction.type === "INCOME" ? "positive" : "negative"}>{transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="dashboard-card">
        <div className="dashboard-card-heading"><h2>Upcoming Bills</h2></div>
        <div className="dashboard-list">
          {upcomingBills.map((payment) => (
            <div className="dashboard-list-row" key={payment.id}>
              <div><strong>{payment.name}</strong></div>
              <span>{formatShortDate(payment.nextDueDate)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
