---
id: ADR-003
status: accepted
date: 2026-02-10
---

# ADR-003: Tailwind CSS v4 + Shadcn UI

## Context

The project needs a styling solution that enforces consistency, provides
accessible primitives, and follows a minimal "Linear / Vercel" aesthetic. Custom
CSS should be avoided in favor of a design-token-based approach.

## Decision

Use **Tailwind CSS v4** for utility-first styling and **Shadcn UI** for all
interactive components.

- Semantic tokens only — no magic values.
- Light mode only for MVP (no `darkMode` toggling).
- All visual rules documented in `docs/design-system.md`.

## Consequences

### Positive

- Shadcn components are accessible (Radix-based) out of the box.
- Tailwind tokens enforce spacing / color consistency across the codebase.
- Shadcn components are copied into the project — full ownership, no version
  lock.

### Negative

- Tailwind v4 is newer; some community resources still reference v3 syntax.
- Shadcn components require manual updates if upstream fixes are released.
