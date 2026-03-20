import { formatCategoryLabel } from "../workspace/workspaceShared";

export default function TransactionModal({ accounts, categoryOptions, editingTransactionId, onCancel, onChange, onSubmit, transactionForm }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title">
        <div className="modal-header">
          <h2 id="transaction-modal-title">{editingTransactionId ? "Edit Transaction" : "Add Transaction"}</h2>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="modal-type-row">
            <span>Type:</span>
            <label><input checked={transactionForm.type === "EXPENSE"} name="type" type="radio" onChange={() => onChange("type", "EXPENSE")} /> Expense</label>
            <label><input checked={transactionForm.type === "INCOME"} name="type" type="radio" onChange={() => onChange("type", "INCOME")} /> Income</label>
            <label><input checked={transactionForm.type === "TRANSFER"} name="type" type="radio" onChange={() => onChange("type", "TRANSFER")} /> Transfer</label>
          </div>
          <label>
            Amount
            <input required min="0" step="0.01" type="number" value={transactionForm.amount} onChange={(event) => onChange("amount", event.target.value)} />
          </label>
          <label>
            Date
            <input required type="date" value={transactionForm.transactionDate} onChange={(event) => onChange("transactionDate", event.target.value)} />
          </label>
          <label>
            Account
            <select value={transactionForm.accountId} onChange={(event) => onChange("accountId", event.target.value)}>
              {accounts.map((account) => (
                <option key={account.id} value={String(account.id)}>{account.name}</option>
              ))}
            </select>
          </label>
          <label>
            Category
            <select disabled={transactionForm.type === "TRANSFER"} value={transactionForm.category} onChange={(event) => onChange("category", event.target.value)}>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{formatCategoryLabel(category)}</option>
              ))}
            </select>
          </label>
          <label>
            Merchant
            <input value={transactionForm.merchant} onChange={(event) => onChange("merchant", event.target.value)} />
          </label>
          <label>
            Note
            <input value={transactionForm.note} onChange={(event) => onChange("note", event.target.value)} />
          </label>
          <label>
            Tags
            <input value={transactionForm.tags} onChange={(event) => onChange("tags", event.target.value)} />
          </label>
          <div className="modal-actions">
            <button className="secondary-button" onClick={onCancel} type="button">Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
