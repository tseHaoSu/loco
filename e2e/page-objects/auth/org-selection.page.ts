import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class OrgSelectionPage extends BasePage {
  readonly clerkOrgSwitcher: Locator;
  readonly createOrgButton: Locator;
  readonly orgList: Locator;
  readonly orgItems: Locator;
  readonly orgNameInput: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    super(page);
    this.clerkOrgSwitcher = page.locator('[data-clerk-organization-list]').or(
      page.locator('[data-clerk-component="organizationSwitcher"]')
    );
    this.createOrgButton = page.getByRole('button', { name: /create organization/i });
    this.orgList = page.getByRole('list').filter({ has: page.locator('[data-clerk-org-button]') });
    this.orgItems = page.locator('[data-clerk-org-button]');
    this.orgNameInput = page.getByLabel(/organization name/i).or(page.getByPlaceholder(/organization name/i));
    this.createButton = page.getByRole('button', { name: /create/i });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/org-selection');
    await this.waitForElement(this.clerkOrgSwitcher);
  }

  async selectOrganization(index: number): Promise<void> {
    await this.orgItems.nth(index).click();
  }

  async selectOrganizationByName(name: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(name, 'i') }).click();
  }

  async getOrganizationCount(): Promise<number> {
    return await this.orgItems.count();
  }

  async clickCreateOrganization(): Promise<void> {
    await this.createOrgButton.click();
  }

  async fillOrganizationName(name: string): Promise<void> {
    await this.orgNameInput.fill(name);
  }

  async createOrganization(name: string): Promise<void> {
    await this.clickCreateOrganization();
    await this.waitForElement(this.orgNameInput);
    await this.fillOrganizationName(name);
    await this.createButton.click();
  }
}
