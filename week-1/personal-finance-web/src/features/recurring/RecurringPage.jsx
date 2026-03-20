import { formatCategoryLabel, formatCurrency, formatShortDate, recurringFrequencies } from "../workspace/workspaceShared";

export default function RecurringPage({ onRecurringFormChange, onRecurringSubmit, recurringForm, recurringPayments, setShowRecurringComposer, showRecurringComposer }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Recurring</h1><button onClick={() => setShowRecurringComposer((current) => !current)} type="button">{showRecurringComposer ? "Close" : "New Recurring Item"}</button></div>
        {showRecurringComposer ? (
          <form className="inline-form" onSubmit={onRecurringSubmit}>
            <label>Title<input required value={recurringForm.name} onChange={(event) => onRecurringFormChange("name", event.target.value)} /></label>
            <label>Amount<input required min="0" step="0.01" type="number" value={recurringForm.amount} onChange={(event) => onRecurringFormChange("amount", event.target.value)} /></label>
            <label>Category<input value={recurringForm.category} onChange={(event) => onRecurringFormChange("category", event.target.value)} /></label>
            <label>Frequency<select value={recurringForm.frequency} onChange={(event) => onRecurringFormChange("frequency", event.target.value)}>{recurringFrequencies.map((frequency) => <option key={frequency} value={frequency}>{frequency}</option>)}</select></label>
            <label>Next due date<input required type="date" value={recurringForm.nextDueDate} onChange={(event) => onRecurringFormChange("nextDueDate", event.target.value)} /></label>
            <div className="inline-form-actions"><button type="submit">Save</button></div>
          </form>
        ) : null}
        <div className="stack-list">
          {recurringPayments.map((payment) => (
            <article className="info-row" key={payment.id}>
              <div><strong>{payment.name}</strong><small>{formatCategoryLabel(payment.category)} ? {payment.frequency}</small></div>
              <div className="info-row-end"><strong>{formatCurrency(payment.amount)}</strong><span>{formatShortDate(payment.nextDueDate)}</span></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
