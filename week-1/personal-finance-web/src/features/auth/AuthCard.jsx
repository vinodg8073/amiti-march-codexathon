export default function AuthCard({
  authMode,
  authForm,
  forgotPasswordEmail,
  onAuthModeChange,
  onAuthSubmit,
  onAuthFormChange,
  onForgotPasswordChange,
  onForgotPasswordSubmit,
  status
}) {
  if (authMode === "forgot") {
    return (
      <section className="auth-card auth-card-forgot">
        <h1 className="auth-product-title">Personal Finance Tracker</h1>
        <div className="auth-divider" />
        <div className="auth-section-copy">
          <h2>Reset your access</h2>
          <p className="hero-copy">Enter your email and we&apos;ll help you start the password reset flow.</p>
        </div>
        <form className="auth-form" onSubmit={onForgotPasswordSubmit}>
          <label>
            Email
            <input required type="email" value={forgotPasswordEmail} onChange={(event) => onForgotPasswordChange(event.target.value)} />
          </label>
          <div className="auth-primary-action">
            <button type="submit">Send reset link</button>
          </div>
        </form>
        <div className="auth-links">
          <button className="text-link-button" onClick={() => onAuthModeChange("login")} type="button">
            Back to login
          </button>
        </div>
        {status ? <p className="status auth-status">{status}</p> : null}
      </section>
    );
  }

  if (authMode === "login") {
    return (
      <section className="auth-card auth-card-login">
        <h1 className="auth-product-title">Personal Finance Tracker</h1>
        <div className="auth-divider" />
        <div className="auth-section-copy">
          <h2>Welcome back</h2>
        </div>
        <form className="auth-form" onSubmit={onAuthSubmit}>
          <label>
            Email
            <input required type="email" value={authForm.email} onChange={(event) => onAuthFormChange("email", event.target.value)} />
          </label>
          <label>
            Password
            <input required minLength="8" type="password" value={authForm.password} onChange={(event) => onAuthFormChange("password", event.target.value)} />
          </label>
          <div className="auth-primary-action">
            <button type="submit">Log In</button>
          </div>
        </form>
        <div className="auth-links">
          <button className="text-link-button" onClick={() => onAuthModeChange("forgot")} type="button">
            Forgot password?
          </button>
          <p className="auth-inline-link">
            Don&apos;t have an account?{" "}
            <button className="text-link-button inline" onClick={() => onAuthModeChange("signup")} type="button">
              Sign up
            </button>
          </p>
        </div>
        {status ? <p className="status auth-status">{status}</p> : null}
      </section>
    );
  }

  return (
    <section className="auth-card auth-card-signup">
      <div className="auth-signup-header">
        <p className="eyebrow">Personal Finance Tracker</p>
        <h1>Create your account</h1>
        <p className="hero-copy">Start with a calm workspace for transactions, budgets, goals, and recurring payments.</p>
      </div>
      <div className="auth-signup-grid">
        <div className="auth-signup-intro">
          <div className="auth-signup-feature">
            <strong>Track every rupee clearly</strong>
            <span>Record income and expenses quickly and review them in one place.</span>
          </div>
          <div className="auth-signup-feature">
            <strong>Stay ahead of budgets</strong>
            <span>See spending progress, recurring bills, and savings goals without extra friction.</span>
          </div>
          <div className="auth-signup-feature">
            <strong>Build steady habits</strong>
            <span>Create your account once and keep returning to a clear financial routine.</span>
          </div>
        </div>
        <div className="auth-signup-panel">
          <div className="auth-toggle">
            <button className="active" type="button">Sign up</button>
            <button onClick={() => onAuthModeChange("login")} type="button">Log in</button>
          </div>
          <form className="auth-form" onSubmit={onAuthSubmit}>
            <label>
              Display name
              <input required value={authForm.displayName} onChange={(event) => onAuthFormChange("displayName", event.target.value)} />
            </label>
            <label>
              Email
              <input required type="email" value={authForm.email} onChange={(event) => onAuthFormChange("email", event.target.value)} />
            </label>
            <label>
              Password
              <input required minLength="8" type="password" value={authForm.password} onChange={(event) => onAuthFormChange("password", event.target.value)} />
            </label>
            <div className="auth-password-hint">Use uppercase, lowercase, and a number.</div>
            <button type="submit">Create account</button>
          </form>
          {status ? <p className="status auth-status">{status}</p> : null}
        </div>
      </div>
    </section>
  );
}
