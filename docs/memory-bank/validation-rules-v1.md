# Validation Rules V1

Last updated: 2026-03-18

## Transaction Rules

- Amount is required and must be greater than 0.
- Date is required.
- Account is required.
- Category is required except for transfer transactions.
- Transfer transactions require both source and destination account.

## Budget Rules

- One budget per category per month per user.
- Amount must be greater than 0.

## Goal Rules

- Target amount must be greater than 0.
- Contribution cannot exceed available balance when the goal is linked to an account.

## Implementation Guidance

- These rules should be enforced on both frontend forms and backend validation layers.
- Backend validation remains the source of truth for all financial rules.
- Validation messages should be clear and user-friendly while preserving domain correctness.
