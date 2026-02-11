import { test, expect } from "@playwright/test";

/**
 * E2E tests for the detail page.
 * Tests navigation from catalog and 404 handling.
 */

test.describe("Detail Page", () => {
    test("shows 404 for non-existent tonie", async ({ page }) => {
        await page.goto("/tonies/00000000-0000-0000-0000-000000000000");

        // Should show the not-found heading
        await expect(
            page.getByRole("heading", { name: /not found/i })
        ).toBeVisible();
    });

    test("navigates from catalog to detail when figures exist", async ({
        page,
    }) => {
        await page.goto("/");

        // Only test if there are figures in the catalog
        const firstLink = page.locator("a[href^='/tonies/']").first();
        if ((await firstLink.count()) > 0) {
            await firstLink.click();
            await expect(page).toHaveURL(/\/tonies\/.+/);

            // Detail page should have a back link
            const backLink = page.getByRole("link", { name: /back|catalog/i });
            if (await backLink.isVisible()) {
                await backLink.click();
                await expect(page).toHaveURL("/");
            }
        }
    });
});
