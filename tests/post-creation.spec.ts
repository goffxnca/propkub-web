import { test } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { CreatePostPage } from './page-objects/CreatePostPage';
import { testConfig } from './config/testConfig';

test.describe('Post Creation E2E', () => {
  test('should display all sections on create post page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const createPostPage = new CreatePostPage(page);

    await loginPage.goto();
    await loginPage.login(testConfig.email(), testConfig.password());

    await createPostPage.goto();
    await createPostPage.expectAllSectionsVisible();
  });
});
