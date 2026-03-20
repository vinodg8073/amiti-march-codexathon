import { budgetProgressValue, formatCategoryLabel, formatCurrency } from "../workspace/workspaceShared";

export default function BudgetsPage({ budgetForm, budgets, categoryOptions, onBudgetFormChange, onBudgetSubmit, setShowBudgetComposer, showBudgetComposer }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Budgets</h1><button onClick={() => setShowBudgetComposer((current) => !current)} type="button">{showBudgetComposer ? "Close" : "Set Budget"}</button></div>
        {showBudgetComposer ? (
          <form className="inline-form" onSubmit={onBudgetSubmit}>
            <label>Category<select value={budgetForm.category} onChange={(event) => onBudgetFormChange("category", event.target.value)}>{categoryOptions.map((category) => <option key={category} value={category}>{formatCategoryLabel(category)}</option>)}</select></label>
            <label>Month<input required type="month" value={budgetForm.month} onChange={(event) => onBudgetFormChange("month", event.target.value)} /></label>
            <label>Amount<input required min="0" step="0.01" type="number" value={budgetForm.limitAmount} onChange={(event) => onBudgetFormChange("limitAmount", event.target.value)} /></label>
            <div className="inline-form-actions"><button type="submit">Save Budget</button></div>
          </form>
        ) : null}
        <div className="progress-list">
          {budgets.map((budget) => {
            const progress = budgetProgressValue(budget.actualAmount, budget.limitAmount);
            const progressClass = progress >= 100 ? "over" : progress >= 80 ? "warning" : "under";
            return (
              <article className="progress-row" key={budget.id}>
                <div className="progress-main">
                  <strong>{formatCategoryLabel(budget.category)}</strong>
                  <span className="summary-copy">{formatCurrency(budget.actualAmount)} / {formatCurrency(budget.limitAmount)}</span>
                </div>
                <div className="progress-block">
                  <div className="progress-track"><div className={`progress-fill ${progressClass}`} style={{ width: `${Math.min(progress, 120)}%` }} /></div>
                  <span className="progress-label">{progress}%</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
