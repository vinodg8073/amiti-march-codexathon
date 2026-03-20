# Current Context

Last updated: 2026-03-20

## Current Understanding

- The repository contains a `week-1` delivery folder and a shared memory-bank folder.
- Version 1 is defined as a Personal Finance Tracker web application.
- Week 1 now includes end-to-end in-memory flows for authentication, transactions, budgeting, reporting, savings goals, and recurring payments.
- The React web app stores the session token in the browser so a logged-in user stays signed in between reloads while the API remains running.
- The Spring Boot API keeps each user's finance workspace in memory, which is suitable for prototyping but not for persistence.
- The V1 information architecture now includes a main navigation model: Dashboard, Transactions, Categories, Budgets, Goals, Reports, Recurring, Accounts, and Settings.
- The Dashboard definition is now more detailed and includes required widgets for summary, budgets, charts, transactions, recurring items, and savings goals.
- The Dashboard also includes key shortcut actions: Add Transaction, View All Transactions, Create Budget, Add Recurring Bill, and Update Goal Contribution.
- The Transactions module now includes low-level fields, user-facing features such as filtering, search, bulk actions, and list loading, plus edge-case behavior for negative inputs, back-dated entries, and transfers across two accounts.
- The Categories module now defines default income and expense categories, category customization, archiving, and type separation.
- The Budgets module now defines budget fields, monthly category budgets, threshold alerts at 80%, 100%, and 120%, plus duplicate-last-month support.
- The Goals module now defines goal fields, optional linked accounts, contribution and withdrawal actions, progress tracking, and completed status.
- The Reports module now defines report types, report filters, and export options for CSV and PDF.
- The Recurring module now defines recurring transaction fields, frequency options, scheduled auto-generation, next-run tracking, and pause/delete behavior.
- The Accounts module now defines account types, account fields, balance visibility, and transfer support between accounts.
- Validation rules are now explicitly captured for transactions, budgets, and goals, and should be enforced in both frontend forms and backend validation.
- Notifications and alerts are now explicitly captured, including budget threshold alerts, budget exceeded, upcoming recurring payments, goal reached, and transaction success feedback.
- Notification channels in V1 are in-app toasts and in-app alert banners.
- Empty states and error states are now explicitly captured, including first-use CTAs, no-data guidance, API failures, session expiration, validation errors, and report-fetch failures.
- Non-functional requirements are now explicitly captured and should guide implementation: performance, security, reliability, accessibility, and responsiveness.
- UI / UX design system requirements are now explicitly captured, including visual style, component expectations, detailed flows, notification behavior, empty states, and error states.
- Frontend architecture guidance is now explicitly captured, including a feature-oriented React structure, recommended libraries, and an explicit split between server state and local UI state.
- Server state should use TanStack Query for transactions, budgets, dashboard summary, goals, and reports.
- Local UI state should use Zustand or component state for modal visibility, filters, selected date range, and table sorting.
- Backend architecture guidance is now explicitly captured, including API endpoints, PostgreSQL schema, Spring-aligned layers, repositories, migrations, cross-cutting concerns, and security boundaries.
- The backend architecture is now aligned to the Spring Boot direction and no longer references EF Core.
- Security and permissions are now explicitly defined: single-user ownership, backend query scoping by authenticated `userId`, JWT access tokens, refresh tokens, secure password hashing, HTTPS-first deployment behavior, and audit logs for key money-impacting actions.
- Acceptance criteria are now explicitly captured for Dashboard, Transactions, Budgets, Goals, and Reports so they can be used later as a functional definition of done.
- High-level and low-level design documents are now captured to guide both system design and implementation-level structure.
- The current technical direction is now a pragmatic two-service baseline: a primary business API plus a lightweight support service for document-generation and notification workflows, while keeping each service modular internally.
- Implementation roadmap and repo scaffolding guidance are now captured to support actual build sequencing and starter project structure.
- Platform options are now explicitly captured for Docker or Podman, Kubernetes plus Helm, Grafana-based observability, Keycloak or app-managed identity, and future deployment to Azure, AWS, or other platforms.
- Future enhancements are now captured separately so they stay visible without expanding current V1 scope: bank sync, receipt scanning, AI categorization suggestions, shared household budgets, mobile app, push notifications, and multi-currency support.
- The global authenticated shell should also support secondary utilities: Add Transaction, Search, Date Range Picker, Notifications, and User Profile Menu.
- Authentication now has a more detailed V1 scope including display name, forgot password, reset password, JWT-based authentication, refresh token support, and stronger validation rules.
- The authentication implementation now includes signed access tokens, refresh-token rotation endpoints, bcrypt-based password hashing, and frontend token refresh handling, but it still lacks persistent token storage, password-recovery email infrastructure, and full Spring Security middleware.
- Phase 0 and the opening Phase 1 implementation work have now started in code: the web app has been reshaped into an `app` plus `pages` plus `services` starter structure, and the API now has explicit auth service and structured API error response foundations.
- The current auth prototype now captures display name during signup, returns display name in session responses, and enforces stronger signup password validation at the API boundary.
- The web app now includes a designed forgot-password screen in the auth flow, using a placeholder reset-request response until the real email flow is implemented.
- The authenticated shell now supports page switching between Dashboard and Transactions, and the Transactions page now follows the current wireframe with filters, table view, and add/edit transaction form.
- The authenticated shell now also includes a Budgets page with progress rows and a Set Budget flow wired to the current budget API shape.
- The authenticated shell now also includes a Savings Goals page with progress rows and an Add Goal flow wired to the current goal API shape.
- The authenticated shell now also includes a Reports page with date/account/type filters, category-spend summary, income-vs-expense trend view, and top-category summary derived from current transaction data.
- The authenticated shell now also includes self-designed Recurring, Accounts, and Settings pages so all planned primary navigation items have a working UI destination.
- Add Transaction is now implemented as a reusable modal flow from both the global header action and the Transactions page, based on the provided wireframe.
- The frontend is now being reorganized into page-level and feature-level modules instead of one large screen file, following a more standard SDLC-oriented structure.
- The web app now uses route-based navigation with dedicated auth routes and `/app/...` workspace routes instead of local page-switch state alone, moving it closer to a protected-shell architecture.
- A second Spring Boot service now exists as `personal-finance-support-api` to prepare PDF/export and notification capabilities as a separate operational concern from core finance business logic.
- The web app now proxies support-service requests separately and includes initial UI hooks for PDF export from Reports and a test notification action from Settings.
- Transfer is visible in the Add Transaction modal UI, but backend support for true two-account transfer posting is still pending.




## Working Agreement

- The agent should update this memory bank as goals or shared understanding change.
- Version-specific scope should be captured in a product-spec document.
- Navigation and screen structure should be captured in an information architecture document.
- Focused feature areas such as authentication can be captured in dedicated spec documents.
- Implementation constraints should be captured in non-functional requirements and treated as build requirements.
- UI / UX rules and interaction flows should be captured in the design-system document and treated as implementation guidance.
- Frontend code organization and library decisions should be captured in the frontend architecture document.
- Backend API, schema, and layer decisions should be captured in the backend architecture document.
- Validation rules should be captured explicitly and enforced in both frontend and backend layers.
- Delivery folders such as `week-1` should reflect implemented slices of work.
- Security boundaries should be treated as architecture rules, especially user-scoped data access and auditability for money-impacting actions.
- Acceptance criteria should be treated as the working functional definition of done until detailed test cases are created.
- Future enhancements should be tracked separately from active V1 commitments unless they are explicitly promoted into scope.
- High-level and low-level design docs should be used as the primary reference when moving from requirements into code structure.
- Roadmap and scaffolding docs should guide implementation sequencing before major code generation begins.

## Open Questions

- Should display name appear in the top header, profile menu, or both?
- Should forgot-password and reset-password be part of week 1, or should they be scheduled for the next slice with email infrastructure?
- Should week 2 focus first on JWT plus refresh tokens or PostgreSQL persistence?
- Should the Dashboard use cards plus chart grid, or a more analytics-heavy layout with a wider reporting area?
- Should `tags` be stored as free text labels, or normalized into a separate tag model later?
- Should transaction lists use classic pagination first or infinite scroll first in the initial implementation?
- Should Categories be its own visible navigation item or remain managed within Transactions and Settings flows?
- Should `currentBalance` be stored directly, derived from transactions, or supported by both strategies?
- Should `alertThresholdPercent` allow multiple configured thresholds later, or stay single-field with default milestone alerts?
- Should goal withdrawals create related transactions automatically when a goal is linked to an account?
- Should paused recurring items retain their `nextRunDate`, or recalculate it when resumed?
- Should PDF export be generated server-side, client-side, or support both in later phases?
- Should the frontend start with TypeScript immediately or phase it in after the initial feature structure is stable?
- When production deployment begins, should the first target environment be Azure, AWS, or a lighter platform for early rollout?
- Should identity stay app-managed for V1, or should Keycloak be introduced before production hardening?





