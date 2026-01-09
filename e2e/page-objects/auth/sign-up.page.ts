import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SignUpPage extends BasePage {
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly signInLink: Locator;
  readonly clerkContainer: Locator;
  readonly errorMessage: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.clerkContainer = page.locator('[data-clerk-component]');
    this.emailInput = page.getByLabel('Email address');
    this.firstNameInput = page.getByLabel('First name');
    this.lastNameInput = page.getByLabel('Last name');
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.signUpButton = page.getByRole('button', { name: /sign up/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.errorMessage = page.locator('[data-clerk-error], .cl-form__error, [class*="error"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/sign-up');
    await this.waitForElement(this.clerkContainer);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillNames(firstName: string, lastName: string): Promise<void> {
    if (await this.firstNameInput.isVisible().catch(() => false)) {
      await this.firstNameInput.fill(firstName);
    }
    if (await this.lastNameInput.isVisible().catch(() => false)) {
      await this.lastNameInput.fill(lastName);
    }
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      // Password field might not appear depending on flow
    });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignUp(): Promise<void> {
    await this.signUpButton.click();
  }

  async signUp(email: string, password: string, firstName = 'Test', lastName = 'User'): Promise<void> {
    await this.fillEmail(email);
    await this.fillNames(firstName, lastName);
    await this.clickContinue();

    if (await this.passwordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.fillPassword(password);
    }

    await this.clickSignUp();
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }
}
