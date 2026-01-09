import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SidebarPage extends BasePage {
  readonly sidebar: Locator;
  readonly conversationLink: Locator;
  readonly knowledgeBaseLink: Locator;
  readonly widgetCustomizationLink: Locator;
  readonly integrationsLink: Locator;
  readonly voiceAssistantLink: Locator;
  readonly billingLink: Locator;
  readonly orgSwitcherButton: Locator;
  readonly userButton: Locator;
  readonly themeToggle: Locator;
  readonly logo: Locator;
  readonly toggleSidebarButton: Locator;

  constructor(page: Page) {
    super(page);
    this.sidebar = page.locator('[data-sidebar]').or(page.getByRole('navigation'));
    this.conversationLink = page.getByRole('link', { name: /conversation$/i });
    this.knowledgeBaseLink = page.getByRole('link', { name: /knowledge base/i });
    this.widgetCustomizationLink = page.getByRole('link', { name: /widget customization/i });
    this.integrationsLink = page.getByRole('link', { name: /integrations/i });
    this.voiceAssistantLink = page.getByRole('link', { name: /voice assistant/i });
    this.billingLink = page.getByRole('link', { name: /plans.*billing/i });
    this.orgSwitcherButton = page.getByRole('button', { name: /open organization switcher/i });
    this.userButton = page.getByRole('button', { name: /open user menu/i });
    this.themeToggle = page.getByRole('button', { name: /toggle theme/i });
    this.logo = page.getByRole('link', { name: /loco/i });
    this.toggleSidebarButton = page.getByRole('button', { name: /toggle sidebar/i });
  }

  async navigateToConversations(): Promise<void> {
    await this.conversationLink.click();
    await this.waitForNavigation();
  }

  async navigateToFiles(): Promise<void> {
    await this.knowledgeBaseLink.click();
    await this.waitForNavigation();
  }

  async navigateToCustomization(): Promise<void> {
    await this.widgetCustomizationLink.click();
    await this.waitForNavigation();
  }

  async navigateToIntegrations(): Promise<void> {
    await this.integrationsLink.click();
    await this.waitForNavigation();
  }

  async navigateToVapi(): Promise<void> {
    await this.voiceAssistantLink.click();
    await this.waitForNavigation();
  }

  async navigateToBilling(): Promise<void> {
    await this.billingLink.click();
    await this.waitForNavigation();
  }

  async openOrgSwitcher(): Promise<void> {
    await this.orgSwitcherButton.click();
  }

  async openUserMenu(): Promise<void> {
    await this.userButton.click();
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }

  async toggleSidebar(): Promise<void> {
    await this.toggleSidebarButton.click();
  }

  async isActiveLink(linkLocator: Locator): Promise<boolean> {
    const ariaCurrentValue = await linkLocator.getAttribute('aria-current');
    const dataActiveValue = await linkLocator.getAttribute('data-active');
    return ariaCurrentValue === 'page' || dataActiveValue === 'true';
  }
}
