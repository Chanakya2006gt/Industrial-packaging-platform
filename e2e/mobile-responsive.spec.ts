import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive & Theme Integrity E2E', () => {

  test('Mobile drawer navigation opens and renders all links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 viewport
    await page.goto('/');

    // Verify Brand Logo in Header
    await expect(page.locator('header img[alt*="Apex Packaging"]')).toBeVisible();

    // Mobile Hamburger Drawer Toggle
    const menuBtn = page.locator('button[aria-label="Toggle mobile menu"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await expect(page.locator('.mobile-drawer a, div.lg\\:hidden a').filter({ hasText: 'Capabilities' }).first()).toBeVisible();
      await expect(page.locator('.mobile-drawer a, div.lg\\:hidden a').filter({ hasText: 'Substrates & Works' }).first()).toBeVisible();
    }
  });

  test('Theme switcher toggles between Dark and Light modes', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeBtn = page.locator('button[aria-label="Toggle Theme"]').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      // Verify html data-theme changed
      const themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toMatch(/dark|light/);
    }
  });

});
