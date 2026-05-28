/**
 * Section 13 — User Management (sample coverage)
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#user-mgmt
 */
import { test, expect } from '@playwright/test';

test.describe('PR-TC-UM · User Management — role gates', () => {

  test.describe('As Field Associate', () => {
    test.use({ storageState: '.auth/uat-fa.json' });

    test('PR-TC-UM-018 · FA cannot access User Management', async ({ page }) => {
      const resp = await page.goto('/app/user');
      // Accept 403, or a redirect away from /app/user, or a "no permission" banner
      const url = page.url();
      const status = resp?.status() ?? 200;

      const blocked =
        status === 403 ||
        !url.includes('/app/user') ||
        (await page.locator('text=/no permission|not permitted|access denied/i').count()) > 0;

      expect(blocked, `FA should not be able to open /app/user (status=${status}, url=${url})`).toBe(true);
    });
  });

  test.describe('As System Manager', () => {
    test.use({ storageState: '.auth/uat-sm.json' });

    test('PR-TC-UM-026 · user list renders with the 6 UAT users present', async ({ page }) => {
      await page.goto('/app/user');
      // The 6 UAT users seeded in §3 should all be findable
      for (const email of [
        'uat-sm@dhwaniris.com',
        'uat-cti@dhwaniris.com',
        'uat-ctp@dhwaniris.com',
        'uat-fa@dhwaniris.com',
        'uat-selco@dhwaniris.com',
        'uat-designer@dhwaniris.com',
      ]) {
        // Frappe Desk's list view renders rows lazily — use a generous search
        await page.getByPlaceholder(/search|filter/i).first().fill(email).catch(() => {});
        await expect(page.getByText(email).first()).toBeVisible({ timeout: 10_000 });
        await page.getByPlaceholder(/search|filter/i).first().fill('').catch(() => {});
      }
    });
  });
});
