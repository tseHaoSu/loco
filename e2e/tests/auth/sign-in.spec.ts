import { test, expect } from '@playwright/test';
import { SignInPage } from '../../page-objects/auth/sign-in.page';
import { TEST_USER } from '../../fixtures/auth.fixture';

test.describe('Sign In', () => {
  test('should display sign in form', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await expect(signInPage.emailInput).toBeVisible();
    await expect(signInPage.continueButton).toBeVisible();
    await expect(signInPage.signUpLink).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await signInPage.signIn('invalid@email.com', 'wrongpassword');

    await expect(page.getByText(/invalid|incorrect|couldn't|error/i)).toBeVisible({ timeout: 5000 });
  });

  test('should redirect to conversations after successful login', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await signInPage.signIn(TEST_USER.email, TEST_USER.password);

    await expect(page).toHaveURL(/\/(conversations|$)/, { timeout: 15000 });
  });

  test('should navigate to sign up page when clicking sign up link', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.goto();

    await signInPage.clickSignUpLink();

    await expect(page).toHaveURL(/\/sign-up/);
  });
});
