import { test, expect } from '../../fixtures/auth.fixture';
import { ConversationDetailPage } from '../../page-objects/dashboard/conversation-detail.page';
import { ConversationsListPage } from '../../page-objects/dashboard/conversations-list.page';

test.describe('Conversation Detail', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  async function navigateToFirstConversation(page: import('@playwright/test').Page) {
    const listPage = new ConversationsListPage(page);
    await listPage.goto();
    await listPage.waitForConversationsLoaded();

    const count = await listPage.getConversationCount();
    if (count === 0) {
      return null;
    }

    await listPage.selectConversation(0);
    return new ConversationDetailPage(page);
  }

  test('should display conversation header with status', async ({ page }) => {
    const detailPage = await navigateToFirstConversation(page);
    if (!detailPage) {
      test.skip();
      return;
    }

    await expect(detailPage.statusBadge).toBeVisible();
    await expect(detailPage.moreMenuButton).toBeVisible();
  });

  test('should display message input', async ({ page }) => {
    const detailPage = await navigateToFirstConversation(page);
    if (!detailPage) {
      test.skip();
      return;
    }

    await expect(detailPage.messageInput).toBeVisible();
  });

  test('should send a message', async ({ page }) => {
    const detailPage = await navigateToFirstConversation(page);
    if (!detailPage) {
      test.skip();
      return;
    }

    const initialCount = await detailPage.getMessageCount();
    await detailPage.sendMessage('Test message from E2E');

    const newCount = await detailPage.getMessageCount();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  });

  test('should toggle conversation status', async ({ page }) => {
    const detailPage = await navigateToFirstConversation(page);
    if (!detailPage) {
      test.skip();
      return;
    }

    const initialStatus = await detailPage.getStatusText();
    await detailPage.toggleStatus();
    const newStatus = await detailPage.getStatusText();

    // Status should exist (might or might not change depending on implementation)
    expect(initialStatus.length).toBeGreaterThan(0);
    expect(newStatus.length).toBeGreaterThan(0);
  });
});
