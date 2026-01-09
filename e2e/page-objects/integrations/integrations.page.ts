import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class IntegrationsPage extends BasePage {
  readonly embedCodeCard: Locator;
  readonly copyCodeButton: Locator;
  readonly embedCodeBlock: Locator;
  readonly widgetPreview: Locator;
  readonly widgetIframe: Locator;
  readonly positionSelect: Locator;
  readonly organizationIdInput: Locator;

  constructor(page: Page) {
    super(page);
    this.embedCodeCard = page.locator('[class*="embed"], [class*="code"]').filter({
      hasText: /embed|code|script/i
    }).first();
    this.copyCodeButton = page.getByRole('button', { name: /copy|clipboard/i });
    this.embedCodeBlock = page.locator('pre, code[class*="language"]').first();
    this.widgetPreview = page.locator('[class*="preview"]').or(
      page.getByText(/preview/i).locator('..')
    );
    this.widgetIframe = page.locator('iframe[src*="widget"]').or(
      page.locator('iframe').filter({ hasText: /chat|widget/i })
    );
    this.positionSelect = page.getByLabel(/position/i).or(
      page.locator('select[name*="position"]')
    );
    this.organizationIdInput = page.getByLabel(/organization.*id/i).or(
      page.locator('input[name*="organizationId"], input[placeholder*="organization"]')
    );
  }

  async goto(): Promise<void> {
    await this.navigateTo('/integrations');
  }

  async copyEmbedCode(): Promise<void> {
    await this.copyCodeButton.click();
    await this.waitForLoaded();
  }

  async getEmbedCode(): Promise<string> {
    return (await this.embedCodeBlock.textContent()) || '';
  }

  async selectWidgetPosition(position: string): Promise<void> {
    if (await this.positionSelect.isVisible().catch(() => false)) {
      await this.positionSelect.selectOption(position);
      await this.waitForLoaded();
    }
  }

  async fillOrganizationId(orgId: string): Promise<void> {
    if (await this.organizationIdInput.isVisible().catch(() => false)) {
      await this.organizationIdInput.fill(orgId);
    }
  }

  async waitForWidgetPreview(): Promise<void> {
    try {
      await this.waitForElement(this.widgetPreview, 5000);
    } catch {
      // Preview might not be visible
    }
  }

  async waitForWidgetIframeLoaded(): Promise<void> {
    if (await this.widgetIframe.isVisible().catch(() => false)) {
      await this.widgetIframe.waitFor({ state: 'attached' });
      await this.waitForLoaded();
    }
  }

  async isWidgetPreviewVisible(): Promise<boolean> {
    return await this.widgetPreview.isVisible().catch(() => false);
  }
}
