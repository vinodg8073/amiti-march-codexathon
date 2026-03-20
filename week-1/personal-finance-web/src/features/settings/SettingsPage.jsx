export default function SettingsPage({ onLogout, onSendTestNotification, user }) {
  return (
    <main className="page-shell">
      <section className="page-card">
        <div className="page-header"><h1>Settings</h1></div>
        <div className="settings-grid">
          <article className="settings-panel"><h2>Profile</h2><p className="summary-copy">{user.displayName || "User"}</p><p className="summary-copy muted">{user.email}</p></article>
          <article className="settings-panel"><h2>Session</h2><p className="summary-copy">Your prototype session is stored locally while the API is running.</p><button onClick={onLogout} type="button">Log out</button></article>
          <article className="settings-panel"><h2>Support Workflows</h2><p className="summary-copy">Use the support service to preview notification handling while document export and async workflows are being hardened.</p><button className="secondary-button" onClick={onSendTestNotification} type="button">Send Test Notification</button></article>
        </div>
      </section>
    </main>
  );
}
