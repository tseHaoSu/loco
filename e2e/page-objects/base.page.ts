import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly skeleton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.skeleton = page.locator('[class*="skeleton"]').first();
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Page might already be loaded
    });

    try {
      await expect(this.skeleton).toBeHidden({ timeout: 5000 });
    } catch {
      // Skeleton might not exist
    }
  }

  async navigateTo(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForLoaded();
  }

  getUrl(): string {
    return this.page.url();
  }

  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async waitForElementHidden(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeHidden({ timeout });
  }

  async clickAndWaitForNav(locator: Locator): Promise<void> {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      locator.click(),
    ]);
  }
}
