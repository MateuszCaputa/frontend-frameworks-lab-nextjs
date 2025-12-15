import { test, expect } from "@playwright/test";

/**
 * (Lab 10, Task 2)
 * Navigation Tests.
 * Verifies that critical navigation paths (like accessing the login page) work correctly.
 */
test("has link to login page and navigates correctly", async ({ page }) => {
  // 1. Go to Home Page
  await page.goto("/");

  // 2. Find the "Logowanie" link.
  // We use getByRole for better accessibility testing.
  // Note: There might be two links (one in navbar, one in body), so we take the first valid one or distinguish them.
  // Using a specific locator for the Topbar link:
  const loginLink = page.getByRole("link", { name: "Logowanie" }).first();

  await expect(loginLink).toBeVisible();

  // 3. Simulate click
  await loginLink.click();

  // 4. Assert URL matches the sign-in page
  await expect(page).toHaveURL(/.*\/user\/signin/);

  // 5. Assert the destination page has the correct header
  // Looking for "Zaloguj się danymi konta" or similar text we implemented in Lab 7
  await expect(page.getByText("Zaloguj się danymi konta")).toBeVisible();
});
