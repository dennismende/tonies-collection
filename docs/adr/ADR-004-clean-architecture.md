---
id: ADR-004
status: accepted
date: 2026-02-10
---

# ADR-004: Clean Architecture (Domain-Centric)

## Context

The codebase must enforce strict separation between UI, business logic, and data
access to ensure maintainability, testability, and security.

## Decision

Adopt **Clean Architecture** principles:

- **Strict Separation:** UI components never access the database directly.
  Mutations go through Server Actions. Reads go through server components.
- **Type Safety:** TypeScript `strict: true`. Zod for runtime validation.
- **Error Handling:** Result pattern (`{ success, data?, error? }`). No silent
  failures.
- **Server State First:** Prefer RSC over client-side `useEffect` + `useState`.
- **Secure by Design:** Validate inputs, sanitize outputs, RLS at DB level,
  domain allowlist for URL imports.

## Consequences

### Positive

- Clear dependency direction prevents spaghetti code.
- Result pattern makes error handling explicit and testable.
- Server-first approach reduces client bundle size.

### Negative

- More boilerplate for simple CRUD operations.
- Developers must understand the server/client component boundary.
