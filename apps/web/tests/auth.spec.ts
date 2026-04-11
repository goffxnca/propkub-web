import { test } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { testConfig } from './config/testConfig';

test.describe('Authentication E2E', () => {
  test('should successfully login and redirect to profile page', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testConfig.email(), testConfig.password());
    await loginPage.expectLoginSuccessful();
  });
});
