# Backend Architecture V1

Last updated: 2026-03-18

## Objective

Define the backend API surface, persistence schema, layer structure, and cross-cutting concerns for version 1 of the Personal Finance Tracker.

## API Specification

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`
- `GET /api/transactions/{id}`
- `PUT /api/transactions/{id}`
- `DELETE /api/transactions/{id}`

Sample create transaction request:

```json
{
  "type": "expense",
  "amount": 42.50,
  "date": "2026-03-13",
  "accountId": "uuid",
  "categoryId": "uuid",
  "merchant": "Grocery Mart",
  "note": "Weekly groceries",
  "tags": ["family", "weekly"]
}
```

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Accounts

- `GET /api/accounts`
- `POST /api/accounts`
- `PUT /api/accounts/{id}`
- `POST /api/accounts/transfer`

### Budgets

- `GET /api/budgets?month=3&year=2026`
- `POST /api/budgets`
- `PUT /api/budgets/{id}`
- `DELETE /api/budgets/{id}`

### Goals

- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/{id}`
- `POST /api/goals/{id}/contribute`
- `POST /api/goals/{id}/withdraw`

### Reports

- `GET /api/reports/category-spend`
- `GET /api/reports/income-vs-expense`
- `GET /api/reports/account-balance-trend`

### Recurring

- `GET /api/recurring`
- `POST /api/recurring`
- `PUT /api/recurring/{id}`
- `DELETE /api/recurring/{id}`

## PostgreSQL Schema

### Users

```sql
create table users (
  id uuid primary key,
  email varchar(255) unique not null,
  password_hash text not null,
  display_name varchar(120),
  created_at timestamp not null default now()
);
```

### Accounts

```sql
create table accounts (
  id uuid primary key,
  user_id uuid not null references users(id),
  name varchar(100) not null,
  type varchar(30) not null,
  opening_balance numeric(12,2) not null default 0,
  current_balance numeric(12,2) not null default 0,
  institution_name varchar(120),
  created_at timestamp not null default now()
);
```

### Categories

```sql
create table categories (
  id uuid primary key,
  user_id uuid references users(id),
  name varchar(100) not null,
  type varchar(20) not null,
  color varchar(20),
  icon varchar(50),
  is_archived boolean not null default false
);
```

### Transactions

```sql
create table transactions (
  id uuid primary key,
  user_id uuid not null references users(id),
  account_id uuid not null references accounts(id),
  category_id uuid references categories(id),
  type varchar(20) not null,
  amount numeric(12,2) not null,
  transaction_date date not null,
  merchant varchar(200),
  note text,
  payment_method varchar(50),
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
```

### Budgets

```sql
create table budgets (
  id uuid primary key,
  user_id uuid not null references users(id),
  category_id uuid not null references categories(id),
  month int not null,
  year int not null,
  amount numeric(12,2) not null,
  alert_threshold_percent int default 80
);
```

### Goals

```sql
create table goals (
  id uuid primary key,
  user_id uuid not null references users(id),
  name varchar(120) not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  target_date date,
  status varchar(30) not null default 'active'
);
```

### Recurring Transactions

```sql
create table recurring_transactions (
  id uuid primary key,
  user_id uuid not null references users(id),
  title varchar(120) not null,
  type varchar(20) not null,
  amount numeric(12,2) not null,
  category_id uuid references categories(id),
  account_id uuid references accounts(id),
  frequency varchar(20) not null,
  start_date date not null,
  end_date date,
  next_run_date date not null,
  auto_create_transaction boolean not null default true
);
```

## Backend Architecture

### Layers

- Controllers
- Application services
- Domain models
- Repository / data access layer
- PostgreSQL

### Suggested Structure

```text
/backend
  /Controllers
  /Services
  /DTOs
  /Entities
  /Repositories
  /Migrations
```

## Cross-Cutting Concerns

- Logging
- Validation
- Authentication middleware
- Exception handling middleware
- Background job for recurring transaction generation

## Security And Permissions

### Access Model

- The application uses single-user ownership for all finance records.
- Every backend query and mutation must be scoped by authenticated `userId`.
- A user must never be able to read, update, delete, or report on another user's records.
- Ownership checks must apply consistently across transactions, categories, accounts, budgets, goals, recurring items, and reports.

### Security Controls

- JWT access tokens are required for authenticated API access.
- Refresh tokens are required to support session continuation without frequent re-login.
- Passwords must be stored only as secure hashes and never in plain text.
- HTTPS should be enforced in deployed environments; local development may use HTTP only when required for local testing.
- Audit logs should be recorded for key money-impacting actions such as transaction create, update, delete, account transfer, goal contribution, and goal withdrawal.

### Backend Enforcement Guidance

- Auth middleware should resolve the current user from the access token and attach the user context to each request.
- Repository and service methods should accept `userId` as part of the query boundary rather than relying only on controller checks.
- Refresh tokens should be revocable and rotated according to the chosen implementation strategy.
- Audit logs should capture who performed the action, what changed, and when the change occurred.

## Notes

- This backend architecture should stay aligned with the documented product stack: Spring Boot plus PostgreSQL.
- The repository layer should use a Spring-friendly data access approach instead of EF Core.
- The API surface, schema, validation, authentication, permissions, and recurring-job requirements should remain stable as implementation details evolve.
