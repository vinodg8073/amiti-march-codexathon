# amiti-march-codexathon
Coding marathon to explore the new way of building software by collaborating with AI agents that helps to design, test by accelerating development and helps to focus on higher-level problem solving.

## Project Structure

- `week-1/personal-finance-web/`: React + Vite client for the Personal Finance Tracker UI
- `week-1/personal-finance-api/`: Spring Boot API for transactions and dashboard data
- `docs/memory-bank/`: shared product goals, V1 scope, and working context

## Current V1 Implementation

- A React dashboard scaffold with summary cards, quick transaction entry, category breakdown, recurring bills, and recent transaction history
- A Spring Boot API scaffold with `GET /api/dashboard`, `GET /api/transactions`, and `POST /api/transactions`
- Seed sample data in the API so the UI has realistic starter content

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

## Next Steps

- Replace the in-memory transaction service with PostgreSQL-backed persistence
- Add authentication and user accounts
- Add budget, savings-goal, and trend-chart modules

## Shared Project Memory

Project memory is maintained in [docs/memory-bank/README.md](/d:/Git/amiti-march-codexathon/docs/memory-bank/README.md).
Use it to track goals and the latest agreed project context.
