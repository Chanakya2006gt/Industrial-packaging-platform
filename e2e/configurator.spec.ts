import { test, expect } from '@playwright/test';

test.describe('B2B Packaging & Roll Configurator E2E', () => {

  test('Happy Path: complete 5-step custom roll label RFQ submission', async ({ page }) => {
    await page.goto('/configurator');

    // Step 1: Category & Substrate
    await expect(page.locator('text=Step 1: Select Packaging Category & Substrate')).toBeVisible();
    await page.click('text=White Gloss BOPP 60μm');
    await page.click('text=Next: Dimensions & Quantity');

    // Step 2: Dimensions & Quantity
    await expect(page.locator('text=Step 2: Physical Dimensions & Order Volume')).toBeVisible();
    await page.click('text=50,000 units');
    await page.click('text=Next: Application & Roll Details');

    // Step 3: Application & Roll Format
    await expect(page.locator('text=Step 3: Application Method & Roll Orientation')).toBeVisible();
    await page.click('text=Automatic Machine Applicator');
    await page.click('text=Dir #1');
    await page.click('text=Next: Finishes & Coatings');

    // Step 4: Finishes
    await expect(page.locator('text=Step 4: Protective Coatings & Finishes')).toBeVisible();
    await page.click('text=Next: Review & Contact Details');

    // Step 5: Review & Submit
    await expect(page.locator('text=Step 5: Review & Submit Manufacturing RFQ')).toBeVisible();
    await page.fill('input[placeholder*="Zambian Breweries"]', 'Playwright Test Brewery');
    await page.fill('input[placeholder*="Mulenga Chileshe"]', 'Test Estimator');
    await page.fill('input[placeholder*="procurement@company"]', 'test@playwright.co.zm');
    await page.fill('input[placeholder*="+260 97X"]', '+260971234567');

    await page.click('button:has-text("Submit Manufacturing RFQ")');

    // Verify Confirmation
    await expect(page.locator('text=B2B Manufacturing RFQ Received!')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Official Reference ID:')).toBeVisible();
  });

  test('Interactive 3D Mockup Container Switcher works', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.locator('text=Studio 3D Mockup')).toBeVisible();
    
    // Switch to Jug
    await page.click('button:has-text("Jug")');
    await expect(page.locator('text=HDPE Oil Jug Mockup')).toBeVisible();

    // Switch to Jar
    await page.click('button:has-text("Jar")');
    await expect(page.locator('text=Glass Honey/Food Jar Mockup')).toBeVisible();
  });

});
