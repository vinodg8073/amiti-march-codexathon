import { useMemo, useState } from "react";
import { formatCategoryLabel, formatCurrency } from "../workspace/workspaceShared";

export default function ReportsPage({ accounts, onExportPdf, transactions }) {
  const [dateRange, setDateRange] = useState("this-month");
  const [accountId, setAccountId] = useState("");
  const [type, setType] = useState("");

  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesAccount = !accountId || String(transaction.accountId) === accountId;
    const matchesType = !type || transaction.type === type;
    return matchesAccount && matchesType;
  }), [accountId, transactions, type]);

  const categorySpendMap = filteredTransactions.reduce((map, transaction) => {
    if (transaction.type !== "EXPENSE") {
      return map;
    }
    map.set(transaction.category, (map.get(transaction.category) ?? 0) + Number(transaction.amount));
    return map;
  }, new Map());

  const categorySpend = Array.from(categorySpendMap.entries());
  const highestCategorySpend = Math.max(...categorySpend.map(([, amount]) => amount), 1);

  const monthlyTrendMap = filteredTransactions.reduce((map, transaction) => {
    const key = transaction.transactionDate.slice(0, 7);
    const current = map.get(key) ?? { income: 0, expense: 0 };
    if (transaction.type === "INCOME") {
      current.income += Number(transaction.amount);
    } else {
      current.expense += Number(transaction.amount);
    }
    map.set(key, current);
    return map;
  }, new Map());

  const monthlyTrend = Array.from(monthlyTrendMap.entries()).map(([month, values]) => ({ month, ...values }));
  const highestTrendValue = Math.max(...monthlyTrend.flatMap((item) => [item.income, item.expense]), 1);
  const topCategoriesLabel = categorySpend.slice(0, 3).map(([category]) => formatCategoryLabel(category)).join(", ") || "No report data yet";

  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header">
          <h1>Reports</h1>
          <button onClick={() => onExportPdf({
            dateRange,
            accountId,
            type,
            rows: filteredTransactions
          })} type="button">
            Export PDF
          </button>
        </div>
        <div className="filters-grid">
          <label>Date Range<select value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="this-month">This Month</option><option value="last-3-months">Last 3 Months</option><option value="year-to-date">Year to Date</option></select></label>
          <label>Account<select value={accountId} onChange={(event) => setAccountId(event.target.value)}><option value="">All</option>{accounts.map((account) => <option key={account.id} value={String(account.id)}>{account.name}</option>)}</select></label>
          <label>Type<select value={type} onChange={(event) => setType(event.target.value)}><option value="">All</option><option value="EXPENSE">Expense</option><option value="INCOME">Income</option></select></label>
        </div>
        <section className="chart-card"><h2>Category Spend</h2><div className="bar-chart">{categorySpend.map(([category, amount]) => <div className="bar-row" key={category}><span>{formatCategoryLabel(category)}</span><div className="bar-track"><div className="bar-fill" style={{ width: `${(amount / highestCategorySpend) * 100}%` }} /></div></div><strong>{formatCurrency(amount)}</strong></div>)}</div></section>
        <section className="chart-card"><h2>Income vs Expense by Month</h2><div className="reports-line-chart">{monthlyTrend.map((item) => <div className="reports-line-group" key={item.month}><div className="reports-line-bars"><div className="reports-line-bar income" style={{ height: `${Math.max(12, (item.income / highestTrendValue) * 100)}%` }} /><div className="reports-line-bar expense" style={{ height: `${Math.max(12, (item.expense / highestTrendValue) * 100)}%` }} /></div><span>{item.month}</span></div>)}</div></section>
        <section className="chart-card"><h2>Top Categories</h2><p className="summary-copy">{topCategoriesLabel}</p></section>
      </section>
    </main>
  );
}
