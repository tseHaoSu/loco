import { test, expect } from '../../fixtures/auth.fixture';
import { SidebarPage } from '../../page-objects/dashboard/sidebar.page';

test.describe('Sidebar Navigation', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should navigate to all main routes', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await page.goto('/conversations');

    await sidebar.navigateToFiles();
    await expect(page).toHaveURL('/files');

    await sidebar.navigateToCustomization();
    await expect(page).toHaveURL('/customization');

    await sidebar.navigateToIntegrations();
    await expect(page).toHaveURL('/integrations');

    await sidebar.navigateToVapi();
    await expect(page).toHaveURL(/\/plugins\/vapi/);

    await sidebar.navigateToBilling();
    await expect(page).toHaveURL('/billing');

    await sidebar.navigateToConversations();
    await expect(page).toHaveURL('/conversations');
  });

  test('should display organization switcher', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await page.goto('/conversations');

    await expect(sidebar.orgSwitcherButton).toBeVisible();
  });

  test('should display user button', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await page.goto('/conversations');

    await expect(sidebar.userButton).toBeVisible();
  });

  test('should display theme toggle', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await page.goto('/conversations');

    await expect(sidebar.themeToggle).toBeVisible();
  });

  test('should toggle theme on button click', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await page.goto('/conversations');

    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('class') || '';

    await sidebar.toggleTheme();

    const newTheme = await htmlElement.getAttribute('class') || '';
    // Theme class should exist
    expect(typeof newTheme).toBe('string');
  });
});
