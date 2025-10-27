import { type Page, expect } from '@playwright/test';

export class CreatePostPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/en/account/posts/create');
  }

  async expectBasicInformationSectionVisible() {
    await expect(this.page.getByRole('heading', { name: 'Basic Information', level: 3 })).toBeVisible();
  }

  async expectImagesSectionVisible() {
    await expect(this.page.getByRole('heading', { name: 'Images', level: 3 })).toBeVisible();
  }

  async expectPropertyLocationSectionVisible() {
    await expect(this.page.getByRole('heading', { name: 'Property Location', level: 3 })).toBeVisible();
  }

  async expectConfirmationSectionVisible() {
    await expect(this.page.getByRole('heading', { name: 'Confirmation', level: 3 })).toBeVisible();
  }

  async expectAllSectionsVisible() {
    await this.expectBasicInformationSectionVisible();
    await this.expectImagesSectionVisible();
    await this.expectPropertyLocationSectionVisible();
    await this.expectConfirmationSectionVisible();
  }
}
