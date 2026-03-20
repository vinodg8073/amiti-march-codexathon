import { formatCurrency, formatMonthYear, percent } from "../workspace/workspaceShared";

export default function GoalsPage({ goalForm, goals, onGoalFormChange, onGoalSubmit, setShowGoalComposer, showGoalComposer }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Savings Goals</h1><button onClick={() => setShowGoalComposer((current) => !current)} type="button">{showGoalComposer ? "Close" : "Add Goal"}</button></div>
        {showGoalComposer ? (
          <form className="inline-form" onSubmit={onGoalSubmit}>
            <label>Name<input required value={goalForm.name} onChange={(event) => onGoalFormChange("name", event.target.value)} /></label>
            <label>Target amount<input required min="0" step="0.01" type="number" value={goalForm.targetAmount} onChange={(event) => onGoalFormChange("targetAmount", event.target.value)} /></label>
            <label>Target date<input required type="date" value={goalForm.targetDate} onChange={(event) => onGoalFormChange("targetDate", event.target.value)} /></label>
            <div className="inline-form-actions"><button type="submit">Save Goal</button></div>
          </form>
        ) : null}
        <div className="progress-list">
          {goals.map((goal) => {
            const progress = percent(goal.currentAmount, goal.targetAmount);
            return (
              <article className="goal-row" key={goal.id}>
                <div className="goal-row-main">
                  <strong>{goal.name}</strong>
                  <span className="summary-copy">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="progress-block">
                  <div className="progress-track"><div className="goal-fill" style={{ width: `${progress}%` }} /></div>
                  <span className="progress-label">{progress}%</span>
                </div>
                <span className="goal-due">Due: {formatMonthYear(goal.targetDate)}</span>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
