import { test } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { ProfilePage } from './page-objects/ProfilePage';
import { testConfig } from './config/testConfig';

test.describe('Profile E2E', () => {
  test('should display profile page after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await loginPage.goto();
    await loginPage.login(testConfig.email(), testConfig.password());

    await profilePage.goto();
    await profilePage.expectEmailVisible(testConfig.email());
    await profilePage.expectNameVisible('Test User');
    await profilePage.expectRoleVisible('Real Estate Agent');
    await profilePage.expectEmailVerified();
  });
});
