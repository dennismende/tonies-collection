# F4: Sort

> **Status:** 📝 Draft  
> **Priority:** MVP  
> **Depends on:** F1 (Grid / List View), F3 (Search & Filter)

## Overview

Allow visitors to sort the collection by different fields. Sorting works in
combination with active search and filter criteria.

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Visitor | sort figures alphabetically | I can find figures by name quickly |
| 2 | Visitor | sort by purchase date | I can see the newest or oldest additions |
| 3 | Visitor | sort by price | I can see the most/least expensive figures |

## Functional Requirements

### Sort Control

- Dropdown (Shadcn `Select`) in the page header, next to the view toggle.
- Sort options:
  | Label | Field | Default direction |
  |---|---|---|
  | Name (A → Z) | `name` | ascending |
  | Name (Z → A) | `name` | descending |
  | Newest first | `purchaseDate` | descending |
  | Oldest first | `purchaseDate` | ascending |
  | Price (low → high) | `price` | ascending |
  | Price (high → low) | `price` | descending |

- Default sort: **Name (A → Z)**.
- Null handling: Figures with no `purchaseDate` or `price` sort to the end.

### URL State

- Active sort is synced to the URL: `?sort=name&dir=asc`.
- Works in combination with search/filter params from F3.

## Non-Functional Requirements

- **Performance:** Client-side sorting (small dataset).
- **Accessibility:** Sort dropdown has `aria-label="Sort by"`. Active sort
  direction is communicated via `aria-sort` on table headers in list view.

## UI Components

| Component | Type | Description |
|---|---|---|
| `SortSelect` | Client | Shadcn Select with sort options |

## Acceptance Criteria

- [ ] Sort dropdown displays all 6 sort options.
- [ ] Default sort is Name (A → Z).
- [ ] Changing sort immediately reorders the visible figures.
- [ ] Sort works correctly with active search/filter.
- [ ] Sort preference is synced to URL params.
- [ ] Null values sort to the end regardless of direction.
- [ ] Sort dropdown is keyboard-accessible.
