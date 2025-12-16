import { test, expect } from "@playwright/test";

/**
 * Authentication Flow E2E Tests.
 * Verifies:
 * 1. Protection of routes (redirects).
 * 2. Login functionality and successful redirection.
 */
test.describe("Authentication Flows", () => {
  test("redirects unauthenticated user to login when accessing profile", async ({
    page,
  }) => {
    await page.goto("/user/profile");

    // Expect returnUrl to be part of the URL query
    await expect(page).toHaveURL(/.*\/user\/signin\?returnUrl=\/user\/profile/);
  });

  test("allows user to login and access profile", async ({ page }) => {
    // Note: Credentials should ideally be loaded from env variables
    const TEST_EMAIL = "caputa.mateusz.pl@gmail.com";
    const TEST_PASSWORD = "54321!";

    await page.goto("/user/signin");

    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Hasło").fill(TEST_PASSWORD);

    await page.getByRole("button", { name: "Zaloguj się" }).click();

    // Verify successful login by checking for the Profile link in Topbar
    await expect(
      page.getByRole("link", { name: "Profil", exact: false }).first()
    ).toBeVisible();
  });
});
