# Tonies Collection — Architecture Decision Record

> **Status:** ✅ Decisions Finalized  
> **Date:** 2026-02-10  
> **Pattern:** Clean Architecture (Domain-Centric)

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

**Decision:** Tailwind CSS v4 + Shadcn UI. Light mode only for MVP.

All visual rules — tokens, components, typography, spacing, and contribution
guidelines — live in [`design-system.md`](design-system.md).

---

## 6. Features & Scope (MVP)

### 6.1 MVP Feature Set

| # | Feature | Status | Spec |
|---|---|---|---|
| F1 | Grid / list view of all figures | ✅ MVP | `docs/specs/grid-list-view.v1.0.0.md` |
| F2 | Detail view (click to expand) | ✅ MVP | `docs/specs/detail-view.v1.0.0.md` |
| F3 | Search & filter (name, series, favorite) | ✅ MVP | `docs/specs/search-filter.v1.0.0.md` |
| F4 | Sort (name, purchase date, price) | ✅ MVP | `docs/specs/sort.v1.0.0.md` |
| F5 | Add / edit / delete figure (admin) | ✅ MVP | `docs/specs/admin-crud.v1.0.0.md` |
| F6 | URL import (fetch figure data + image from URL) | ✅ MVP | `docs/specs/url-import.v1.0.0.md` |
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
│       ├── grid-list-view.v1.0.0.md
│       ├── detail-view.v1.0.0.md
│       ├── search-filter.v1.0.0.md
│       ├── sort.v1.0.0.md
│       ├── admin-crud.v1.0.0.md
│       └── url-import.v1.0.0.md
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

## 10. Architectural Principles

These principles govern all **code-level** decisions. For UI-specific rules see
[`design-system.md`](design-system.md) §1b.

| Principle | Rule |
|---|---|
| **Strict Separation** | UI components never talk to the database directly. All mutations go through Server Actions (`/actions`). All reads go through server components or API routes. |
| **Type Safety** | No implicit `any`. TypeScript `strict: true`. Use **Zod** for runtime validation of all API inputs, form data, and external data (e.g. URL import). |
| **Error Handling** | Use a **Result pattern** (`{ success, data?, error? }`). Never fail silently. Every Server Action returns a typed result, never throws. |
| **Server State First** | Prefer React Server Components (RSC) and server-side data fetching over client-side `useEffect` + `useState`. Client state is reserved for purely interactive concerns (form inputs, UI toggles). |
| **Secure by Design** | Validate all inputs. Sanitize all outputs. SSRF protection on URL imports (domain allowlist). RLS at the database level. |

---

## 11. Development Workflow

All changes follow a **spec-driven** workflow:

### Phase 1: Analysis & Spec

1. Analyze the impact of the request.
2. Check `docs/specs/` for existing specifications.
3. **Scan `docs/adr/`** for constraints that may affect the approach.
4. Ask clarifying questions if requirements are vague.
5. Outline a **Technical Plan** before writing any code.

**If no spec exists for this task:** STOP. Draft a Delta Spec in `docs/specs/`
with a Spec ID (`SPEC-<FEATURE>`), version `1.0.0`, and Gherkin-style acceptance
criteria before proceeding.

### Phase 2: Implementation

1. Write code in small, atomic batches.
2. Add **JSDoc** to all exported functions explaining _what_ and _why_.
3. Ensure all new code follows the architectural principles above.
4. Reference the Spec ID in all git commits (see §13).

### Phase 3: Review & Refine

Before finishing, run a self-review checklist:

- [ ] Did I handle the error case?
- [ ] Is this accessible (ARIA)?
- [ ] Did I add JSDoc to exported functions?
- [ ] Did I update `docs/traceability.md`?
- [ ] ESLint passes (pre-commit hooks are not a substitute for verifying
      before commit).
- [ ] **For UI/interaction changes:** runtime verification in a browser
      confirms the fix works. Static analysis alone is insufficient — type-check
      and unit tests cannot catch timing-dependent or stateful UI bugs.

For UI-specific checks, see the checklist in
[`design-system.md`](design-system.md) §11.

Add an **"Architectural Remarks"** section to any PR or spec listing potential
trade-offs or risks. Each remark section must include:

1. One potential scalability risk.
2. One potential security risk.
3. Verify change does not contradict any ADR in `docs/adr/`.
4. **Verification method:** can this change be validated by static analysis
   alone (type-check + unit tests), or does it require runtime / browser
   testing? If runtime, specify the exact scenario to verify.

---

## 12. Governance

### Devil's Advocate Protocol

If a proposed change violates Clean Architecture (e.g. database queries in a click handler, client-side mutations bypassing Server Actions), it must be **rejected** with:

1. An explanation of _why_ it is harmful (security, scalability, maintainability).
2. A proposed **correct architectural alternative**.

This applies to both human and AI-generated code suggestions.

### ADR Enforcement

Before implementing any change, verify it does **not** contradict an accepted
ADR in `docs/adr/`. If a new approach is needed, write a new ADR that supersedes
the old one before changing the code.

---

## 13. Versioning & Commits

### Spec Version Vector

Each spec in `docs/specs/` carries a SemVer version in both its **filename**
and **frontmatter**. The filename format is `<feature>.v<VERSION>.md` (e.g.
`search-filter.v1.0.0.md`). When a spec is bumped, a **new file** is created
(e.g. `search-filter.v1.1.0.md`) and the old version remains for history.

The version signals the magnitude of the change:

| Change | Version Bump | Action |
|---|---|---|
| Fundamental domain/logic change | **Major** (X.0.0) | Invalidate cached context. Re-read all specs. |
| New functionality added | **Minor** (0.Y.0) | Read the new/updated spec. Append to context. |
| Clarification or typo fix | **Patch** (0.0.Z) | Update specific rules in memory. |

### Git Commit Format

All commits **must** follow the Conventional Commits format and reference the
Spec ID being implemented:

```
<type>(<scope>): <description> (ref: <SPEC-ID> v<VERSION>)
```

**Examples:**

```
feat(catalog): add series filter (ref: SPEC-SEARCH-FILTER v1.0.0)
fix(admin): validate image MIME type (ref: SPEC-ADMIN-CRUD v1.0.0)
docs(specs): clarify favorite toggle behavior (ref: SPEC-GRID-LIST v1.0.1)
```

Commits that do not implement a spec (e.g. tooling, CI) use standard
Conventional Commits without a `ref:` suffix:

```
chore(ci): add commitlint to pre-commit hooks
```

### Traceability

The mapping from Spec ID → implementation files → test files is maintained in
[`docs/traceability.md`](traceability.md). This table **must** be updated as
part of the Definition of Done for any task that touches spec-related code.

To trace the history of a file back to its spec:

```bash
git log --grep="SPEC-SEARCH-FILTER" -- src/components/filter-bar.tsx
```

---

## Next Steps

1. ~~Answer architecture questions~~ ✅
2. ~~Create **feature specs** in `docs/specs/`~~ ✅
3. ~~Write the **Design System** spec~~ ✅
4. ~~Create a detailed **Implementation Plan**~~ ✅
5. ~~Scaffold the project and begin implementation~~ ✅
6. ~~Adopt governance model (ADRs, versioning, traceability)~~ ✅
7. Connect real Supabase credentials for production.
8. Post-MVP: CSV/JSON import, statistics dashboard, dark mode.
