# Information Architecture V1

Last updated: 2026-03-18

## Primary Objective

Design the Personal Finance Tracker so users can move through the core money-management flows with a clear, app-like navigation structure.

## Main Navigation

### Dashboard

Purpose: Give the user a one-screen financial summary.

#### Widgets

- Current month income
- Current month expense
- Net balance
- Budget progress cards
- Spending by category chart
- Income vs expense trend chart
- Recent transactions list
- Upcoming recurring payments
- Savings goal progress summary

#### Actions

- Add transaction
- View all transactions
- Create budget
- Add recurring bill
- Update goal contribution

#### Notes

- Dashboard is the default landing screen after login.
- Dashboard should summarize key financial health signals without requiring navigation into feature-specific pages.
- Widget layout should prioritize at-a-glance understanding first, then quick actions.

### Transactions

Purpose: Manage income and expense entries.

Expected content:
- Transaction list
- Add transaction flow
- Edit transaction flow
- Delete transaction action
- Filters by type, category, account, and date

#### Transaction Fields

- `id`
- `userId`
- `accountId`
- `type` (`income`, `expense`, `transfer`)
- `amount`
- `date`
- `categoryId`
- `note`
- `merchant`
- `paymentMethod`
- `recurringTransactionId` (optional)
- `tags`
- `createdAt`
- `updatedAt`

#### Features

- Create transaction
- Edit transaction
- Delete transaction
- Filter by date, category, amount, type, and account
- Search by merchant or note
- Bulk delete
- Bulk categorize
- Pagination or infinite scroll

#### Edge Cases

- Prevent negative amount input
- Support back-dated entries
- Transfer transactions affect two accounts

#### Notes

- Transaction records should support both UI presentation and reporting use cases.
- `recurringTransactionId` should be nullable for non-recurring entries.
- `tags` should support flexible labeling and filtering.
- Transfer transactions should be modeled so both source and destination account effects remain traceable.
- List performance should be considered from the start because pagination or infinite scroll is required.

### Categories

Purpose: Provide structured classification for income and expense transactions.

#### Default Categories

Expense:
- Food
- Rent
- Utilities
- Transport
- Entertainment
- Shopping
- Health
- Education
- Travel
- Subscriptions
- Miscellaneous

Income:
- Salary
- Freelance
- Bonus
- Investment
- Gift
- Refund
- Other

#### Features

- Add custom category
- Edit category icon and color
- Archive category
- Separate income and expense categories

#### Notes

- Categories should be clearly separated by transaction type.
- Default categories should be available out of the box for new users.
- Archived categories should remain traceable for historical transactions.
- Visual properties such as icon and color should support consistent reporting and transaction list display.

### Budgets

Purpose: Let the user plan and monitor category-based monthly budgets.

#### Budget Fields

- `id`
- `userId`
- `categoryId`
- `month`
- `year`
- `amount`
- `alertThresholdPercent`

#### Features

- Set monthly budget by category
- View budget versus actual spend
- Alert when 80%, 100%, 120% exceeded
- Duplicate last month budget

#### Notes

- Budgets should be scoped by category and month-year combination.
- Alert thresholds should support proactive warning and over-budget escalation.
- Duplicating the previous month should reduce repeated setup work for users with stable budgets.

### Goals

Purpose: Help the user define and track savings goals.

#### Goal Fields

- `id`
- `userId`
- `name`
- `targetAmount`
- `currentAmount`
- `targetDate`
- `linkedAccountId` (optional)
- `icon`
- `color`
- `status`

#### Features

- Create savings goal
- Add contribution
- Withdraw from goal
- Track progress
- Mark goal completed

#### Notes

- Goals should support both free-standing tracking and optional linking to an account.
- Progress should be derived from `currentAmount` relative to `targetAmount`.
- Goal status should make lifecycle state explicit, including active and completed behavior.
- Visual properties such as icon and color should support recognition in dashboards and goal lists.

### Reports

Purpose: Show trends and category insights over time.

#### Reports

- Monthly spending report
- Category breakdown
- Income versus expense trend
- Account balance trend
- Savings progress

#### Filters

- Date range
- Account
- Category
- Transaction type

#### Export

- CSV export
- PDF export

#### Notes

- Reporting should support both quick on-screen analysis and exportable summaries.
- Filters should apply consistently across report types where relevant.
- Export outputs should align with the currently applied filters.

### Recurring

Purpose: Manage bills, subscriptions, and upcoming recurring expenses.

#### Fields

- `id`
- `userId`
- `title`
- `type`
- `amount`
- `categoryId`
- `accountId`
- `frequency` (`daily`, `weekly`, `monthly`, `yearly`)
- `startDate`
- `endDate`
- `nextRunDate`
- `autoCreateTransaction` (`bool`)

#### Features

- Create subscription or recurring salary
- Show next due date
- Auto-generate transaction with scheduled job
- Pause recurring item
- Delete recurring item

#### Notes

- Recurring items should support both income and expense use cases.
- `nextRunDate` should drive reminders and automated transaction creation.
- Auto-generated transactions should preserve linkage back to the recurring source.
- Pause should stop future generation without deleting historical references.

### Accounts

Purpose: Organize transactions by funding source or payment source.

#### Account Types

- Bank account
- Credit card
- Cash wallet
- Savings account

#### Fields

- `id`
- `userId`
- `name`
- `type`
- `openingBalance`
- `currentBalance`
- `institutionName`
- `lastUpdatedAt`

#### Features

- Create account
- View balance by account
- Transfer funds between accounts

#### Notes

- Account balances should remain consistent with transaction history and transfers.
- Transfer flows should clearly identify source and destination accounts.
- `currentBalance` should reflect the latest derived or synchronized state.

### Settings

Purpose: Control user-specific preferences and account-level configuration.

Expected content:
- Profile settings
- Security settings
- Notification preferences
- App preferences

## Secondary Navigation / Utilities

### Global Add Transaction Button

Purpose: Let the user add a transaction from anywhere in the app.

### Search

Purpose: Quickly find transactions, accounts, goals, or recurring items.

### Date Range Picker

Purpose: Change the reporting and transaction time window across relevant views.

### Notifications

Purpose: Surface upcoming bills, goal reminders, or important finance alerts.

### User Profile Menu

Purpose: Give access to account actions such as profile, preferences, and sign out.

## Structural Notes

- Dashboard should act as the landing page after login.
- Main navigation should remain persistent across authenticated screens.
- Secondary utilities should be globally available in the authenticated shell.
- Detailed low-level screen designs can be layered under each navigation item later.
