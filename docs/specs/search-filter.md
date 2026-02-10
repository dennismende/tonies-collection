# F3: Search & Filter

> **Status:** 📝 Draft  
> **Priority:** MVP  
> **Depends on:** F1 (Grid / List View)

## Overview

Allow visitors to find specific Tonie figures by searching text or filtering by
series and favorite status. Filters are applied client-side on the already
server-fetched dataset (MVP-sized collections don't warrant server-side
filtering).

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Visitor | type a name to search for a figure | I can quickly find a specific Tonie |
| 2 | Visitor | filter by series (e.g. "Disney") | I can browse figures in a category |
| 3 | Visitor | filter by favorites only | I can see my daughter's favorites |
| 4 | Visitor | combine search and filters | I can narrow results precisely |
| 5 | Visitor | clear all filters in one click | I can reset to the full collection |

## Functional Requirements

### Search Bar

- Text input with a search icon and placeholder: "Search tonies…".
- Debounced (300 ms) client-side filtering on `name`, `series`, and `notes`.
- Case-insensitive.
- Shows result count: "Showing X of Y tonies".

### Filter Controls

- **Series filter:** Dropdown / multi-select populated from the distinct
  `series` values in the dataset. Selecting one or more series shows only
  figures matching those series.
- **Favorites filter:** Toggle button "Favorites only" that filters to
  `favorite === true`.
- Filters are additive (AND logic): search text AND selected series AND
  favorites.

### URL State

- Filter state is synced to URL search params (`?q=simba&series=Disney&fav=1`)
  so that filtered views are shareable and survive page reloads.
- Use `nuqs` or `useSearchParams` for URL state management.

### Empty Filter Result

- If no figures match the current filters, show a contextual message:
  "No tonies match your filters." with a "Clear filters" button.

## Non-Functional Requirements

- **Performance:** Filtering happens client-side (small dataset). If dataset
  grows beyond ~200 items, migrate to server-side Supabase filtering.
- **Accessibility:** Search input has `role="searchbox"` and `aria-label`.
  Filter controls are keyboard-operable. Live region announces result count
  changes.

## UI Components

| Component | Type | Description |
|---|---|---|
| `SearchBar` | Client | Debounced text search input |
| `SeriesFilter` | Client | Multi-select or checkbox group for series |
| `FavoritesToggle` | Client | Toggle button for favorites filter |
| `FilterBar` | Client | Container composing all filter controls |
| `ActiveFilters` | Client | Shows active filter badges with remove action |
| `ResultCount` | Client | "Showing X of Y tonies" live region |

## Acceptance Criteria

- [ ] Typing in the search bar filters figures by name, series, and notes.
- [ ] Series multi-select shows all distinct series from the dataset.
- [ ] Favorites toggle shows only favorite figures.
- [ ] Filters combine with AND logic.
- [ ] Filter state is reflected in URL search params.
- [ ] Refreshing the page preserves the active filter state.
- [ ] "Clear filters" resets all filters and search text.
- [ ] Empty filter result shows a helpful message.
- [ ] Result count updates live as filters change.
