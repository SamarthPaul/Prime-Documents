/**
 * Section 4 — Application Entry & Routing (cross-cutting)
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#entry
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppShell } from '../pages/AppShell';

test.describe('PR-TC-XC-ENTRY · Application entry & routing', () => {

  test.describe('Unauthenticated', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('PR-TC-XC-001 · base URL redirects unauthenticated user to /login', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/login/);
      const login = new LoginPage(page);
      await expect(login.emailInput()).toBeVisible();
      await expect(login.passwordInput()).toBeVisible();
    });

    test('PR-TC-XC-003 · deep link while logged out preserves redirect intent', async ({ page }) => {
      // Verified route: the product list lives at /primerural/entrepreneurs.
      const deepLink = '/primerural/entrepreneurs';
      await page.goto(deepLink);
      await expect(page).toHaveURL(/\/login/);
      // The login URL should carry the intended destination so the user lands
      // back on it after authenticating.
      expect(page.url()).toMatch(/redirect|next|to=/i);
    });

    test('PR-TC-XC-004 · invalid route shows friendly 404, not a stack trace', async ({ page }) => {
      await page.goto('/primerural/this-route-does-not-exist');
      const body = await page.locator('body').innerText();
      expect(body).not.toMatch(/Traceback|File ".*\.py"|frappe\.exceptions/);
    });
  });

  test.describe('Authenticated as System Manager', () => {
    test.use({ storageState: '.auth/uat-sm.json' });

    test('PR-TC-XC-002 · authenticated user landing on base URL goes to landing', async ({ page }) => {
      await page.goto('/');
      // SM should land in the product SPA (/primerural), not on /login.
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page).toHaveURL(/\/primerural/);
      const shell = new AppShell(page);
      await shell.expectShellRendered();
    });

    test('PR-TC-XC-007 · browser tab title is set (not generic "Frappe Desk")', async ({ page }) => {
      await page.goto('/primerural/');
      const title = await page.title();
      expect(title).not.toMatch(/^Frappe Desk$/);
      expect(title.length).toBeGreaterThan(0);
    });

    test('PR-TC-XC-009 · refresh on filtered Landscape preserves filter param in URL', async ({ page }) => {
      // Shallow check: the Landscape filter param survives a reload (URL retention).
      // TODO: strengthen to assert the filter is actually re-applied to the map/list
      // once we lock the filter param shape the SPA reads on load.
      await page.goto('/primerural/?sector=Agriculture');
      await page.reload();
      expect(page.url()).toContain('sector=Agriculture');
    });
  });
});
