# Platform And Deployment Options

Last updated: 2026-03-18

## Objective

Capture practical platform and infrastructure options for building, running, observing, securing, and deploying the Personal Finance Tracker with free or low-cost building blocks.

## Architecture Style Options

### Option 1: Modular Monolith

Best for:
- V1 delivery
- small team ownership
- lower ops overhead
- simpler transaction consistency

Pros:
- fastest path to working product
- easier testing and debugging
- easier local setup
- fewer deployment units

Cons:
- less independent scaling by module
- future extraction requires discipline

### Option 2: Microservices

Best for:
- larger team boundaries
- independent deployment needs
- high-scale modules or integrations

Pros:
- service-level scaling
- independent releases
- clearer operational ownership per service

Cons:
- much higher complexity
- distributed tracing becomes necessary
- harder transaction and consistency handling
- more infrastructure required from day one

### Recommendation

- Use modular monolith for V1.
- Design module boundaries cleanly enough to allow future service extraction.

## Container Runtime Options

### Docker

Pros:
- most common ecosystem support
- easiest onboarding and documentation availability
- broad CI/CD compatibility

### Podman

Pros:
- free and daemonless
- strong security posture
- compatible with many container workflows

### Recommendation

- Support either Docker or Podman.
- Keep `Containerfile` or `Dockerfile` assets runtime-neutral where possible.

## Orchestration Options

### Simple Local Orchestration

Use for V1:
- Compose-style local orchestration for frontend, backend, database, and observability stack

### Kubernetes Plus Helm

Use when:
- multiple services are introduced
- environment parity matters more
- team needs repeatable cloud-native deployment patterns

Recommendation:
- Not required for first implementation.
- Worth introducing later if the deployment model becomes multi-service or multi-environment heavy.

## Identity And User Management Options

### App-Managed Auth With Spring Security

Pros:
- simplest V1 path
- full control over flows
- aligns well with current specs

Cons:
- more custom auth work to maintain

### Keycloak

Pros:
- free and open source
- strong user management features
- supports tokens, sessions, realms, roles, and identity federation

Cons:
- extra service to run and manage
- heavier than needed for simple V1 auth

### Other Free-Friendly Options

- Authentik: open-source identity provider option
- Zitadel: modern identity platform with self-host options

### Recommendation

- Start with Spring Security plus app-managed auth for V1.
- Revisit Keycloak or another identity provider when auth complexity grows.

## Observability Options

### Recommended Open-Source Stack

- OpenTelemetry for instrumentation
- Prometheus for metrics
- Grafana for dashboards
- Loki for logs
- Tempo or Jaeger for tracing

### Minimal V1 Baseline

- structured logs
- request latency and error metrics
- database health metrics
- recurring-job success and failure metrics
- key dashboard and auth API metrics

## Deployment Platform Options

### Azure

Good fits:
- Azure App Service
- Azure Container Apps
- Azure Kubernetes Service
- Azure Database for PostgreSQL
- Azure Monitor and Application Insights
- Azure Key Vault

### AWS

Good fits:
- ECS Fargate
- EKS
- RDS for PostgreSQL
- CloudWatch
- Secrets Manager
- S3 for exported reports or backups

### Other Practical Options

- Render
- Railway
- Fly.io
- DigitalOcean

These can be useful for lower-cost early environments.

## Suggested Environment Strategy

### Local

- React app
- Spring Boot API
- PostgreSQL
- optional local observability stack

### Dev / Test

- containerized deploy
- managed or containerized PostgreSQL
- basic monitoring and centralized logs

### Prod

- managed PostgreSQL preferred
- HTTPS termination at ingress or platform layer
- secret management outside app code
- backups and restore checks
- audit log retention

## Decision Guidance

Choose modular monolith plus containers first if your priority is:
- speed
- low cost
- easier debugging
- simpler financial consistency

Choose Kubernetes plus Helm later if your priority becomes:
- environment standardization
- service growth
- platform portability at larger scale

Choose Keycloak later if your priority becomes:
- centralized user management
- SSO or external identity federation
- more complex security administration
