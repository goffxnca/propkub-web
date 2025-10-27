import { type Page, expect } from '@playwright/test';
import { getTestTimestamp } from '../../libs/date-utils';

export class CreatePostPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/en/account/posts/create');
  }

  async fillBasicInfo() {
    const timestamp = getTestTimestamp();
    const title = `Beautiful Condo in Central Bangkok [by E2E Test - ${timestamp}]`;

    await this.page.getByRole('textbox', { name: 'Title' }).fill(title);
    await this.page.getByLabel('I want to').selectOption('sale');
    await this.page.getByLabel('Asset Type').selectOption('condo');
    await this.page
      .getByLabel('Condition', { exact: true })
      .selectOption('new');
    await this.page.getByRole('spinbutton', { name: 'Price' }).fill('2000000');
    await this.page.getByRole('spinbutton', { name: 'Area Size' }).fill('25');
    await this.page.getByLabel('Bedrooms').selectOption('2');
    await this.page.getByLabel('Bathrooms').selectOption('1');
    await this.page.getByLabel('Kitchens').selectOption('1');
    await this.page.getByLabel('Parking Spaces').selectOption('1');
  }

  async fillDescription() {
    await this.page
      .locator('.ql-editor')
      .fill(
        'This beautiful 2-bedroom condo features modern amenities and a prime location in central Bangkok. The property includes fully furnished rooms with air conditioning, modern kitchen appliances, and comfortable living spaces. Building facilities include 24/7 security, fitness center, swimming pool, and parking. Walking distance to public transportation and shopping malls. Perfect for families or professionals looking for a spacious and comfortable living space in the heart of the city.'
      );
  }

  async selectFacilities() {
    await this.page.getByText('Air Conditioning', { exact: true }).click();
    await this.page.getByText('Security Guard', { exact: true }).click();
    await this.page.getByText('Clubhouse', { exact: true }).click();
  }

  async fillReferenceId(referenceId: string) {
    await this.page
      .getByRole('textbox', { name: 'Reference ID (Optional)' })
      .fill(referenceId);
  }

  async uploadImages(files: string[]) {
    const filePaths = files.map((file) => `tests/fixtures/images/${file}`);
    await this.page.locator('#thefile').setInputFiles(filePaths);
  }

  async selectLocation(
    region: string,
    province: string,
    district: string,
    subDistrict: string
  ) {
    await this.page.getByLabel('Region').selectOption(region);
    await this.page.getByLabel('Province').selectOption(province);
    await this.page
      .getByLabel('District', { exact: true })
      .selectOption(district);
    await this.page.getByLabel('Sub-District').selectOption(subDistrict);
    await this.page.waitForTimeout(5000);
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async setMapLocation(searchQuery: string) {
    await this.page.waitForTimeout(1000);
    await this.page.getByLabel('Type to search and auto-pin').fill(searchQuery);

    await this.page.getByText('Search', { exact: true }).click();

    await expect(
      this.page.getByText(/Coordinates .+ \(Pinned\)/)
    ).toBeVisible();
  }

  async confirmAndSave() {
    await this.page
      .getByRole('checkbox', { name: 'I confirm that I am the owner' })
      .check();
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async expectPostCreatedSuccessfully() {
    await expect(
      this.page.getByRole('heading', { name: 'Listing Created Successfully' })
    ).toBeVisible();
    await expect(this.page.getByText('Your listing has been')).toBeVisible();
  }

  async goToListing() {
    await this.page.getByRole('button', { name: 'Go to Listing' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Post Details' })
    ).toBeVisible();
  }

  async fillInTheForm() {
    await this.fillBasicInfo();
    await this.fillDescription();
    await this.selectFacilities();
    await this.fillReferenceId('agent-internal-01');
    await this.uploadImages(['test1.png', 'test2.png', 'test3.png']);
    await this.selectLocation('r2', 'p1', 'd1033', 's103303');
    await this.setMapLocation('Ideo Mobi Eastgate');
    await this.confirmAndSave();
  }
}
