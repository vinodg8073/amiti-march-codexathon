# Low-Level Design V1

Last updated: 2026-03-18

## Objective

Define the low-level implementation view for the Personal Finance Tracker so design decisions can translate into concrete frontend, backend, data, and runtime components.

## Recommended Codebase Shape

```text
/week-1
  /personal-finance-web
  /personal-finance-api
/docs/memory-bank
```

## Frontend Low-Level Design

### Suggested Source Structure

```text
/src
  /app
  /components
  /pages
  /features
    /auth
    /dashboard
    /transactions
    /categories
    /accounts
    /budgets
    /goals
    /reports
    /recurring
    /settings
  /services
  /hooks
  /store
  /types
  /utils
```

### Frontend Responsibilities

- `app`: app bootstrap, router, providers, query client, auth/session bootstrapping
- `components`: reusable UI such as cards, tables, modals, toasts, banners, charts, layout primitives
- `pages`: route-level screen composition
- `features/*`: feature-local forms, queries, mutations, tables, charts, and actions
- `services`: Axios instance, auth token handling, API methods
- `store`: local UI state such as modal state, filters, and navigation state
- `types`: DTO and domain contracts
- `utils`: formatting, date helpers, chart transforms, validation helpers

### Frontend Route Model

- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/dashboard`
- `/transactions`
- `/budgets`
- `/goals`
- `/reports`
- `/recurring`
- `/accounts`
- `/settings`

### Frontend State Model

#### Server State

Use TanStack Query for:
- dashboard summary
- transactions and filters
- budgets
- goals
- recurring items
- reports
- accounts
- categories

#### Local UI State

Use Zustand or component state for:
- active modals
- table sorting
- selected date range
- active search text
- selected filters
- side navigation collapse state
- notification drawer state

### Frontend Component Patterns

- App shell with sidebar and topbar
- Summary cards for KPI-style values
- Feature tables with filters and empty states
- Modal form for add and edit transaction
- Charts for category spend, trend lines, and balance history
- Progress bars for budgets and goals
- Toasts for success feedback
- Alert banners for warnings and persistent notices

## Backend Low-Level Design

### Suggested Package Structure

```text
/src/main/java/com/personalfinance
  /config
  /auth
  /dashboard
  /transaction
  /category
  /account
  /budget
  /goal
  /report
  /recurring
  /notification
  /audit
  /common
```

### Per-Module Internal Pattern

```text
/module
  Controller
  Service
  Repository
  Entity
  Dto
  Mapper
  Validator
```

### Request Flow

1. Request enters through security and exception middleware.
2. JWT is validated and authenticated user context is resolved.
3. Controller receives request DTO.
4. Validation layer enforces business rules.
5. Service executes business logic and transaction boundaries.
6. Repository loads or persists user-scoped records.
7. Response DTO is returned.
8. Audit log is recorded for key financial changes.

## Core Domain Components

### Auth

Responsibilities:
- register user
- login user
- issue access token
- issue or rotate refresh token
- forgot password initiation
- reset password processing

Recommended internals:
- password hasher
- token service
- refresh token store
- email adapter interface for password recovery

### Dashboard

Responsibilities:
- current month income summary
- current month expense summary
- net balance summary
- budget progress summary
- category spend aggregation
- income versus expense trend aggregation
- recent transactions
- upcoming recurring payments
- goal progress summary

### Transactions

Responsibilities:
- create, update, delete, fetch, filter, search, paginate
- transfer handling across accounts
- recurring linkage support
- balance updates and audit events

### Categories

Responsibilities:
- seed default categories
- create custom category
- archive category
- maintain income versus expense separation

### Accounts

Responsibilities:
- create account
- fetch balances
- transfer between accounts
- keep balance changes transaction-safe

### Budgets

Responsibilities:
- enforce one budget per category per month per user
- compare budget and actual spend
- evaluate threshold states at 80%, 100%, and 120%
- duplicate previous month budget

### Goals

Responsibilities:
- create goal
- contribute to goal
- withdraw from goal
- compute progress percentage
- optionally coordinate with linked account balance

### Reports

Responsibilities:
- category spend aggregation
- income versus expense trend aggregation
- account balance trend aggregation
- export filtered results to CSV and later PDF

### Recurring

Responsibilities:
- create recurring definition
- update next run date
- pause or delete recurring item
- auto-generate transactions from schedules

### Audit

Responsibilities:
- persist key money-impacting events
- capture actor, action, target, timestamp, and summary of change

## Data Design Notes

### Additional Tables To Consider

These are not yet in the base schema but are strong implementation candidates:
- `refresh_tokens`
- `audit_logs`
- `goal_transactions` or contribution history table
- `transaction_tags` and `tags` if tag normalization is later required

### Indexing Guidance

Add indexes for:
- `transactions(user_id, transaction_date)`
- `transactions(user_id, category_id)`
- `transactions(user_id, account_id)`
- `budgets(user_id, month, year)`
- `goals(user_id, status)`
- `recurring_transactions(user_id, next_run_date)`

### Integrity Guidance

- Use database constraints for uniqueness and required ownership where possible.
- Enforce one budget per category per month per user with a unique constraint.
- Keep transfers atomic so both account balances succeed or fail together.
- Keep recurring generation idempotent to avoid duplicate transactions.

## Security Design Notes

- Every repository query must be user-scoped.
- Controllers should never accept trustable `userId` from the client for ownership decisions.
- Passwords must be hashed with bcrypt or Argon2.
- Access tokens should be short-lived.
- Refresh tokens should support revocation.
- Sensitive actions should write audit events.

## Scheduler Design

### Recurring Transaction Job

Inputs:
- active recurring records with `next_run_date <= today`

Steps:
1. load eligible recurring items
2. create linked transaction if auto-create is enabled
3. update related account balance if needed
4. compute next run date
5. persist audit event
6. mark job result and continue safely on partial failure

## Deployment Design Notes

### Container Assets

- frontend container
- backend container
- PostgreSQL container for local and non-managed environments

### Config Strategy

Use environment variables for:
- database connection
- JWT secrets or signing keys
- refresh token settings
- SMTP or email adapter settings
- observability endpoints
- feature flags

### Secrets Strategy

- Local: `.env` or container secrets for development only
- Cloud: managed secret stores on Azure or AWS

## Testing Design Notes

- Unit tests for business rules and validators
- Repository tests for user-scoped data access
- API integration tests for auth and finance flows
- Frontend component and form tests
- End-to-end tests for login, add transaction, budget update, goal contribution, and reporting filter flows

## Recommended Implementation Order

1. Auth and user-scoped security foundation
2. Accounts and categories
3. Transactions with balance updates
4. Dashboard aggregation
5. Budgets
6. Goals
7. Recurring scheduler
8. Reports and export
9. Observability and deployment hardening
