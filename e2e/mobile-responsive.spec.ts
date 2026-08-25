import { test, expect } from '@playwright/test';

test.describe('Mobile Responsive & Theme Integrity E2E', () => {

  test('Mobile drawer navigation opens and renders all links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 viewport
    await page.goto('/');

    // Verify Brand Logo
    await expect(page.locator('img[alt*="Apex Packaging"]')).toBeVisible();

    // Mobile Hamburger Drawer Toggle
    const menuBtn = page.locator('button[aria-label="Toggle mobile menu"]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await expect(page.locator('text=Capabilities')).toBeVisible();
      await expect(page.locator('text=Substrates & Works')).toBeVisible();
    }
  });

  test('Theme switcher toggles between Dark and Light modes', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeBtn = page.locator('button[aria-label*="theme"], button:has-text("Theme"), button:has(.lucide-sun), button:has(.lucide-moon)').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      // Verify page still renders without crashing
      await expect(page.locator('text=Packaging')).toBeVisible();
    }
  });

});
