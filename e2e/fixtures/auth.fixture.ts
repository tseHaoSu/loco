import { test as base, expect, type Page, type Browser } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env.test') });

export const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@loco-e2e.com',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
};

export const TEST_ORG = {
  id: process.env.TEST_ORG_ID || 'org_test123',
  name: 'Test Organization',
};

const AUTH_STATE_PATH = 'e2e/.auth/user.json';

/**
 * Perform Clerk sign-in flow
 */
async function performSignIn(page: Page): Promise<void> {
  await page.goto('/sign-in');
  await page.waitForSelector('[data-clerk-component]', { timeout: 10000 });

  await page.getByLabel('Email address').fill(TEST_USER.email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();

  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await passwordInput.fill(TEST_USER.password);

  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/(conversations|$)/, { timeout: 15000 });
}

export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ page }, use) => {
    await performSignIn(page);
    await use(page);
  },
});

/**
 * Global setup to create auth state for reuse across tests
 */
export async function globalAuthSetup(browser: Browser, baseURL: string): Promise<string> {
  const page = await browser.newPage({ baseURL });

  try {
    await performSignIn(page);
    await page.context().storageState({ path: AUTH_STATE_PATH });
    return AUTH_STATE_PATH;
  } finally {
    await page.close();
  }
}

export { expect } from '@playwright/test';
