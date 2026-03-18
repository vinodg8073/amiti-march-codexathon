# UI / UX Design System V1

Last updated: 2026-03-18

## Design Principles

- Clean, calm, finance-friendly visual style
- Emphasis on clarity over decoration
- Fast data entry with minimal friction
- Strong hierarchy for numbers and charts

## Visual Style

- Primary color: Deep blue or indigo
- Success color: Green
- Warning color: Amber
- Danger color: Red
- Background: Light neutral gray
- Cards: White with subtle shadow

## Typography

- Heading: Inter or system sans
- Large numbers for financial summaries
- Small muted labels for metadata

## Core Components

- App shell with sidebar and topbar
- Summary cards
- Data tables
- Modal form for add/edit transaction
- Charts
- Progress bars
- Tabs
- Toast notifications
- Alert banners
- Empty states

## Detailed UI Flows

### Onboarding Flow

1. User lands on marketing/login page.
2. User clicks Sign Up.
3. User enters email, password, and name.
4. System validates input.
5. Account is created.
6. User is redirected to optional onboarding.
7. User creates first account, such as a bank account.
8. User optionally sets first monthly budget.
9. User lands on dashboard.

### Add Expense Flow

1. User clicks Add Transaction.
2. Modal opens with default type set to Expense.
3. User enters amount, date, account, category, and merchant.
4. User clicks Save.
5. Frontend validates required fields.
6. API stores transaction.
7. Account balance and dashboard widgets refresh.
8. Toast shown: `Transaction saved.`

### Create Budget Flow

1. User navigates to Budgets.
2. User clicks Set Budget.
3. User chooses category, month, and amount.
4. User saves budget.
5. Budget appears in list with progress bar.
6. Dashboard reflects updated budget summary.

### Goal Contribution Flow

1. User opens Goals.
2. User selects an existing goal.
3. User clicks Add Contribution.
4. User enters amount and source account.
5. API creates transaction and updates goal balance.
6. Progress bar and account balance refresh.

### Recurring Bill Flow

1. User opens Recurring.
2. User clicks New Recurring Item.
3. User enters title, amount, category, account, and frequency.
4. User saves recurring item.
5. Scheduler sets `nextRunDate`.
6. Dashboard upcoming bills widget shows new item.

### Reporting Flow

1. User opens Reports.
2. User selects date range and filters.
3. Frontend requests aggregated data from API.
4. Charts and tables update.
5. User optionally exports CSV.

## Notification Behavior

- Use in-app toasts for brief success and action feedback.
- Use in-app alert banners for warnings, thresholds, and time-sensitive reminders.
- Example alerts include budget usage thresholds, budget exceeded, upcoming recurring payments, goal reached, and transaction success feedback.

## Empty States

- No transactions yet: show a clear CTA to add the first transaction.
- No budgets yet: suggest budget creation.
- No goals yet: suggest goal setup.
- No report data: suggest expanding the date range.

## Error States

- API unavailable
- Unauthorized session expired
- Validation error on form submit
- Failed chart or report fetch

## Error And Recovery Guidance

- Empty states should feel encouraging and action-oriented, not broken.
- Error states should explain what happened and suggest the next step when possible.
- Session-expired states should guide the user back to authentication cleanly.
- Validation errors should appear near the relevant fields and also be understandable in form-level feedback.

## Design Guidance

- The app shell should feel stable and data-oriented across authenticated screens.
- Numeric summaries should be visually dominant on Dashboard and Reports.
- Data-entry interactions should minimize clicks and context switching.
- Responsive layouts should preserve clarity for charts, tables, and forms.
