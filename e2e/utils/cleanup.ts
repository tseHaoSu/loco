import type { Page } from '@playwright/test';
import { TEST_DATA_TAG } from '../fixtures/test-data';

/**
 * Cleanup test conversations
 */
export async function cleanupTestConversations(page: Page): Promise<void> {
  await page.goto('/conversations');

  const conversationButtons = page.getByRole('button').filter({
    has: page.locator('img[alt*="avatar"], .avatar'),
  });

  const count = await conversationButtons.count();

  for (let i = count - 1; i >= 0; i--) {
    const text = await conversationButtons.nth(i).textContent();
    if (text && text.includes(TEST_DATA_TAG)) {
      await conversationButtons.nth(i).click();
      await page.waitForURL(/\/conversations\/.+/);

      const moreButton = page.getByRole('button').filter({
        has: page.locator('svg.lucide-more-horizontal'),
      }).first();
      await moreButton.click();
      await page.getByRole('menuitem', { name: /delete/i }).click();

      await page.waitForURL(/\/conversations$/);
      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Cleanup test files
 */
export async function cleanupTestFiles(page: Page): Promise<void> {
  await page.goto('/files');
  await page.waitForLoadState('networkidle');

  const fileRows = page.locator('tbody tr');
  const count = await fileRows.count();

  for (let i = count - 1; i >= 0; i--) {
    const text = await fileRows.nth(i).textContent();
    if (text && (text.includes(TEST_DATA_TAG) || text.includes('test-'))) {
      const menuButton = fileRows.nth(i).getByRole('button').filter({
        has: page.locator('svg.lucide-more-horizontal'),
      });
      await menuButton.click();

      await page.getByRole('menuitem', { name: /delete/i }).click();

      const deleteDialog = page.getByRole('alertdialog').or(
        page.getByRole('dialog').filter({ hasText: /delete/i })
      );
      await deleteDialog.getByRole('button', { name: /delete|confirm/i }).click();

      await page.waitForLoadState('networkidle');
    }
  }
}

/**
 * Cleanup all test data
 */
export async function cleanupAllTestData(page: Page): Promise<void> {
  try {
    await cleanupTestConversations(page);
  } catch {
    // Silently continue if cleanup fails
  }

  try {
    await cleanupTestFiles(page);
  } catch {
    // Silently continue if cleanup fails
  }
}

/**
 * Global teardown function for use in Playwright config
 */
export async function globalTeardown(page: Page): Promise<void> {
  await cleanupAllTestData(page);
}
