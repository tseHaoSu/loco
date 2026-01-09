import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class SignInPage extends BasePage {
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly clerkContainer: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.clerkContainer = page.locator('[data-clerk-component]');
    this.emailInput = page.getByLabel('Email address');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.getByRole('button', { name: /sign in/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
    this.errorMessage = page.locator('[data-clerk-error], .cl-form__error, [class*="error"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/sign-in');
    await this.waitForElement(this.clerkContainer);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.clickContinue();
    await this.waitForElement(this.passwordInput);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }
}
