# Tonies Collection — Architecture Decision Record

> **Status:** ✅ Decisions Finalized  
> **Date:** 2026-02-10

This document captures the architectural decisions for the Tonies Collection web
application — a catalog of all Tonie box figures owned by the family.

---

## 1. Data Layer & Persistence

### 1.1 Storage: Supabase (PostgreSQL)

**Decision:** Use **Supabase** as the backend (hosted PostgreSQL + Auth + Storage).

**Rationale:**
- Multi-device access for the family.
- Built-in auth (needed for admin panel).
- Supabase Storage for figure images (uploaded locally, stored in a bucket).
- Generous free tier; pairs well with Vercel deployment.
- Row-Level Security (RLS) enforces public-read / admin-write at the DB level.

**Client library:** `@supabase/supabase-js` + `@supabase/ssr` for Next.js
server-side usage.

### 1.2 Data Schema

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | UUID | ✅ | Primary key, auto-generated |
| `name` | string | ✅ | e.g. "Die Maus" |
| `series` | string | ✅ | e.g. "Disney", "Hörspiel" |
| `imageUrl` | string | ❌ | Path in Supabase Storage |
| `purchaseDate` | date | ❌ | When it was bought |
| `price` | number | ❌ | Purchase price in EUR |
| `notes` | string | ❌ | Free-text notes |
| `favorite` | boolean | ❌ | Daughter's favorite (default `false`) |
| `trackList` | string[] | ❌ | List of songs / stories |
| `isCreativeTonie` | boolean | ❌ | Distinguishes Creative vs content Tonies (default `false`) |
| `createdAt` | timestamp | ✅ | Auto-set on insert |
| `updatedAt` | timestamp | ✅ | Auto-set on update |

> Runtime validation via **Zod** schema mirroring this table.

---

## 2. Framework & Rendering Strategy

### 2.1 Framework: Next.js (App Router)

**Decision:** **Next.js 15** with the App Router and React Server Components.

**Rationale:**
- SSR / ISR for the public catalog (SEO-friendly).
- Server Actions for all mutations (add / edit / delete figures).
- `next/image` for optimized figure images.
- Aligns with our rule: "prefer server state over client state."

### 2.2 Language: TypeScript (strict mode)

- `strict: true` in `tsconfig.json`.
- No implicit `any`.
- Zod for runtime validation of all API / form inputs.

---

## 3. Authentication & Multi-User

### 3.1 Model: Admin + Public

**Decision:** Public catalog (no login needed to browse) + password-protected
admin panel for CRUD operations.

**Implementation:**
- **Supabase Auth** with email/password provider (single admin account).
- Middleware-based route protection for `/admin/*` routes.
- **RLS policies:**
  - `SELECT` on `tonies` → open to `anon` role (public read).
  - `INSERT / UPDATE / DELETE` → restricted to `authenticated` role.

---

## 4. Deployment & Hosting

### 4.1 Platform: Vercel

**Decision:** Deploy on **Vercel**.

- Zero-config integration with Next.js.
- Environment variables for Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, etc.).
- Preview deployments for PRs.

---

## 5. UI & Design System

### 5.1 Styling: Tailwind CSS + Shadcn UI

**Decision:** Follow the global rules — **Tailwind CSS v4** + **Shadcn UI**.

**Aesthetic:** Minimal, high-contrast "Linear / Vercel" look. Clean whites,
subtle borders, generous whitespace. The design system spec will be documented
separately in `docs/design-system.md`.

### 5.2 Dark Mode: Not in MVP

Light-only for the first version. The Tailwind config will not include
`darkMode` toggling.

---

## 6. Features & Scope (MVP)

### 6.1 MVP Feature Set

| # | Feature | Status | Spec |
|---|---|---|---|
| F1 | Grid / list view of all figures | ✅ MVP | `docs/specs/grid-list-view.md` |
| F2 | Detail view (click to expand) | ✅ MVP | `docs/specs/detail-view.md` |
| F3 | Search & filter (name, series, favorite) | ✅ MVP | `docs/specs/search-filter.md` |
| F4 | Sort (name, purchase date, price) | ✅ MVP | `docs/specs/sort.md` |
| F5 | Add / edit / delete figure (admin) | ✅ MVP | `docs/specs/admin-crud.md` |
| F6 | URL import (fetch figure data + image from URL) | ✅ MVP | `docs/specs/url-import.md` |
| F7 | Import from CSV / JSON | 🔜 Post-MVP | — |
| F8 | Statistics dashboard | 🔜 Post-MVP | — |

> Each MVP feature must have a spec in `docs/specs/` before implementation
> begins.

### 6.2 Image Handling

**Decision:** Upload & store locally in **Supabase Storage**.

- Images are uploaded to a `tonies-images` bucket.
- The `imageUrl` field stores the storage path.
- The admin URL-import feature (F6) fetches the image from the given URL and
  uploads it to the bucket automatically.
- `next/image` serves optimized versions at runtime.

---

## 7. Internationalisation (i18n)

**Decision:** i18n-ready from the start. **English only** for the MVP.

**Implementation:** `next-intl` for translations, date formatting (`Intl`), and
currency formatting (EUR). Adding German (or other languages) later is a
configuration change, not a code change.

---

## 8. Testing Strategy

**Decision:** All three levels from the start.

| Level | Tool | Scope |
|---|---|---|
| **Unit** | Vitest | Zod schemas, domain helpers, utils |
| **Component** | React Testing Library + Vitest | Shadcn-based UI components |
| **E2E** | Playwright | Critical flows: browse catalog, admin login, add/edit/delete figure |

---

## 9. Project Structure (Proposed)

```
tonies/
├── docs/
│   ├── architecture.md          ← this file
│   ├── design-system.md
│   └── specs/
│       ├── grid-list-view.md
│       ├── detail-view.md
│       ├── search-filter.md
│       ├── sort.md
│       ├── admin-crud.md
│       └── url-import.md
├── src/
│   ├── app/                     ← Next.js App Router pages
│   │   ├── (public)/            ← Public catalog routes
│   │   ├── admin/               ← Protected admin routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  ← Shadcn UI primitives
│   │   └── ...                  ← Feature components
│   ├── lib/
│   │   ├── supabase/            ← Supabase client (server + browser)
│   │   ├── schemas/             ← Zod schemas
│   │   └── utils/               ← Shared utilities
│   ├── actions/                 ← Server Actions
│   └── types/                   ← TypeScript type definitions
├── public/
├── tests/
│   ├── unit/
│   ├── component/
│   └── e2e/
├── supabase/
│   └── migrations/              ← SQL migrations
└── ...config files
```

---

## Next Steps

1. ~~Answer architecture questions~~ ✅
2. Create **feature specs** in `docs/specs/` for each MVP feature.
3. Write the **Design System** spec in `docs/design-system.md`.
4. Create a detailed **Implementation Plan** for review.
5. Scaffold the project and begin implementation.
