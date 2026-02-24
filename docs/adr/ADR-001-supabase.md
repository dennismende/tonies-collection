---
id: ADR-001
status: accepted
date: 2026-02-10
---

# ADR-001: Supabase as Backend

## Context

The Tonies Collection app requires multi-device access, user authentication for
an admin panel, image storage for figure photos, and a relational database for
the catalog. A solution with a generous free tier is preferred.

## Decision

Use **Supabase** (hosted PostgreSQL + Auth + Storage) as the backend.

- Client libraries: `@supabase/supabase-js` + `@supabase/ssr`.
- Row-Level Security (RLS) enforces public-read / admin-write at the DB level.
- Images stored in a `tonies-images` bucket via Supabase Storage.

## Consequences

### Positive

- Built-in auth (email/password) eliminates a custom auth system.
- RLS provides defense-in-depth at the database layer.
- Generous free tier pairs well with Vercel hosting.

### Negative

- Vendor lock-in to Supabase-specific APIs (mitigated by standard PostgreSQL).
- Storage egress costs at scale (not a concern for this family-sized app).
