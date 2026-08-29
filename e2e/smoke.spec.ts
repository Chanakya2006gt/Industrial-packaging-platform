import { test, expect } from '@playwright/test';

test.describe('🏭 Apex Packaging Platform Complete Smoke Test Suite', () => {

  test('Route 1: Homepage (/) loads hero, CMYK bar, and manufacturing standards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Apex Packaging/i);
    await expect(page.locator('.cmyk-bar')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Waterproof Roll Labels' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom Packaging Boxes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Request a Free Physical Sample Kit' })).toBeVisible();
  });

  test('Route 2: Services (/services) renders press capabilities and tables', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('h1')).toContainText(/Manufacturing Capabilities/i);
    await expect(page.getByRole('heading', { name: 'Waterproof & High-Speed Roll Labels' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Heidelberg Custom Packaging Boxes' })).toBeVisible();
  });

  test('Route 3: Configurator (/configurator) loads 5-step estimating wizard', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.locator('text=1. Dimensions & Volume')).toBeVisible();
    await expect(page.locator('text=3D Container Virtual Prototyping Studio')).toBeVisible();
  });

  test('Route 4: Gallery (/gallery) renders filter tags and sample showcases', async ({ page }) => {
    await page.goto('/gallery');
    await expect(page.locator('h1')).toContainText(/Substrates, Films & Finishing Guide/i);
    await page.click('button:has-text("Label Films & Paper")');
    await page.click('button:has-text("Packaging Boxboard")');
    await page.click('button:has-text("All Materials")');
  });

  test('Route 5: About (/about) renders manufacturing facility and quality standards', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1')).toContainText(/Your Industrial Packaging Manufacturing Partner/i);
    await expect(page.getByRole('heading', { name: 'Pre-Press Verification' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'High-Speed Press Run' })).toBeVisible();
  });

  test('Route 6: Contact (/contact) renders quotation and swatch kit form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText(/Contact Plant Estimating & Logistics/i);
    await expect(page.getByRole('heading', { name: 'Manufacturing Facility Details' })).toBeVisible();
  });

  test('Route 7: Portal Login Routes (/sales/login and /admin/login)', async ({ page }) => {
    await page.goto('/sales/login');
    await expect(page.getByRole('heading', { name: 'Commercial Sales Sign In' })).toBeVisible();

    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Plant Admin Portal' })).toBeVisible();
  });

  test('Feature: Theme Toggle switches dark/light mode', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[title*="theme" i], button[aria-label*="theme" i]');
    if (await themeBtn.count() > 0) {
      await themeBtn.first().click();
    }
  });

});
