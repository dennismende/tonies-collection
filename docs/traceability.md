# Traceability Matrix

> **Last Updated:** 2026-02-24

This table maps each specification to its implementation files and tests.
Updated as part of the [Definition of Done](../GEMINI.md#§6-definition-of-done).

| Req ID | Version | Spec File | Description | Implementation Path | Verification Test | Status |
|---|---|---|---|---|---|---|
| SPEC-GRID-LIST | 1.0.0 | `grid-list-view.v1.0.0.md` | Grid / list view of all figures | `src/app/page.tsx`, `src/components/tonie-card.tsx`, `src/components/tonie-list-item.tsx`, `src/components/view-toggle.tsx` | `e2e/catalog.spec.ts` | Active |
| SPEC-DETAIL | 1.0.0 | `detail-view.v1.0.0.md` | Detail view (click to expand) | `src/app/tonies/[id]/page.tsx`, `src/components/track-list.tsx` | `e2e/detail.spec.ts`, `src/__tests__/track-list.test.tsx` | Active |
| SPEC-SEARCH-FILTER | 1.0.0 | `search-filter.v1.0.0.md` | Search & filter (name, series, favorite) | `src/components/filter-bar.tsx`, `src/app/page.tsx` | `e2e/catalog.spec.ts` | Active |
| SPEC-SORT | 1.0.0 | `sort.v1.0.0.md` | Sort (name, purchase date, price) | `src/components/sort-select.tsx`, `src/app/page.tsx` | `e2e/catalog.spec.ts` | Active |
| SPEC-ADMIN-CRUD | 1.0.0 | `admin-crud.v1.0.0.md` | Add / edit / delete figure (admin) | `src/app/admin/page.tsx`, `src/app/admin/tonies/*/page.tsx`, `src/actions/tonie-actions.ts` | `e2e/admin.spec.ts` | Active |
| SPEC-URL-IMPORT | 1.0.0 | `url-import.v1.0.0.md` | URL import (fetch data + image from URL) | `src/app/admin/import/page.tsx`, `src/actions/import-actions.ts`, `src/lib/import-parser.ts` | `src/__tests__/import-parser.test.ts`, `e2e/admin.spec.ts` | Active |
