# Authentication Specification V1

Last updated: 2026-03-18

## Objective

Define the authentication experience, validation rules, and security-related flows for version 1 of the Personal Finance Tracker.

## Core Features

- A user should see sign up with email, password, and display name.
- Once login is successful, the user's display name should be shown in the authenticated experience.
- The menu should include log in and log out actions depending on authentication state.
- The product should support a forgot password flow.
- The product should use JWT-based authentication.
- The product should support refresh tokens.

## Validation Rules

- Email must be unique.
- Password must be at least 8 characters.
- Password must include at least one uppercase letter, one lowercase letter, and one number.

## Screens

### Sign Up

Purpose: Register a new user account.

Fields:
- Display name
- Email
- Password

Rules:
- Validate unique email.
- Validate password strength before account creation.

Expected outcome:
- Account is created successfully.
- User is authenticated and enters the app.
- Display name is available for the post-login UI.

### Login

Purpose: Authenticate an existing user.

Fields:
- Email
- Password

Expected outcome:
- User receives a valid JWT access token.
- User also receives refresh-token support for continued sessions.
- User can log out from the authenticated menu.

### Forgot Password

Purpose: Start password recovery by verifying through email.

Fields:
- Email

Expected outcome:
- The system verifies the user through email.
- The user receives a password reset path.

### Reset Password

Purpose: Update password after validating current credentials.

Fields:
- Current password
- New password

Rules:
- Current password must be valid.
- New password must meet password policy requirements.

Expected outcome:
- Password is updated only if the current password is correct.

## UX Notes

- Display name should be visible after login, especially in the header or user profile menu.
- Auth-related actions should be accessible from the menu.
- Error messages should clearly explain validation failures such as duplicate email or weak password.

## Technical Notes

- The current week-1 implementation uses a simple in-memory token prototype.
- This requirement supersedes that prototype and points toward JWT plus refresh-token based authentication.
- Email verification and forgot-password delivery imply a real email delivery mechanism in a later implementation slice.
