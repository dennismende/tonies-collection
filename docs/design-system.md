# Tonies Collection — Design System

> **Status:** ✅ Finalized  
> **Date:** 2026-02-10  
> **Stack:** Tailwind CSS v4 · Shadcn UI · Next.js 15

## 1. Design Principles

| Principle | Description |
|---|---|
| **Minimal** | Clean whites, generous whitespace, no visual clutter |
| **High-contrast** | Clear text hierarchy, strong foreground/background separation |
| **Consistent** | All components come from Shadcn UI — no custom HTML widgets |
| **Responsive** | Mobile-first, fluid layouts, touch-friendly hit targets |
| **Accessible** | WCAG 2.1 AA compliance, semantic HTML, keyboard-navigable |

**Aesthetic:** "Linear / Vercel" — light mode only (no dark mode in MVP).

---

## 1b. Styling Constraints

These rules are **non-negotiable** and enforced during code review.

| Constraint | Rule |
|---|---|
| **No magic values** | Never use raw hex codes, pixel values, or ad-hoc spacing. Use semantic tokens only (`bg-primary`, `p-4`, `text-muted-foreground`). |
| **Shadcn components only** | Do not build generic HTML elements (`<button>`, `<input>`, `<select>`). Always use the corresponding Shadcn primitive. |
| **No inline styles** | All styling goes through Tailwind utility classes. No `style={{}}` attributes. |
| **Design system is law** | Do not invent new visual patterns. If a component doesn't exist in Shadcn, propose adding it via the spec process before implementing. |

---

## 2. Color Palette

Built on Shadcn UI's CSS variables. Light mode only.

| Token | CSS Variable | Usage |
|---|---|---|
| `background` | `--background` | Page background (`#ffffff`) |
| `foreground` | `--foreground` | Primary text (`#0a0a0a`) |
| `card` | `--card` | Card surfaces (`#ffffff`) |
| `card-foreground` | `--card-foreground` | Card text (`#0a0a0a`) |
| `primary` | `--primary` | Buttons, links, active states (`#171717`) |
| `primary-foreground` | `--primary-foreground` | Text on primary (`#fafafa`) |
| `secondary` | `--secondary` | Secondary buttons, tags (`#f5f5f5`) |
| `secondary-foreground` | `--secondary-foreground` | Text on secondary (`#171717`) |
| `muted` | `--muted` | Subtle backgrounds (`#f5f5f5`) |
| `muted-foreground` | `--muted-foreground` | Placeholder, captions (`#737373`) |
| `accent` | `--accent` | Hover states (`#f5f5f5`) |
| `destructive` | `--destructive` | Delete actions, error states (`#ef4444`) |
| `border` | `--border` | Card/input borders (`#e5e5e5`) |
| `ring` | `--ring` | Focus rings (`#171717`) |

---

## 3. Typography

| Role | Font | Size | Weight | Token |
|---|---|---|---|---|
| **Body** | Inter (Google Fonts) | 14px / `text-sm` | 400 | — |
| **Body large** | Inter | 16px / `text-base` | 400 | — |
| **Heading 1** | Inter | 30px / `text-3xl` | 700 | Page titles |
| **Heading 2** | Inter | 24px / `text-2xl` | 600 | Section headers |
| **Heading 3** | Inter | 18px / `text-lg` | 600 | Card titles |
| **Caption** | Inter | 12px / `text-xs` | 400 | Metadata, timestamps |
| **Monospace** | JetBrains Mono | 13px / `text-sm` | 400 | Code, IDs |

**Loading:** Import Inter via `next/font/google` for zero layout shift.

---

## 4. Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| `p-2` | 8px | Tight internal padding (tags, badges) |
| `p-4` | 16px | Standard card padding |
| `p-6` | 24px | Section padding |
| `gap-4` | 16px | Grid gap, form field spacing |
| `gap-6` | 24px | Section spacing |
| `max-w-7xl` | 1280px | Page content max width |

**Grid breakpoints:**

| Breakpoint | Columns | Min width |
|---|---|---|
| Default | 1 | 0px |
| `sm` | 2 | 640px |
| `md` | 3 | 768px |
| `lg` | 4 | 1024px |

---

## 5. Component Library (Shadcn UI)

### Components to install

| Component | Usage |
|---|---|
| `Button` | Actions: save, delete, fetch, toggle |
| `Card` | Tonie figure cards in grid view |
| `Input` | Text fields, search bar |
| `Label` | Form field labels |
| `Select` | Sort dropdown, series filter |
| `Checkbox` | Favorite, creative Tonie toggles |
| `Badge` | Series tag, "Creative Tonie" indicator |
| `Dialog` / `AlertDialog` | Delete confirmation |
| `DropdownMenu` | Admin actions menu |
| `Table` | Admin table, list view |
| `Skeleton` | Loading states |
| `Toast` / `Sonner` | Success/error notifications |
| `Separator` | Visual dividers |
| `Textarea` | Notes field |
| `Popover` + `Calendar` | Date picker for purchase date |
| `Toggle` / `ToggleGroup` | Grid/list view switch, favorites toggle |
| `Command` | Series autocomplete in admin form |

---

## 6. Iconography

Use **Lucide React** (bundled with Shadcn UI).

| Icon | Usage |
|---|---|
| `LayoutGrid` | Grid view toggle |
| `List` | List view toggle |
| `Search` | Search bar |
| `Star` / `StarOff` | Favorite indicator |
| `Plus` | Add new figure |
| `Pencil` | Edit |
| `Trash2` | Delete |
| `ArrowLeft` | Back navigation |
| `Import` | URL import |
| `Loader2` | Spinner (animate-spin) |
| `ArrowUpDown` | Sort indicator |
| `X` | Clear filter / close |
| `LogOut` | Admin logout |
| `Image` | Image placeholder |

---

## 7. Imagery

| Aspect | Spec |
|---|---|
| **Figure images** | 1:1 aspect ratio, `object-cover`, rounded-lg corner radius |
| **Thumbnails** (list/table) | 40×40px, rounded-md |
| **Hero image** (detail page) | Max 400px wide, centered |
| **Optimization** | `next/image` with `sizes` prop, `quality={80}`, `priority` on above-fold |
| **Placeholder** | Muted background with `Image` icon while loading or when no image |

---

## 8. Interactive States

| State | Style |
|---|---|
| **Hover (card)** | `shadow-md` transition, subtle scale (`scale-[1.02]`) |
| **Hover (button)** | `bg-primary/90` opacity shift |
| **Focus** | 2px ring with `ring-ring ring-offset-2` |
| **Active** | Visual press: `scale-95` on click |
| **Disabled** | `opacity-50 pointer-events-none` |
| **Loading** | `Loader2` spinner + disabled state on buttons |

**Transitions:** `transition-all duration-200 ease-in-out` on interactive
elements.

---

## 9. Form Patterns

| Pattern | Spec |
|---|---|
| **Layout** | Single column, `max-w-lg`, centered on page |
| **Labels** | Above input, `text-sm font-medium` |
| **Required fields** | Red asterisk next to label |
| **Validation errors** | Below input, `text-sm text-destructive`, linked via `aria-describedby` |
| **Submit button** | Full width at bottom, primary style, shows spinner during submit |
| **Field spacing** | `gap-4` between fields |

---

## 10. Animations

| Element | Animation | Spec |
|---|---|---|
| Cards on load | Fade in + slide up | `animate-in fade-in slide-in-from-bottom-2 duration-300` |
| View toggle | Cross-fade | `transition-opacity duration-200` |
| Toast | Slide in from bottom | Via Sonner defaults |
| Delete dialog | Fade overlay + scale content | Via Shadcn AlertDialog defaults |
| Skeleton | Pulse | `animate-pulse` (Tailwind default) |

---

## 11. Contribution Guidelines

### The Design System is Law

All UI contributions **must** use the tokens, components, and patterns defined in this document. Deviations require a spec update approved before implementation.

### Self-Review Checklist (UI)

Before submitting any UI change, verify:

- [ ] All colors use semantic tokens (no raw hex values).
- [ ] All interactive elements use Shadcn components.
- [ ] All form inputs have associated `<Label>` elements.
- [ ] Focus states are visible and meet WCAG 2.1 AA.
- [ ] The layout is responsive across all breakpoints.
- [ ] Animations use the specified durations and easings.

### Governance

The general **Devil's Advocate Protocol** (for both code and UI violations) is
defined in [`architecture.md`](architecture.md) §12. For UI-specific violations,
also cite the relevant section from this document.
