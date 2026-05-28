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
      const deepLink = '/app/enterprenur-profile';
      await page.goto(deepLink);
      await expect(page).toHaveURL(/\/login/);
      // Frappe encodes the redirect into the login URL — verify it round-trips
      expect(page.url()).toMatch(/redirect-to|next/);
    });

    test('PR-TC-XC-004 · invalid route shows friendly 404, not a stack trace', async ({ page }) => {
      await page.goto('/app/this-page-does-not-exist');
      const body = await page.locator('body').innerText();
      expect(body).not.toMatch(/Traceback|File ".*\.py"|frappe\.exceptions/);
    });
  });

  test.describe('Authenticated as System Manager', () => {
    test.use({ storageState: '.auth/uat-sm.json' });

    test('PR-TC-XC-002 · authenticated user landing on base URL goes to landing', async ({ page }) => {
      await page.goto('/');
      // SM should land somewhere inside /app — not on /login
      await expect(page).not.toHaveURL(/\/login/);
      await expect(page).toHaveURL(/\/app/);
      const shell = new AppShell(page);
      await shell.expectShellRendered();
    });

    test('PR-TC-XC-007 · browser tab title is route-specific (not generic "Frappe")', async ({ page }) => {
      await page.goto('/app');
      const title = await page.title();
      expect(title).not.toMatch(/^Frappe Desk$/);
      expect(title.length).toBeGreaterThan(0);
    });

    test('PR-TC-XC-009 · refresh on filtered page preserves state via URL params', async ({ page }) => {
      // This is a placeholder — we'll fill in once a known filter-bearing page (EP Status Monitor)
      // is reachable under SM. Marked test.fail to make this visible until implemented.
      test.fail(true, 'Pending: confirm EP Status Monitor URL + filter param shape.');
      await page.goto('/app/ep-status-monitor?district=East+Khasi+Hills');
      await page.reload();
      expect(page.url()).toContain('district=East+Khasi+Hills');
    });
  });
});
