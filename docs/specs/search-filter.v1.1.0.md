---
id: SPEC-SEARCH-FILTER
version: 1.1.0
status: active
adr-refs: [ADR-002, ADR-003]
supersedes: search-filter.v1.0.0.md
---

# F3: Search & Filter — Delta v1.1.0

> **Change type:** Bugfix (minor)
> **Depends on:** SPEC-SEARCH-FILTER v1.0.0

## Problem

When a user types slowly in the search input, the 300 ms debounce fires
mid-typing and triggers a URL update (`router.replace`). The component then
syncs the URL value back into `localQuery`, overwriting characters the user
typed after the debounce fired. This creates a frustrating "input reset" effect.

### Root Cause

Two competing `useEffect` hooks in `FilterBar`:

1. **Debounce effect** (`localQuery` → URL): fires 300 ms after the last
   keystroke and pushes the *snapshot* of `localQuery` into the URL.
2. **Sync effect** (`query` prop → `localQuery`): fires whenever the `query`
   prop (derived from `searchParams`) changes and overwrites `localQuery`.

The race: user types "abc" → debounce fires with "ab" → URL updates to `?q=ab`
→ sync effect sets `localQuery` to "ab" → the "c" the user just typed is lost.

## Proposed Fix

Replace the two competing effects with a single, stable pattern:

1. Keep `localQuery` as the **source of truth** for the `<Input>` value.
2. Debounce `localQuery` with a `useRef`-based timer — on expiry, call
   `onQueryChange` to update the URL.
3. Only sync `query` prop → `localQuery` when the new `query` value is
   **different** from what the debounce last flushed. This prevents the
   round-trip overwrite.

This uses a `useRef` to track the "last flushed value" so the sync effect can
distinguish between:
- External resets (e.g. "Clear filters" button) — should update `localQuery`.
- Round-trip echoes from the debounce — should be ignored.

## Acceptance Criteria (Gherkin)

```gherkin
Scenario: Typing is not interrupted by debounce firing
  Given I am on the catalog page
  When I type "Elsa" slowly (one character per 400ms)
  Then the search input always shows my full typed text
  And the URL eventually updates to ?q=Elsa

Scenario: Clear filters still resets the search input
  Given I have typed "Elsa" in the search input
  And the URL shows ?q=Elsa
  When I click the "Clear" button
  Then the search input is empty
  And the URL no longer contains a q parameter

Scenario: Page reload preserves search state
  Given the URL contains ?q=Elsa
  When I reload the page
  Then the search input shows "Elsa"
```
