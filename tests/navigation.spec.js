import { test, expect } from "@playwright/test";

/**
 * Navigation E2E Tests.
 * Verifies critical navigation paths from the home page.
 */
test("has link to login page and navigates correctly", async ({ page }) => {
  await page.goto("/");

  const loginLink = page.getByRole("link", { name: "Logowanie" }).first();

  await expect(loginLink).toBeVisible();

  await loginLink.click();

  await expect(page).toHaveURL(/.*\/user\/signin/);

  await expect(page.getByText("Zaloguj się danymi konta")).toBeVisible();
});
