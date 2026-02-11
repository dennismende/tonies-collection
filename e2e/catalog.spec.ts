import { test, expect } from "@playwright/test";

/**
 * E2E tests for the public catalog page.
 * Tests navigation, layout, search, filter, sort, and view toggling.
 */

test.describe("Public Catalog", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("renders the catalog page with header and footer", async ({ page }) => {
        // Header
        await expect(page.locator("header")).toBeVisible();
        await expect(
            page.getByRole("link", { name: /tonies/i }).first()
        ).toBeVisible();

        // Footer
        await expect(page.locator("footer")).toBeVisible();
    });

    test("shows the page title", async ({ page }) => {
        await expect(page).toHaveTitle(/Tonies Collection/i);
    });

    test("displays view toggle with grid and list options", async ({ page }) => {
        const gridButton = page.getByRole("radio", { name: /grid/i });
        const listButton = page.getByRole("radio", { name: /list/i });

        await expect(gridButton).toBeVisible();
        await expect(listButton).toBeVisible();
    });

    test("displays search input", async ({ page }) => {
        const searchInput = page.getByPlaceholder(/search/i);
        await expect(searchInput).toBeVisible();
    });

    test("can toggle between grid and list views", async ({ page }) => {
        const listButton = page.getByRole("radio", { name: /list/i });
        const gridButton = page.getByRole("radio", { name: /grid/i });

        // Switch to list view
        await listButton.click();
        await expect(listButton).toHaveAttribute("data-state", "on");

        // Switch back to grid view
        await gridButton.click();
        await expect(gridButton).toHaveAttribute("data-state", "on");
    });

    test("search filters the catalog", async ({ page }) => {
        const searchInput = page.getByPlaceholder(/search/i);
        await searchInput.fill("zzz_nonexistent_figure_zzz");

        // Wait for the URL to update (debounce + navigation)
        await page.waitForURL(/.*q=zzz_nonexistent_figure_zzz.*/);

        // Should show empty state or no cards
        const emptyState = page.getByText(/no tonies match/i);
        const cards = page.locator('[class*="card"]');

        // Either empty state is shown or no cards rendered
        const isEmpty = await emptyState.isVisible().catch(() => false);
        const cardCount = await cards.count();
        expect(isEmpty || cardCount === 0).toBe(true);
    });

    test("sort dropdown is accessible", async ({ page }) => {
        const sortTrigger = page.getByRole("combobox").first();
        if (await sortTrigger.isVisible()) {
            await sortTrigger.click();
            // Sort options should be visible
            const options = page.getByRole("option");
            expect(await options.count()).toBeGreaterThan(0);
        }
    });

    test("shows figures or empty state after data loads", async ({ page }) => {
        // Wait for the Suspense fallback (skeletons) to resolve
        // Either real tonie links appear or the empty state text appears
        await expect(
            page.locator("a[href^='/tonies/']").first().or(
                page.getByText(/no tonies/i)
            )
        ).toBeVisible({ timeout: 10_000 });
    });
});
