import { test, expect } from "@playwright/test";

/**
 * E2E tests for the admin section.
 * Tests login page rendering, authentication flow, and protected route access.
 */

test.describe("Admin Login", () => {
    test("renders the login page", async ({ page }) => {
        await page.goto("/admin/login");

        // CardTitle renders as a div, so use getByText instead of getByRole('heading')
        await expect(page.getByText("Admin Login")).toBeVisible();
        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
        await expect(
            page.getByRole("button", { name: /log in/i })
        ).toBeVisible();
    });

    test("shows validation feedback for empty form submission", async ({
        page,
    }) => {
        await page.goto("/admin/login");

        const submitButton = page.getByRole("button", { name: /log in/i });
        await submitButton.click();

        // HTML5 validation should prevent submission with empty fields
        const emailInput = page.getByLabel("Email");
        await expect(emailInput).toBeVisible();

        // The form should still be on the login page (not redirected)
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test("shows error for invalid credentials", async ({ page }) => {
        await page.goto("/admin/login");

        await page.getByLabel("Email").fill("bad@example.com");
        await page.getByLabel("Password").fill("wrongpassword");
        await page.getByRole("button", { name: /log in/i }).click();

        // Wait for the error text to appear (Supabase auth call may take time)
        await expect(
            page.getByText("Invalid email or password")
        ).toBeVisible({ timeout: 10_000 });
    });
});

test.describe("Admin Protected Routes", () => {
    test("redirects unauthenticated users from dashboard to login", async ({
        page,
    }) => {
        await page.goto("/admin");
        await page.waitForURL(/\/admin\/login/);
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test("redirects unauthenticated users from add page to login", async ({
        page,
    }) => {
        await page.goto("/admin/tonies/new");
        await page.waitForURL(/\/admin\/login/);
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test("redirects unauthenticated users from import page to login", async ({
        page,
    }) => {
        await page.goto("/admin/tonies/import");
        await page.waitForURL(/\/admin\/login/);
        await expect(page).toHaveURL(/\/admin\/login/);
    });
});
