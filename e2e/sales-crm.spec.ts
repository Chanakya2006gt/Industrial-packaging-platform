import { test, expect } from '@playwright/test';

test.describe('Commercial Sales CPQ Workstation & Auth Guard E2E', () => {

  test('Route Guard: Direct access to /sales without active session redirects to /sales/login', async ({ page }) => {
    await page.goto('/sales');
    await expect(page).toHaveURL(/.*\/sales\/login/);
    await expect(page.locator('text=Estimating Team Sign In')).toBeVisible();
  });

  test('Route Guard: Direct access to /admin without active session redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*\/admin\/login/);
    await expect(page.locator('text=Plant Master Console')).toBeVisible();
  });

  test('Login Fail-Closed: Attempting login with empty or invalid credentials shows error banner', async ({ page }) => {
    await page.goto('/sales/login');
    await page.fill('input[type="email"]', 'fake.staff@printfastzambia.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button:has-text("Sign In to Workstation")');

    await expect(page.locator('text=Authentication failed')).toBeVisible({ timeout: 5000 });
  });

  test('Configurator Validation: Configurator loads 3D stage and allows step navigation', async ({ page }) => {
    await page.goto('/configurator');
    await expect(page.locator('text=Packaging & Label Engineering Studio')).toBeVisible();
    await expect(page.locator('text=3D Container Virtual Prototyping Studio')).toBeVisible();
    
    // Step 1 -> Step 2
    await page.click('button:has-text("Next: Choose Substrate")');
    await expect(page.locator('text=Step 2: Substrate & Subsurface Material')).toBeVisible();
  });

});
