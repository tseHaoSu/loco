import type { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class FilesPage extends BasePage {
  readonly uploadButton: Locator;
  readonly fileTable: Locator;
  readonly fileRows: Locator;
  readonly emptyState: Locator;

  readonly uploadDialog: Locator;
  readonly filenameInput: Locator;
  readonly categoryInput: Locator;
  readonly dropzone: Locator;
  readonly fileInput: Locator;
  readonly uploadSubmitButton: Locator;
  readonly uploadCancelButton: Locator;

  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deleteCancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.uploadButton = page.getByRole('button', { name: /upload/i });
    this.fileTable = page.getByRole('table');
    this.fileRows = page.locator('tbody tr');
    this.emptyState = page.getByText(/no files/i);

    this.uploadDialog = page.getByRole('dialog').filter({ hasText: /upload/i });
    this.filenameInput = page.getByLabel(/filename/i).or(page.getByPlaceholder(/filename/i));
    this.categoryInput = page.getByLabel(/category/i).or(page.getByPlaceholder(/category/i));
    this.dropzone = page.locator('[data-dropzone]').or(page.getByText(/drag.*drop|choose file/i));
    this.fileInput = page.locator('input[type="file"]');
    this.uploadSubmitButton = page.getByRole('button', { name: /^upload$/i });
    this.uploadCancelButton = page.getByRole('button', { name: /cancel/i });

    this.deleteDialog = page.getByRole('alertdialog').or(
      page.getByRole('dialog').filter({ hasText: /delete|remove/i })
    );
    this.deleteConfirmButton = this.deleteDialog.getByRole('button', { name: /delete|confirm/i });
    this.deleteCancelButton = this.deleteDialog.getByRole('button', { name: /cancel/i });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/files');
  }

  async openUploadDialog(): Promise<void> {
    await this.uploadButton.click();
    await this.waitForElement(this.uploadDialog);
  }

  async selectFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async fillCategory(category: string): Promise<void> {
    await this.categoryInput.fill(category);
  }

  async fillFilename(filename: string): Promise<void> {
    if (await this.filenameInput.isVisible().catch(() => false)) {
      await this.filenameInput.fill(filename);
    }
  }

  async clickUploadSubmit(): Promise<void> {
    await this.uploadSubmitButton.click();
  }

  async uploadFile(filePath: string, category: string, customFilename?: string): Promise<void> {
    await this.openUploadDialog();
    await this.fillCategory(category);
    if (customFilename) {
      await this.fillFilename(customFilename);
    }
    await this.selectFile(filePath);
    await this.clickUploadSubmit();

    await this.waitForElementHidden(this.uploadDialog, 10000);
    await this.waitForLoaded();
  }

  async cancelUpload(): Promise<void> {
    await this.uploadCancelButton.click();
    await this.waitForElementHidden(this.uploadDialog);
  }

  getFileRow(fileName: string): Locator {
    return this.fileRows.filter({ hasText: fileName });
  }

  async openFileMenu(fileName: string): Promise<void> {
    const row = this.getFileRow(fileName);
    await row.getByRole('button').filter({
      has: this.page.locator('svg.lucide-more-horizontal, svg.lucide-ellipsis-vertical')
    }).click();
  }

  async deleteFileByName(fileName: string): Promise<void> {
    await this.openFileMenu(fileName);
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.waitForElement(this.deleteDialog);
    await this.deleteConfirmButton.click();

    await this.waitForElementHidden(this.deleteDialog);
    await this.waitForLoaded();
  }

  async cancelDelete(): Promise<void> {
    await this.deleteCancelButton.click();
    await this.waitForElementHidden(this.deleteDialog);
  }

  async getFileCount(): Promise<number> {
    return await this.fileRows.count();
  }

  async waitForFilesLoaded(): Promise<void> {
    await this.waitForLoaded();
  }
}
