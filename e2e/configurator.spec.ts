import { test, expect } from '@playwright/test';

test.describe('B2B Packaging & Roll Configurator E2E', () => {

  test('Happy Path: complete 5-step custom roll label RFQ submission', async ({ page }) => {
    await page.goto('/configurator');

    // Step 1: Format & Dimensions
    await expect(page.locator('text=1. Dimensions & Volume')).toBeVisible();
    await page.click('button:has-text("Next: Choose Substrate")');

    // Step 2: Substrate Material
    await expect(page.locator('text=Step 2: Substrate & Subsurface Material')).toBeVisible();
    await page.click('button:has-text("Next: Application & Roll Details")');

    // Step 3: Application & Roll Format
    await expect(page.locator('text=Step 3: Application Method & Roll Orientation')).toBeVisible();
    await page.click('button:has-text("Next: Finishes & Coatings")');

    // Step 4: Finishes
    await expect(page.locator('text=Step 4: Protective Coatings & Finishes')).toBeVisible();
    await page.click('button:has-text("Next: Review & Contact Details")');

    // Step 5: Review & Submit
    await expect(page.locator('text=Step 5: Review & Submit Manufacturing RFQ')).toBeVisible();
    await page.fill('input[placeholder*="Apex Bottling"]', 'Playwright Test Brewery');
    await page.fill('input[placeholder*="David Vance"]', 'Test Estimator');
    await page.fill('input[placeholder*="procurement@company"]', 'test@playwright.demo');
    await page.fill('input[placeholder*="+1 (555)"]', '+15550192834');

    await page.click('button:has-text("Submit Manufacturing RFQ")');

    // Verify Confirmation
    await expect(page.locator('text=RFQ Dispatched to Engineering Desk')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Official Reference:')).toBeVisible();
  });

  test('Interactive 3D Mockup Container Switcher works', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.locator('text=3D Container Virtual Prototyping Studio')).toBeVisible();
    
    // Switch to Jerry Can
    await page.click('button:has-text("5L Jerry Can")');
    await expect(page.locator('button:has-text("5L Jerry Can")')).toHaveClass(/bg-slate-900|dark:bg-white/);

    // Switch to Glass Jar
    await page.click('button:has-text("Glass Honey Jar")');
    await expect(page.locator('button:has-text("Glass Honey Jar")')).toHaveClass(/bg-slate-900|dark:bg-white/);
  });

});
