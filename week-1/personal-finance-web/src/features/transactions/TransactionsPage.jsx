import { formatCategoryLabel, formatCurrency, formatShortDate } from "../workspace/workspaceShared";

export default function TransactionsPage({ accountNameById, accounts, categoryOptions, onDeleteTransaction, onOpenAddTransaction, onStartEditingTransaction, onTransactionFilterChange, transactionFilters, transactions }) {
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesDate = !transactionFilters.date || transaction.transactionDate === transactionFilters.date;
    const matchesType = !transactionFilters.type || transaction.type === transactionFilters.type;
    const matchesCategory = !transactionFilters.category || transaction.category === transactionFilters.category;
    const matchesAccount = !transactionFilters.accountId || String(transaction.accountId) === transactionFilters.accountId;
    const searchValue = transactionFilters.search.trim().toLowerCase();
    const matchesSearch = !searchValue || transaction.description.toLowerCase().includes(searchValue) || transaction.category.toLowerCase().includes(searchValue);
    return matchesDate && matchesType && matchesCategory && matchesAccount && matchesSearch;
  });

  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Transactions</h1><button onClick={onOpenAddTransaction} type="button">Add Transaction</button></div>
        <div className="filters-grid filters-grid-wide">
          <label><span className="sr-only">Date</span><input type="date" value={transactionFilters.date} onChange={(event) => onTransactionFilterChange("date", event.target.value)} /></label>
          <label><span className="sr-only">Type</span><select value={transactionFilters.type} onChange={(event) => onTransactionFilterChange("type", event.target.value)}><option value="">Type</option><option value="EXPENSE">Expense</option><option value="INCOME">Income</option><option value="TRANSFER">Transfer</option></select></label>
          <label><span className="sr-only">Category</span><select value={transactionFilters.category} onChange={(event) => onTransactionFilterChange("category", event.target.value)}><option value="">Category</option>{categoryOptions.map((category) => <option key={category} value={category}>{formatCategoryLabel(category)}</option>)}</select></label>
          <label><span className="sr-only">Account</span><select value={transactionFilters.accountId} onChange={(event) => onTransactionFilterChange("accountId", event.target.value)}><option value="">Account</option>{accounts.map((account) => <option key={account.id} value={String(account.id)}>{account.name}</option>)}</select></label>
          <label><span className="sr-only">Search</span><input placeholder="Search" type="search" value={transactionFilters.search} onChange={(event) => onTransactionFilterChange("search", event.target.value)} /></label>
        </div>
        <div className="data-table">
          <div className="data-table-head">
            <span>Date</span>
            <span>Merchant</span>
            <span>Category</span>
            <span>Account</span>
            <span>Type</span>
            <span>Amount</span>
            <span>Actions</span>
          </div>
          {filteredTransactions.map((transaction) => (
            <div className="data-table-row" key={transaction.id}>
              <span>{formatShortDate(transaction.transactionDate)}</span>
              <span>{transaction.description}</span>
              <span>{formatCategoryLabel(transaction.category)}</span>
              <span>{accountNameById.get(String(transaction.accountId)) || "--"}</span>
              <span>{formatCategoryLabel(transaction.type)}</span>
              <strong className={transaction.type === "INCOME" ? "positive" : "negative"}>{transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}</strong>
              <div className="table-actions">
                <button className="secondary-button" onClick={() => onStartEditingTransaction(transaction)} type="button">Edit</button>
                <button className="danger-button" onClick={() => onDeleteTransaction(transaction.id)} type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
