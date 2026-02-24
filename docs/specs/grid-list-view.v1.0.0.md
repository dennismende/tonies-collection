---
id: SPEC-GRID-LIST
version: 1.0.0
status: active
adr-refs: [ADR-002, ADR-003, ADR-004]
---

# F1: Grid / List View

> **Priority:** MVP  
> **Depends on:** Database schema, Supabase setup

## Overview

The primary page of the application. Displays all Tonie figures in a responsive
grid layout (default) with an option to switch to a compact list view.

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Visitor | see all Tonie figures at a glance | I can browse the collection |
| 2 | Visitor | switch between grid and list view | I can choose the layout that suits me |
| 3 | Visitor | see the figure image, name, and series | I get a quick overview without clicking |

## Functional Requirements

### Grid View (Default)

- Responsive grid: 1 column (mobile) → 2 columns (sm) → 3 columns (md) → 4
  columns (lg).
- Each card displays:
  - **Figure image** (optimized via `next/image`, aspect ratio 1:1 with
    `object-cover`).
  - **Name** (truncated if long, full name on hover/focus).
  - **Series** badge (e.g. "Disney", styled as a subtle tag).
  - **Favorite** indicator (filled star icon if `favorite === true`).
- Empty state: friendly message with illustration when no figures exist.
- Skeleton loading state while data is being fetched.

### List View

- Single-column table-like layout.
- Each row displays: thumbnail (40×40), name, series, purchase date, price.
- Hover highlight on rows.
- Same empty and loading states as grid view.

### View Toggle

- Toggle button group (grid icon / list icon) in the top-right of the page
  header.
- Active view is persisted in `localStorage` so it survives page reloads.
- Default: grid view.

## Non-Functional Requirements

- **Performance:** Use React Server Components to fetch data on the server.
  Paginate or use infinite scroll if the dataset exceeds ~50 items.
- **Accessibility:** Cards are focusable and navigable via keyboard. Images
  have meaningful `alt` text (figure name).
- **SEO:** Page renders on the server with a proper `<title>` and meta
  description.

## Data Flow

```
[Browser] → GET / (RSC) → [Server Component]
                              ↓
                      supabase.from('tonies').select('*')
                              ↓
                      [Render grid/list of <TonieCard /> components]
```

## UI Components

| Component | Type | Description |
|---|---|---|
| `TonieCard` | Client | Single figure card (grid mode) |
| `TonieRow` | Client | Single figure row (list mode) |
| `ViewToggle` | Client | Grid/list switch (uses `localStorage`) |
| `TonieGrid` | Server | Fetches data and renders cards/rows |
| `EmptyState` | Server | Shown when the collection is empty |

## Acceptance Criteria

- [ ] Grid view renders all figures from Supabase with image, name, series.
- [ ] List view renders all figures in a compact table-like layout.
- [ ] View toggle persists preference in `localStorage`.
- [ ] Empty state is shown when no figures exist.
- [ ] Skeleton loading states render during data fetch.
- [ ] Layout is responsive from mobile to desktop.
- [ ] All images have meaningful `alt` text.
- [ ] Page has proper `<title>` and meta description.
