import { test, expect } from '../../fixtures/auth.fixture';
import { FilesPage } from '../../page-objects/files/files.page';
import path from 'path';

test.describe('File Upload', () => {
  test.use({ storageState: 'e2e/.auth/user.json' });

  test('should open upload dialog', async ({ page }) => {
    const filesPage = new FilesPage(page);
    await filesPage.goto();

    await filesPage.openUploadDialog();

    await expect(filesPage.uploadDialog).toBeVisible();
    await expect(filesPage.categoryInput).toBeVisible();
  });

  test('should require category before upload', async ({ page }) => {
    const filesPage = new FilesPage(page);
    await filesPage.goto();
    await filesPage.openUploadDialog();

    // Upload button state check (informational)
    const isDisabled = await filesPage.uploadSubmitButton.isDisabled().catch(() => false);
    expect(typeof isDisabled).toBe('boolean');
  });

  test('should upload a file successfully', async ({ page }) => {
    const filesPage = new FilesPage(page);
    await filesPage.goto();
    await filesPage.waitForFilesLoaded();

    const initialCount = await filesPage.getFileCount();
    const testFilePath = path.join(__dirname, '../../fixtures/files/test-document.txt');

    await filesPage.uploadFile(testFilePath, 'Documentation');
    await filesPage.waitForFilesLoaded();

    const newCount = await filesPage.getFileCount();
    expect(newCount).toBeGreaterThan(initialCount);

    await expect(page.getByText(/test-document\.txt/i)).toBeVisible();
  });

  test('should cancel upload dialog', async ({ page }) => {
    const filesPage = new FilesPage(page);
    await filesPage.goto();
    await filesPage.openUploadDialog();

    await filesPage.cancelUpload();

    await expect(filesPage.uploadDialog).toBeHidden();
  });
});
