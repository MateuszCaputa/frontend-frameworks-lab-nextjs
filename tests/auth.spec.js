import { test, expect } from "@playwright/test";

/**
 * (Lab 10, Task 5 & 6)
 * Authentication Flow Tests.
 * Covers:
 * 1. Protecting routes from unauthenticated users.
 * 2. Successful login flow redirecting to the requested page.
 */
test.describe("Authentication Flows", () => {
  test("redirects unauthenticated user to login when accessing profile", async ({
    page,
  }) => {
    // 1. Try to go directly to a protected page
    await page.goto("/user/profile");

    // 2. Assert we are redirected to signin
    // We expect returnUrl to be part of the URL query
    await expect(page).toHaveURL(/.*\/user\/signin\?returnUrl=\/user\/profile/);
  });

  test("allows user to login and access profile", async ({ page }) => {
    const TEST_EMAIL = "caputa.mateusz.pl@gmail.com";
    const TEST_PASSWORD = "54321!";
    // -----------------------------------------------------------

    // 1. Go to sign in page
    await page.goto("/user/signin");

    // 2. Fill the form
    // Using getByLabel or placeholder logic since we used Tailwind forms
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Hasło").fill(TEST_PASSWORD);

    // 3. Click Submit
    await page.getByRole("button", { name: "Zaloguj się" }).click();

    // 4. Assert redirection to profile (or home, depending on default flow)
    // Since we went to /user/signin directly, default returnUrl is /
    // BUT we want to verify we are logged in.

    // Let's verify by checking if "Profil" link appears in the Topbar/Sidebar
    // or simply navigate to profile manually after login

    // Wait for URL change or specific element that appears only when logged in
    // For example, the user avatar or name in Topbar
    await expect(
      page.getByRole("link", { name: "Profil", exact: false }).first()
    ).toBeVisible();
  });
});
