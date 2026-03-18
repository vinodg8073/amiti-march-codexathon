# High-Level Design V1

Last updated: 2026-03-18

## Objective

Define the high-level solution design for the Personal Finance Tracker based on the approved product scope, architecture guidance, and non-functional requirements.

## Recommended Architecture Direction

- Start V1 as a modular monolith.
- Keep clear module boundaries so the system can evolve into microservices later if scale or team structure requires it.
- Use React for the web client, Spring Boot for backend services, and PostgreSQL for primary persistence.

## Why Modular Monolith First

- Faster delivery for V1 with less operational complexity.
- Easier local development and debugging.
- Simpler transactional consistency for money-impacting operations.
- Lower infrastructure cost while the product and data model stabilize.
- Preserves the option to extract services later around auth, reporting, notifications, or recurring scheduling.

## System Context

### Primary User Journey

1. User signs up or logs in.
2. User enters or reviews accounts, transactions, budgets, goals, and recurring items.
3. Backend validates, stores, and returns user-scoped financial data.
4. Dashboard and reports aggregate the latest information into summaries and charts.
5. Notifications surface budget thresholds, recurring reminders, and goal milestones.

### Core Actors

- End user
- Web frontend
- Backend API
- PostgreSQL database
- Background scheduler
- Optional identity provider
- Optional observability stack
- Optional cloud platform services

## Logical Architecture

### Frontend Layer

- React single-page application
- App shell with sidebar, topbar, utilities, and feature routes
- TanStack Query for server state
- Zustand or component state for local UI state
- React Hook Form and Zod for form workflows and validation alignment

### Backend Layer

- Spring Boot application
- Controller, service, domain, repository, and background-job layers
- JWT-based auth with refresh token support
- User-scoped access enforcement on every query and mutation
- Server-side validation and consistent exception handling

### Data Layer

- PostgreSQL as system of record
- Transaction-safe updates for balances, transfers, budgets, and goals
- Schema centered around users, accounts, categories, transactions, budgets, goals, and recurring transactions

### Background Processing

- Scheduled job for recurring transaction generation
- Alert evaluation for budget thresholds and upcoming recurring items
- Optional future async workers for exports, notifications, and integrations

## Functional Modules

- Authentication and session management
- Dashboard aggregation
- Transactions
- Categories
- Accounts
- Budgets
- Goals
- Reports
- Recurring transactions
- Notifications and alerts
- Settings

## Cross-Cutting Concerns

### Security

- JWT access tokens
- Refresh tokens
- Password hashing
- User-scoped authorization
- Audit logging for money-impacting actions
- HTTPS-first deployment posture

### Reliability

- Transaction-safe balance updates
- Daily backups
- Idempotent scheduled recurring processing where possible
- Controlled error handling and recoverable failure states

### Performance

- Dashboard target under 2 seconds for normal users
- Pagination for large transaction sets
- Query patterns optimized for date ranges, category summaries, and dashboard widgets

### Accessibility And Responsiveness

- Keyboard navigable UI
- WCAG AA contrast targets
- Labeled forms and chart summaries
- Desktop, tablet, and mobile responsive layouts

## Deployment And Runtime Options

### Local Development

- Frontend and backend can run directly on the host machine for fast iteration.
- Docker or Podman can be used to standardize local dependencies such as PostgreSQL.
- Local orchestration can stay simple until multiple services are introduced.

### Containerization

- Docker is the most common baseline and easiest for broad ecosystem support.
- Podman is a strong free alternative, especially if daemonless workflows are preferred.
- Container images should be compatible with either runtime where possible.

### Orchestration

- Kubernetes plus Helm is a valid later-stage option once the system needs stronger deployment standardization, multi-service orchestration, or cloud portability.
- For early V1, Kubernetes is optional and may be unnecessary operational overhead.

## Identity Options

### Recommended V1

- Use Spring Security with application-managed users, hashed passwords, JWT access tokens, and refresh tokens.

### Optional External Identity

- Keycloak is a strong free and open-source option if centralized identity management, role support, or federated login is needed later.
- It is better introduced when auth requirements outgrow simple app-managed identity.

## Observability Options

### Recommended Open-Source Baseline

- OpenTelemetry for instrumentation
- Prometheus for metrics
- Grafana for dashboards
- Loki for logs
- Tempo or Jaeger for traces

### V1 Practical Guidance

- Start with structured application logs, request metrics, database metrics, and a few business metrics.
- Add tracing when multiple services or complex async flows are introduced.

## Cloud Deployment Flexibility

### Azure

- Good fit for App Service, Container Apps, AKS, Azure Database for PostgreSQL, and Azure Monitor.

### AWS

- Good fit for ECS or EKS, RDS PostgreSQL, CloudWatch, and managed networking/security services.

### Principle

- Keep the app cloud-agnostic through containers, environment-based configuration, and externalized secrets.
- Avoid hardwiring deployment assumptions into the application design.

## Recommended V1 Path

1. Build and stabilize V1 as a modular monolith.
2. Containerize frontend, backend, and PostgreSQL for repeatable local and CI environments.
3. Add basic observability and audit logging early.
4. Keep Kubernetes, Helm, Keycloak, and microservice extraction as planned expansion options rather than mandatory V1 complexity.

## Evolution Path

- Phase 1: Modular monolith with PostgreSQL and simple container-based local setup
- Phase 2: Add production-grade observability, backup automation, and hardened auth flows
- Phase 3: Introduce Helm and Kubernetes if deployment complexity justifies it
- Phase 4: Extract selected services only when clear scaling or ownership boundaries emerge
