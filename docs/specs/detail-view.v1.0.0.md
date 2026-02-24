---
id: SPEC-DETAIL
version: 1.0.0
status: active
adr-refs: [ADR-002, ADR-003]
---

# F2: Detail View

> **Priority:** MVP  
> **Depends on:** F1 (Grid / List View), Database schema

## Overview

A dedicated page for a single Tonie figure, showing all available information
including the track list, description, and metadata.

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Visitor | click on a figure card to see full details | I can learn more about a specific Tonie |
| 2 | Visitor | see the complete track list | I know what stories/songs are included |
| 3 | Visitor | navigate back to the collection | I can continue browsing |

## Functional Requirements

### Detail Page (`/tonies/[id]`)

- **Hero section:**
  - Large figure image (optimized, responsive).
  - Name (h1).
  - Series badge.
  - Favorite star indicator.
  - Creative Tonie badge (if applicable).

- **Metadata section:**
  - Purchase date (formatted via `Intl.DateTimeFormat`).
  - Price (formatted as EUR via `Intl.NumberFormat`).
  - Notes (free-text, rendered as paragraph).

- **Track list section:**
  - Ordered list of tracks/chapters.
  - Show "No tracks available" if `trackList` is empty or null.

- **Navigation:**
  - Back button / breadcrumb: "← Back to collection".
  - Admin: "Edit" link visible only when authenticated (links to admin edit
    form).

## Non-Functional Requirements

- **SSR:** Page is server-rendered for SEO. Each figure has a unique URL.
- **OG tags:** Dynamic `og:title`, `og:description`, `og:image` per figure.
- **Accessibility:** Semantic heading structure, image alt text, skip-to-content
  link.

## Data Flow

```
[Browser] → GET /tonies/[id] (RSC) → [Server Component]
                                        ↓
                                supabase.from('tonies').select('*').eq('id', id).single()
                                        ↓
                                [Render <TonieDetail /> component]
                                        ↓ (404 if not found)
                                [Render <NotFound /> page]
```

## UI Components

| Component | Type | Description |
|---|---|---|
| `TonieDetail` | Server | Full detail layout for a single figure |
| `TrackList` | Server | Ordered list of tracks/chapters |
| `BackLink` | Client | Navigation back to collection |

## Acceptance Criteria

- [ ] Clicking a card/row in the grid/list navigates to `/tonies/[id]`.
- [ ] Detail page displays all fields: image, name, series, favorite,
      creative Tonie, purchase date, price, notes, track list.
- [ ] Empty/null fields are gracefully omitted (no "undefined" on screen).
- [ ] 404 page is shown for invalid IDs.
- [ ] Dynamic OG meta tags are set per figure.
- [ ] Back navigation returns to the collection page.
- [ ] "Edit" link is only visible to authenticated admins.
