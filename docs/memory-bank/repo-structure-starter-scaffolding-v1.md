# Repo Structure And Starter Scaffolding V1

Last updated: 2026-03-18

## Objective

Define the recommended repository structure and starter scaffolding layout for implementing the Personal Finance Tracker with a web application, a primary business API, and a lightweight support microservice.

## Top-Level Repository Structure

```text
/
  /docs
    /memory-bank
  /week-1
    /personal-finance-web
    /personal-finance-api
    /personal-finance-support-api
  /.github
    /workflows
  /.devcontainer
  /.infra
  /scripts
  /.env.example
  /README.md
```

## Purpose Of Top-Level Folders

- `docs/memory-bank`: living product, design, architecture, roadmap, and planning documents
- `week-1/personal-finance-web`: React web application
- `week-1/personal-finance-api`: Spring Boot business API
- `week-1/personal-finance-support-api`: Spring Boot support API for notifications and PDF/export workflows
- `.github/workflows`: CI workflows
- `.devcontainer`: optional development-container setup
- `.infra`: local deployment assets such as compose files, dashboards, sample configs, and later Helm charts
- `scripts`: helper scripts for setup, seed, formatting, and local automation

## Recommended Web Scaffolding

```text
/week-1/personal-finance-web
  /public
  /src
    /app
    /components
      /layout
      /feedback
      /forms
      /charts
      /tables
      /cards
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
    /styles
  /tests
  /package.json
  /vite.config.js
```

## Recommended Web Starter Files

```text
/src/app
  AppProviders.tsx
  AppRouter.tsx
  QueryClient.ts
  routes.tsx

/src/services
  apiClient.ts
  authService.ts

/src/store
  uiStore.ts
  sessionStore.ts

/src/components/layout
  AppShell.tsx
  Sidebar.tsx
  Topbar.tsx

/src/components/feedback
  EmptyState.tsx
  ErrorState.tsx
  ToastHost.tsx
  AlertBanner.tsx
```

## Recommended Business API Scaffolding

```text
/week-1/personal-finance-api
  /src/main/java/com/personalfinance
    /config
    /common
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
  /src/main/resources
    /db
      /migration
    application.yml
    application-local.yml
    application-dev.yml
  /src/test
  /pom.xml
```

## Recommended API Starter Files

```text
/config
  SecurityConfig.java
  JwtConfig.java
  WebConfig.java

/common
  ApiExceptionHandler.java
  ApiErrorResponse.java
  CurrentUser.java
  CurrentUserArgumentResolver.java

/auth
  AuthController.java
  AuthService.java
  JwtTokenService.java
  PasswordPolicyValidator.java

/audit
  AuditLogService.java
  AuditLogEntity.java

/recurring
  RecurringScheduler.java
```

## Database And Migration Scaffolding

```text
/src/main/resources/db/migration
  V1__initial_schema.sql
  V2__seed_default_categories.sql
  V3__add_refresh_tokens.sql
  V4__add_audit_logs.sql
```

## Infrastructure Scaffolding

```text
/.infra
  /compose
    docker-compose.local.yml
  /grafana
    /dashboards
    /datasources
  /prometheus
    prometheus.yml
  /loki
    config.yml
  /helm
    /personal-finance
```

## Scripts Scaffolding

```text
/scripts
  setup-local.ps1
  start-local.ps1
  seed-dev-data.ps1
  run-tests.ps1
```

## Starter Build Sequence

1. Create the app shell and routing in the web app.
2. Create the Spring Boot module packages and shared config classes.
3. Add migration support and initial schema.
4. Wire database, auth config, and API client.
5. Add feature folders without full logic first.
6. Build feature slices incrementally.

## Initial Scaffolding Priorities

### Web

- router and providers
- auth pages
- protected layout shell
- shared feedback components
- API client and token handling

### API

- security config
- auth module skeleton
- exception handling
- migration support
- health endpoint
- module packages and DTO patterns

### Infra

- local PostgreSQL container
- optional combined local compose setup
- env examples for web and API

## Naming And Organization Rules

- group code by business module first
- keep shared UI truly reusable before placing it in `components`
- do not mix user-facing feature code into generic utility folders too early
- keep backend modules aligned with frontend feature names where practical
- avoid premature microservice-style fragmentation inside the monolith

## Future Expansion Path

- add `notifications` and `exports` submodules when those become more complex
- add Helm chart assets only when deployment maturity justifies them
- add separate worker process only when recurring jobs or exports need isolation


## Recommended Support API Scaffolding

```text
/week-1/personal-finance-support-api
  /src/main/java/com/personalfinance/support
    /config
    /common
    /document
    /notification
    /health
  /src/main/resources
    application.yml
  /src/test
  /pom.xml
```

## Updated Organization Rule

- use two services only where there is a clear operational boundary: business workflows in the main API and async/support workflows in the support API
