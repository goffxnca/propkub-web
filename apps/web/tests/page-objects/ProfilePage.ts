import { type Page, type Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/en/profile');
  }

  async expectEmailVisible(email: string) {
    await expect(this.page.getByText(email)).toBeVisible();
  }

  async expectNameVisible(name: string) {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }

  async expectRoleVisible(role: string) {
    await expect(this.page.getByText(role).first()).toBeVisible();
  }

  async expectEmailVerified() {
    await expect(this.page.getByText('Verified').first()).toBeVisible();
  }
}
