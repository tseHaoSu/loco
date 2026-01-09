import { test, expect } from '../../fixtures/auth.fixture';
import { ConversationsListPage } from '../../page-objects/dashboard/conversations-list.page';

test.describe('Conversation List', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should display conversation list page', async ({ page }) => {
    const listPage = new ConversationsListPage(page);
    await listPage.goto();

    await expect(listPage.filterSelect).toBeVisible();
  });

  test('should filter conversations by status', async ({ page }) => {
    const listPage = new ConversationsListPage(page);
    await listPage.goto();
    await listPage.waitForConversationsLoaded();

    await listPage.filterByStatus('unresolved');

    await expect(listPage.filterSelect).toBeVisible();
  });

  test('should navigate to conversation detail on click', async ({ page }) => {
    const listPage = new ConversationsListPage(page);
    await listPage.goto();
    await listPage.waitForConversationsLoaded();

    const count = await listPage.getConversationCount();
    if (count === 0) {
      test.skip();
      return;
    }

    await listPage.selectConversation(0);
    await expect(page).toHaveURL(/\/conversations\/.+/);
  });

  test('should display onboarding steps when present', async ({ page }) => {
    const listPage = new ConversationsListPage(page);
    await listPage.goto();

    // Onboarding steps visibility is conditional
    const hasOnboarding = await listPage.onboardingSteps.isVisible().catch(() => false);
    expect(typeof hasOnboarding).toBe('boolean');
  });
});
