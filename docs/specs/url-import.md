# F6: URL Import (Fetch Figure from tonies.com)

> **Status:** 📝 Draft  
> **Priority:** MVP  
> **Depends on:** F5 (Admin CRUD), Database schema, Supabase Storage

## Overview

An admin feature that allows importing a Tonie figure by pasting a product URL
from tonies.com. The system fetches the page, extracts structured product data,
downloads the product image, and pre-fills the create form — saving the admin
from manually entering every field.

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Admin | paste a tonies.com product URL | the figure data is auto-filled |
| 2 | Admin | review and edit the pre-filled data | I can correct or add info before saving |
| 3 | Admin | see a preview of the fetched image | I can confirm it's the right figure |

## Research: tonies.com Product Page Structure

The tonies.com website (built with Next.js) embeds product data in multiple
structured formats. The import feature uses these sources in priority order:

### 1. `__NEXT_DATA__` (Primary Source)

A `<script id="__NEXT_DATA__" type="application/json">` tag contains the full
hydration payload with `props.pageProps.product`, including:

| Data Point | Location in `__NEXT_DATA__` |
|---|---|
| Name | `product.name` |
| Series / Category | `product.categories[].name` |
| Description | `product.description` |
| Price | `product.price.amount` + `product.price.currency` |
| Image URLs | `product.images[].url` (hosted on ctfassets.net) |
| Track list | `product.tracks[].title` |
| Age rating | `product.ageMin` |
| Runtime | `product.runningTime` (minutes) |
| Language | `product.language` |

### 2. JSON-LD (Fallback)

A `<script type="application/ld+json">` with Schema.org `Product` type:

```json
{
  "@type": "Product",
  "name": "The Lion King",
  "description": "...",
  "image": "https://images.ctfassets.net/...",
  "brand": { "name": "tonies" },
  "offers": {
    "price": "14.99",
    "priceCurrency": "GBP"
  }
}
```

### 3. Open Graph Meta Tags (Secondary Fallback)

- `og:title`, `og:description`, `og:image`, `og:url`

## Functional Requirements

### Import Flow

1. **Admin navigates to** `/admin/tonies/import` (or clicks "Import from URL"
   button on the admin dashboard).
2. **Paste URL:** Single text input for the tonies.com product URL.
   - Client-side validation: must match `https://tonies.com/*`.
3. **Fetch & Parse:** Admin clicks "Fetch". A Server Action:
   - Fetches the HTML from the provided URL (server-side, no CORS issues).
   - Parses the `__NEXT_DATA__` JSON, falling back to JSON-LD, then OG tags.
   - Downloads the primary product image to a temp buffer.
   - Returns the extracted data as a structured `ImportResult` object.
4. **Preview & Edit:** The create form (from F5) is pre-filled with the
   extracted data:
   - Image preview shown.
   - All fields are editable so the admin can adjust before saving.
   - Fields not available from the URL (e.g. `purchaseDate`, `favorite`,
     `notes`) remain empty for manual entry.
5. **Save:** Admin clicks "Save". The standard `createTonie` Server Action
   handles validation, image upload to Supabase Storage, and DB insert.

### Data Mapping

| Source Field | → DB Field | Notes |
|---|---|---|
| `product.name` | `name` | Direct map |
| `product.categories[0].name` | `series` | First category = series |
| `product.images[0].url` | `imageUrl` | Downloaded + uploaded to storage |
| `product.tracks[].title` | `trackList` | Array of strings |
| `product.price.amount` | `price` | Converted to EUR if needed |
| — | `purchaseDate` | Not available, manual entry |
| — | `notes` | Not available, manual entry |
| — | `favorite` | Default `false` |
| Creative Tonie category | `isCreativeTonie` | Detected from category name |

### Error Handling

| Scenario | Behaviour |
|---|---|
| Invalid URL format | Inline validation error before fetch |
| URL is not a tonies.com product page | Error toast: "Could not find product data at this URL" |
| Network error fetching the URL | Error toast: "Failed to fetch the page. Please check the URL." |
| No structured data found | Error toast: "Could not extract product data." |
| Image download fails | Warning: form is pre-filled but image field is empty |
| Duplicate figure (same name + series) | Warning banner: "A figure with this name already exists." |

## Non-Functional Requirements

- **Security:** URL fetch happens server-side only (Server Action). The URL is
  validated with Zod to prevent SSRF (only `tonies.com` domains allowed).
- **Performance:** Fetching + parsing should complete in <5 seconds. Show a
  progress indicator during the fetch.
- **Reliability:** Use a retry strategy (1 retry with 2s delay) for transient
  network errors.

## Data Flow

```
[Admin: paste URL] → [Server Action: importFromUrl]
                        ↓
                  Zod.parse(url) — must be tonies.com
                        ↓
                  fetch(url) → HTML string
                        ↓
                  parseNextData(html) || parseJsonLd(html) || parseOgTags(html)
                        ↓
                  downloadImage(imageUrl) → Buffer
                        ↓
                  Return ImportResult { name, series, image, tracks, price, … }
                        ↓
[Pre-fill TonieForm] → [Admin reviews & edits] → [createTonie Server Action]
```

## UI Components

| Component | Type | Description |
|---|---|---|
| `UrlImportForm` | Client | URL input + "Fetch" button with loading state |
| `ImportPreview` | Client | Shows extracted data before saving |

> The `TonieForm` from F5 is reused for review and editing.

## Acceptance Criteria

- [ ] Admin can paste a tonies.com URL and click "Fetch".
- [ ] System extracts name, series, image, tracks, and price from the page.
- [ ] Extracted data pre-fills the create form.
- [ ] Image is downloaded and shown as a preview.
- [ ] Admin can edit all pre-filled fields before saving.
- [ ] Save uses the standard `createTonie` flow.
- [ ] Invalid URLs show a validation error.
- [ ] Non-tonies.com URLs are rejected.
- [ ] Network errors show a user-friendly error message.
- [ ] Duplicate figure warning is shown when applicable.
- [ ] Loading indicator is visible during fetch.
