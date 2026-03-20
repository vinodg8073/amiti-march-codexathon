import { accountTypes, formatCategoryLabel } from "../workspace/workspaceShared";

export default function AccountsPage({ accountForm, accounts, onAccountFormChange, onCreateAccount, setShowAccountComposer, showAccountComposer }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Accounts</h1><button onClick={() => setShowAccountComposer((current) => !current)} type="button">{showAccountComposer ? "Close" : "Add Account"}</button></div>
        {showAccountComposer ? (
          <form className="inline-form" onSubmit={onCreateAccount}>
            <label>Name<input required value={accountForm.name} onChange={(event) => onAccountFormChange("name", event.target.value)} /></label>
            <label>Type<select value={accountForm.type} onChange={(event) => onAccountFormChange("type", event.target.value)}>{accountTypes.map((type) => <option key={type} value={type}>{formatCategoryLabel(type)}</option>)}</select></label>
            <div className="inline-form-actions"><button type="submit">Save Account</button></div>
          </form>
        ) : null}
        <div className="stack-list">
          {accounts.map((account) => (
            <article className="info-row" key={account.id}>
              <div><strong>{account.name}</strong><small>{formatCategoryLabel(account.type)}</small></div>
              <div className="info-row-end"><span>ID: {account.id}</span></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
