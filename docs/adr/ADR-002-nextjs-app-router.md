---
id: ADR-002
status: accepted
date: 2026-02-10
---

# ADR-002: Next.js App Router with React Server Components

## Context

The app needs server-side rendering for SEO on the public catalog, server-side
mutations for the admin panel, and optimized image delivery. A modern React
framework is needed.

## Decision

Use **Next.js 15** with the App Router and React Server Components (RSC).

- SSR / ISR for the public catalog.
- Server Actions for all mutations (add / edit / delete figures).
- `next/image` for optimized figure images.
- TypeScript strict mode with Zod for runtime validation.

## Consequences

### Positive

- Server-first architecture minimizes client-side JavaScript.
- Server Actions eliminate the need for separate API routes for mutations.
- `next/image` handles responsive images and format conversion automatically.

### Negative

- App Router is newer and has fewer community patterns than Pages Router.
- RSC mental model requires careful separation of server vs. client components.
