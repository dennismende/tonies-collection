---
id: SPEC-ADMIN-CRUD
version: 1.0.0
status: active
adr-refs: [ADR-001, ADR-002, ADR-004]
---

# F5: Admin CRUD (Add / Edit / Delete)

> **Priority:** MVP  
> **Depends on:** Database schema, Supabase Auth, F2 (Detail View)

## Overview

An authenticated admin panel for managing the Tonie figure collection. Provides
forms to create, update, and delete figures. All mutations go through Next.js
Server Actions that validate input with Zod before writing to Supabase.

## User Stories

| # | As a… | I want to… | So that… |
|---|---|---|---|
| 1 | Admin | log in to the admin panel | I can manage the collection |
| 2 | Admin | add a new Tonie figure manually | I can grow the collection |
| 3 | Admin | edit an existing figure | I can correct or update details |
| 4 | Admin | delete a figure | I can remove duplicates or mistakes |
| 5 | Admin | upload or replace a figure image | I can keep images up to date |
| 6 | Visitor | not see admin controls | The public view is clean |

## Functional Requirements

### Authentication

- **Login page** (`/admin/login`):
  - Email + password form.
  - Uses Supabase Auth `signInWithPassword`.
  - On success, redirects to `/admin`.
  - On failure, shows inline error ("Invalid email or password").
  - Rate-limited via Supabase defaults.

- **Middleware protection:**
  - All `/admin/*` routes (except `/admin/login`) require an authenticated
    session.
  - Redirect unauthenticated users to `/admin/login`.

- **Logout:** Button in the admin header. Calls `supabase.auth.signOut()` and
  redirects to `/`.

### Admin Dashboard (`/admin`)

- Table listing all figures with columns: image (thumbnail), name, series,
  purchase date, actions (edit / delete).
- Sortable by name (default).
- Links to "Add new figure" and each figure's edit page.

### Add Figure (`/admin/tonies/new`)

- Form with all schema fields:
  | Field | Input Type | Validation |
  |---|---|---|
  | Name | Text input | Required, max 200 chars |
  | Series | Text input with autocomplete | Required, max 100 chars |
  | Image | File upload (drag & drop zone) | Optional, max 5 MB, jpeg/png/webp |
  | Purchase date | Date picker | Optional |
  | Price | Number input (EUR) | Optional, min 0 |
  | Notes | Textarea | Optional, max 1000 chars |
  | Favorite | Checkbox | Default `false` |
  | Track list | Dynamic list input (add/remove rows) | Optional |
  | Creative Tonie | Checkbox | Default `false` |

- **Server Action:** `createTonie(formData: FormData)`
  - Validates with Zod.
  - Uploads image to Supabase Storage `tonies-images` bucket.
  - Inserts row into `tonies` table.
  - Returns `Result<Tonie, ValidationError>`.
  - On success: redirect to the new figure's detail page.
  - On failure: re-render form with field-level errors.

### Edit Figure (`/admin/tonies/[id]/edit`)

- Same form as "Add", pre-populated with existing data.
- Image field shows current image with option to replace.
- **Server Action:** `updateTonie(id: string, formData: FormData)`
  - Same validation as create.
  - If a new image is uploaded, replaces the old one in storage.
  - Updates the row in the `tonies` table.

### Delete Figure

- Triggered from the admin dashboard or the edit page.
- **Confirmation dialog** (Shadcn `AlertDialog`): "Are you sure you want to
  delete {name}? This action cannot be undone."
- **Server Action:** `deleteTonie(id: string)`
  - Deletes the image from storage.
  - Deletes the row from the `tonies` table.
  - Redirects to `/admin`.

## Non-Functional Requirements

- **Security:**
  - All Server Actions check `supabase.auth.getUser()` before executing.
  - RLS policies enforce `authenticated` role for write operations.
  - File uploads are validated server-side (MIME type + file size).
  - All text inputs are sanitized (XSS prevention).
- **Accessibility:** All form fields have labels. Error messages are linked
  via `aria-describedby`. Focus is moved to the first error on validation
  failure.
- **UX:** Optimistic UI is not needed for MVP. Show a loading spinner on
  submit buttons during Server Action execution.

## Data Flow (Create Example)

```
[Admin Form] → Submit → [Server Action: createTonie]
                            ↓
                    Zod.parse(formData)
                            ↓ (fail → return errors)
                    supabase.storage.upload(image)
                            ↓
                    supabase.from('tonies').insert(row)
                            ↓
                    redirect('/tonies/[new-id]')
```

## UI Components

| Component | Type | Description |
|---|---|---|
| `LoginForm` | Client | Email + password login |
| `AdminHeader` | Server | Admin navigation bar with logout |
| `AdminTable` | Client | Sortable table of all figures |
| `TonieForm` | Client | Shared form for create and edit |
| `ImageUpload` | Client | Drag & drop image upload zone |
| `TrackListInput` | Client | Dynamic add/remove track rows |
| `DeleteDialog` | Client | Confirmation dialog for deletion |

## Acceptance Criteria

- [ ] Admin can log in with email + password.
- [ ] Unauthenticated users are redirected to login.
- [ ] Admin can add a new figure with all fields + image upload.
- [ ] Zod validation errors display inline per field.
- [ ] Admin can edit an existing figure with pre-populated data.
- [ ] Admin can replace the image on an existing figure.
- [ ] Admin can delete a figure with a confirmation dialog.
- [ ] Image is deleted from storage when figure is deleted.
- [ ] Public visitors cannot see admin controls or access admin routes.
- [ ] Logout clears session and redirects to home.
- [ ] Series autocomplete suggests existing series values.
