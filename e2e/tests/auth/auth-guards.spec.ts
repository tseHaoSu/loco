import { test, expect } from '@playwright/test';

test.describe('Auth Guards', () => {
  test('should redirect unauthenticated user to sign-in from /conversations', async ({ page }) => {
    await page.goto('/conversations');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should redirect unauthenticated user to sign-in from /files', async ({ page }) => {
    await page.goto('/files');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should redirect unauthenticated user to sign-in from /customization', async ({ page }) => {
    await page.goto('/customization');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should redirect unauthenticated user to sign-in from /integrations', async ({ page }) => {
    await page.goto('/integrations');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should allow access to landing page without auth', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /transform.*customer/i })).toBeVisible();
  });

  test('should allow access to sign-in page without auth', async ({ page }) => {
    await page.goto('/sign-in');
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.locator('[data-clerk-component]')).toBeVisible();
  });

  test('should allow access to sign-up page without auth', async ({ page }) => {
    await page.goto('/sign-up');
    await expect(page).toHaveURL(/\/sign-up/);
    await expect(page.locator('[data-clerk-component]')).toBeVisible();
  });
});
