# amiti-march-codexathon
Coding marathon to explore the new way of building software by collaborating with AI agents that helps to design, test by accelerating development and helps to focus on higher-level problem solving.

## Project Structure

- `week-1/personal-finance-web/`: React + Vite web app with route-based auth and workspace flows for transactions, budgets, reporting, goals, and recurring payments
- `week-1/personal-finance-api/`: Spring Boot business API serving authenticated finance workflows with in-memory user workspaces
- `week-1/personal-finance-support-api/`: Spring Boot support service for document-generation and notification workflows
- `docs/memory-bank/`: shared product goals, V1 scope, and working context

## Week 1 Scope Implemented

- Authentication: sign up, log in, restore signed-in session, and log out
- Transactions: add, edit, delete, categorize, and tag by account
- Budgeting: set monthly budgets by category and review over/under status
- Reporting: review spending trends, top spending categories, and trigger support-service PDF export preview
- Goals: create savings goals and add progress contributions
- Recurring Payments: create recurring bills and view upcoming expenses
- Support Workflows: trigger support-service notification preview from Settings

## End-to-End Flow

1. Start the business API.
2. Start the support API.
3. Start the web app.
4. Sign up with email and password.
5. Add accounts, transactions, budgets, goals, and recurring payments.
6. Review reporting and budget status on the dashboard.
7. Use the support service for future PDF export and notification workflows.
8. Log out and back in to restore the active in-memory session token in the browser.

## Local Startup

API:

```bash
cd week-1/personal-finance-api
mvn spring-boot:run
```

Support API:

```bash
cd week-1/personal-finance-support-api
mvn spring-boot:run
```

Web:

```bash
cd week-1/personal-finance-web
npm install
npm run dev
```

The web app proxies `/api` requests to `http://localhost:8080`. The support service is prepared on `http://localhost:8081` for document and notification endpoints.

## Current Limitations

- Data is stored in memory, so restarting the API resets users and finance data.
- Authentication now has a signed access-token plus refresh-token foundation with client-side refresh handling, but it is still in-memory and not production-ready.
- PostgreSQL persistence, server-side refresh-token persistence, and full Spring Security middleware are still pending.

## Shared Project Memory

Project memory is maintained in [docs/memory-bank/README.md](/d:/Git/amiti-march-codexathon/docs/memory-bank/README.md).
Use it to track goals and the latest agreed project context.
