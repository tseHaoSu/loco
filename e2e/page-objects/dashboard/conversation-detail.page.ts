import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ConversationDetailPage extends BasePage {
  readonly moreMenuButton: Locator;
  readonly deleteMenuItem: Locator;
  readonly showDetailsMenuItem: Locator;
  readonly statusBadge: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly enhanceButton: Locator;
  readonly messages: Locator;
  readonly contactPanel: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.moreMenuButton = page.getByRole('button').filter({
      has: page.locator('svg.lucide-more-horizontal, svg.lucide-ellipsis-vertical')
    }).first();
    this.deleteMenuItem = page.getByRole('menuitem', { name: /delete/i });
    this.showDetailsMenuItem = page.getByRole('menuitem', { name: /details/i });
    this.backButton = page.getByRole('button', { name: /back/i }).or(
      page.locator('[aria-label*="back"]')
    );

    this.statusBadge = page.getByRole('button').filter({
      hasText: /unresolved|resolved|escalated/i
    }).first();

    this.messageInput = page.getByPlaceholder(/type your message/i);
    this.sendButton = page.locator('[type="submit"]').or(
      page.getByRole('button').filter({
        has: page.locator('svg.lucide-arrow-up, svg.lucide-send')
      })
    ).first();
    this.enhanceButton = page.getByRole('button', { name: /enhance/i });

    this.messages = page.locator('[class*="message"], .message, [data-message]');

    this.contactPanel = page.locator('[class*="contact"], [class*="details"]').filter({
      hasText: /session details|language|platform/i
    });
  }

  async goto(conversationId: string): Promise<void> {
    await this.navigateTo(`/conversations/${conversationId}`);
  }

  async sendMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
    await this.waitForLoaded();
  }

  async enhanceMessage(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.enhanceButton.click();
    await this.page.waitForResponse(resp => resp.url().includes('enhance') || resp.status() === 200);
  }

  async deleteConversation(): Promise<void> {
    await this.moreMenuButton.click();
    await this.deleteMenuItem.click();
    await this.page.waitForURL(/\/conversations$/);
  }

  async toggleStatus(): Promise<void> {
    await this.statusBadge.click();
    await this.waitForLoaded();
  }

  async openDetailsPanel(): Promise<void> {
    await this.moreMenuButton.click();
    await this.showDetailsMenuItem.click();
  }

  async getMessageCount(): Promise<number> {
    return await this.messages.count();
  }

  async waitForNewMessage(previousCount: number, timeout = 10000): Promise<void> {
    await this.page.waitForFunction(
      (count) => {
        const messages = document.querySelectorAll('[class*="message"], .message, [data-message]');
        return messages.length > count;
      },
      previousCount,
      { timeout }
    );
  }

  async getStatusText(): Promise<string> {
    return (await this.statusBadge.textContent()) || '';
  }

  async isMessageInputDisabled(): Promise<boolean> {
    return await this.messageInput.isDisabled();
  }
}
