import type { Page, Locator } from '@playwright/test';

/**
 * Wait for a Convex query to complete
 */
export async function waitForConvexQuery(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for element to be visible and stable (no animation)
 */
export async function waitForStableElement(locator: Locator, timeout = 5000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
  await locator.evaluate((el) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 300);
    });
  });
}

/**
 * Wait for toast notification to appear
 */
export async function waitForToast(page: Page, message?: string, timeout = 5000): Promise<void> {
  const toastLocator = message
    ? page.locator('[data-sonner-toast], [role="status"]').filter({ hasText: message })
    : page.locator('[data-sonner-toast], [role="status"]').first();

  await toastLocator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for toast to disappear
 */
export async function waitForToastHidden(page: Page, timeout = 5000): Promise<void> {
  const toastLocator = page.locator('[data-sonner-toast], [role="status"]').first();
  await toastLocator.waitFor({ state: 'hidden', timeout }).catch(() => {
    // Toast might have already disappeared
  });
}

/**
 * Wait for dialog to open
 */
export async function waitForDialog(page: Page, timeout = 5000): Promise<void> {
  await page.getByRole('dialog').first().waitFor({ state: 'visible', timeout });
}

/**
 * Wait for dialog to close
 */
export async function waitForDialogClosed(page: Page, timeout = 5000): Promise<void> {
  await page.getByRole('dialog').first().waitFor({ state: 'hidden', timeout }).catch(() => {
    // Dialog might have already closed
  });
}

/**
 * Wait for specific number of elements
 */
export async function waitForElementCount(
  locator: Locator,
  count: number,
  timeout = 5000
): Promise<void> {
  await locator.first().waitFor({ state: 'attached', timeout });
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const currentCount = await locator.count();
    if (currentCount === count) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Expected ${count} elements, but found ${await locator.count()}`);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}
