# amiti-march-codexathon
Coding marathon to explore the new way of building software by collaborating with AI agents that helps to design, test by accelerating development and helps to focus on higher-level problem solving.

## Project Structure

- `week-1/personal-finance-web/`: React + Vite web app for authentication, transactions, budgets, reporting, goals, and recurring payments
- `week-1/personal-finance-api/`: Spring Boot API serving authenticated finance workflows with in-memory user workspaces
- `docs/memory-bank/`: shared product goals, V1 scope, and working context

## Week 1 Scope Implemented

- Authentication: sign up, log in, restore signed-in session, and log out
- Transactions: add, edit, delete, categorize, and tag by account
- Budgeting: set monthly budgets by category and review over/under status
- Reporting: review spending trends and top spending categories
- Goals: create savings goals and add progress contributions
- Recurring Payments: create recurring bills and view upcoming expenses

## End-to-End Flow

1. Start the API.
2. Start the web app.
3. Sign up with email and password.
4. Add accounts, transactions, budgets, goals, and recurring payments.
5. Review reporting and budget status on the dashboard.
6. Log out and back in to restore the active in-memory session token in the browser.

## Local Startup

API:

```bash
cd week-1/personal-finance-api
mvn spring-boot:run
```

Web:

```bash
cd week-1/personal-finance-web
npm install
npm run dev
```

The web app proxies `/api` requests to `http://localhost:8080`.

## Current Limitations

- Data is stored in memory, so restarting the API resets users and finance data.
- Authentication uses a simple session token prototype and is not production-ready.
- PostgreSQL persistence and proper password hashing are still pending.

## Shared Project Memory

Project memory is maintained in [docs/memory-bank/README.md](/d:/Git/amiti-march-codexathon/docs/memory-bank/README.md).
Use it to track goals and the latest agreed project context.
