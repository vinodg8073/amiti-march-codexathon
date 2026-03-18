# Non-Functional Requirements V1

Last updated: 2026-03-18

## Performance

- Dashboard should load under 2 seconds for normal users.
- API pagination should be supported for large transaction volumes.

## Security

- JWT authentication is required.
- Refresh token support is required for session continuity.
- Access control must enforce single-user ownership and scope all data access by authenticated `userId`.
- Password hashing should use bcrypt or Argon2.
- Login endpoints should be rate limited.
- All financial inputs must be validated on the server side.
- HTTPS should be enforced outside local development environments.
- Audit logs should be retained for key money-impacting actions.

## Reliability

- Daily backups are required.
- Balance updates must be transaction-safe.

## Accessibility

- The application must be keyboard navigable.
- Color contrast should meet WCAG AA standards.
- Form fields and charts should include clear labels or summaries.

## Responsiveness

- Desktop: full analytics layout.
- Tablet: collapsed side navigation.
- Mobile: stacked cards with a bottom action button.

## Implementation Guidance

- These requirements should be treated as build-time constraints, not deferred documentation.
- Performance, accessibility, and security decisions should be reflected in code and architecture as features are implemented.
- Responsive behavior should be designed intentionally for desktop, tablet, and mobile rather than added as an afterthought.
- Local development may use reduced transport-security constraints only where required for local testing, but production-ready behavior should remain HTTPS-first.
