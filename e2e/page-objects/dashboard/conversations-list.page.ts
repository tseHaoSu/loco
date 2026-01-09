import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ConversationsListPage extends BasePage {
  readonly filterSelect: Locator;
  readonly conversationItems: Locator;
  readonly emptyState: Locator;
  readonly loadingState: Locator;
  readonly onboardingSteps: Locator;

  constructor(page: Page) {
    super(page);
    this.filterSelect = page.getByRole('combobox');
    this.conversationItems = page.getByRole('button').filter({
      has: page.locator('img[alt*="avatar"], .avatar, [class*="Avatar"]')
    });
    this.emptyState = page.getByText(/no conversations/i);
    this.loadingState = page.getByText(/loading/i);
    this.onboardingSteps = page.locator('[class*="step"]').or(
      page.getByText(/step \d+/i)
    );
  }

  async goto(): Promise<void> {
    await this.navigateTo('/conversations');
  }

  async filterByStatus(status: 'all' | 'unresolved' | 'escalated' | 'resolved'): Promise<void> {
    await this.filterSelect.click();
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).click();
    await this.waitForLoaded();
  }

  async selectConversation(index: number): Promise<void> {
    await this.conversationItems.nth(index).click();
    await this.waitForNavigation();
  }

  async selectConversationByText(text: string): Promise<void> {
    await this.page.getByRole('button').filter({ hasText: new RegExp(text, 'i') }).first().click();
    await this.waitForNavigation();
  }

  async getConversationCount(): Promise<number> {
    await this.waitForLoaded();
    return await this.conversationItems.count();
  }

  async waitForConversationsLoaded(): Promise<void> {
    await this.waitForElementHidden(this.loadingState, 10000).catch(() => {
      // Loading indicator might not exist
    });
    await this.waitForLoaded();
  }
}
