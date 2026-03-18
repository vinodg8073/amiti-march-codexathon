# Frontend Architecture V1

Last updated: 2026-03-18

## Objective

Define a scalable React frontend structure for the Personal Finance Tracker that supports modular feature growth, clear ownership, and maintainable state management.

## Suggested React Structure

```text
/frontend/src
  /components
  /pages
  /features
    /auth
    /transactions
    /budgets
    /goals
    /reports
  /services
  /hooks
  /store
  /types
  /utils
```

## Structure Guidance

- `components`: shared presentational components used across multiple features
- `pages`: route-level screens and page composition
- `features`: domain-specific UI, logic, forms, and state slices grouped by feature
- `services`: API clients, request utilities, and backend integration helpers
- `hooks`: reusable React hooks
- `store`: app-wide client state and shared UI state
- `types`: shared TypeScript types or domain model contracts
- `utils`: formatting, parsing, validation helpers, and general utilities

## Recommended Libraries

Preferred baseline:
- React Router for routing
- TanStack Query for server-state fetching and caching
- Zustand or Redux Toolkit for client-side app state
- React Hook Form for form handling
- Zod for schema validation
- Recharts for charts
- Axios for API communication

## Library Selection Guidance

- The recommended libraries are a solid baseline, but the final implementation can use stronger alternatives if they better fit the app’s needs.
- Favor widely adopted, actively maintained libraries with strong ecosystem support.
- Keep the stack cohesive: avoid overlapping tools unless there is a clear reason.

## State Management Guidelines

### Server State

Use TanStack Query for:
- Transactions
- Budgets
- Dashboard summary
- Goals
- Reports

### Local UI State

Use Zustand or component state for:
- Modal open and close state
- Active filters
- Selected date range
- Table sorting

## Frontend Architecture Principles

- Organize by feature first when business logic grows.
- Keep route composition in `pages` and reusable primitives in `components`.
- Separate server state from local UI state.
- Centralize API interaction patterns for auth, error handling, and retries.
- Validate forms consistently on the client and align with server-side validation.
- Design for responsive layouts and accessibility from the beginning.

## Expected Feature Mapping

- `features/auth`: login, sign up, forgot password, reset password, session handling
- `features/transactions`: transaction list, filters, modal forms, bulk actions
- `features/budgets`: budget setup, progress cards, threshold indicators
- `features/goals`: goal list, contribution flow, withdrawal flow, progress UI
- `features/reports`: filters, charts, export actions, analytics summaries

## Notes

- If the codebase adopts TypeScript later, `types` should become a first-class contract layer between frontend features and backend responses.
- If charts or tables become more advanced, feature-local subfolders can hold specialized components instead of overloading shared `components`.
- The app shell, sidebar, topbar, and navigation state may live in shared `components`, `pages`, and `store` together depending on implementation needs.
