import { type Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', {
      name: 'Login',
      exact: true
    });
  }

  async goto() {
    await this.page.goto('/en/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForTimeout(1000);
  }

  async expectLoginSuccessful() {
    await expect(this.page).toHaveURL(/\/profile/, {
      timeout: 10000
    });
  }
}
