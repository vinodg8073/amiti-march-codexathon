import { getInitials } from "../../features/workspace/workspaceShared";

export default function DashboardNav({ currentPage, onLogout, onNavigate, onOpenAddTransaction, user }) {
  const navItems = ["Dashboard", "Transactions", "Budgets", "Goals", "Reports", "Recurring", "Accounts", "Settings"];

  return (
    <header className="dashboard-nav">
      <div className="dashboard-brand">Logo</div>
      <nav className="dashboard-nav-links" aria-label="Primary navigation">
        {navItems.map((item) => (
          <button
            key={item}
            className={item === currentPage ? "dashboard-nav-link active" : "dashboard-nav-link"}
            onClick={() => onNavigate(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="dashboard-nav-tools">
        <button className="secondary-button" onClick={onOpenAddTransaction} type="button">Add Transaction</button>
        <label className="dashboard-search">
          <span className="sr-only">Search</span>
          <input placeholder="Search" type="search" />
        </label>
        <button className="dashboard-profile" onClick={onLogout} type="button">
          <span className="dashboard-profile-avatar">{getInitials(user.displayName || user.email)}</span>
          <span>{user.displayName || "Profile"}</span>
        </button>
      </div>
    </header>
  );
}
