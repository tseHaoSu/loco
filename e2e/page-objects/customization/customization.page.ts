import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class CustomizationPage extends BasePage {
  readonly saveButton: Locator;
  readonly resetButton: Locator;
  readonly positionSelect: Locator;
  readonly colorInput: Locator;
  readonly themeSelect: Locator;
  readonly previewWidget: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.getByRole('button', { name: /save|update/i });
    this.resetButton = page.getByRole('button', { name: /reset|default/i });
    this.positionSelect = page.getByLabel(/position/i).or(
      page.locator('select[name*="position"], [data-field="position"]')
    );
    this.colorInput = page.locator('input[type="color"]').or(
      page.getByLabel(/color/i)
    );
    this.themeSelect = page.getByLabel(/theme/i).or(
      page.locator('select[name*="theme"]')
    );
    this.previewWidget = page.locator('[data-widget-preview], .widget-preview, iframe');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/customization');
  }

  async selectPosition(position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'): Promise<void> {
    if (await this.positionSelect.isVisible().catch(() => false)) {
      await this.positionSelect.selectOption(position);
    }
  }

  async setColor(color: string): Promise<void> {
    if (await this.colorInput.isVisible().catch(() => false)) {
      await this.colorInput.fill(color);
    }
  }

  async selectTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    if (await this.themeSelect.isVisible().catch(() => false)) {
      await this.themeSelect.selectOption(theme);
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveButton.click();
    await this.waitForLoaded();
  }

  async resetToDefaults(): Promise<void> {
    await this.resetButton.click();
    await this.waitForLoaded();
  }

  async waitForPreviewLoaded(): Promise<void> {
    if (await this.previewWidget.isVisible().catch(() => false)) {
      await this.waitForElement(this.previewWidget);
    }
  }
}
