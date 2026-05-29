/**
 * Section 13 — User Management (sample coverage)
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#user-mgmt
 */
import { test, expect } from '@playwright/test';

test.describe('PR-TC-UM · User Management — role gates', () => {

  test.describe('As Field Associate', () => {
    test.use({ storageState: '.auth/uat-fa.json' });

    test('PR-TC-UM-018 · FA cannot access User Management', async ({ page }) => {
      // Verified route: User Management is the SPA page /primerural/d/User Manager.
      await page.goto('/primerural/d/User%20Manager');
      await page.waitForLoadState('networkidle').catch(() => {});
      const url = page.url();

      // FA must be blocked: either bounced off the route, shown a no-permission
      // notice, OR not shown the actual user-admin surface (the seeded emails /
      // an "Add User" affordance).
      const noPermission = (await page.locator('text=/no permission|not permitted|access denied|forbidden/i').count()) > 0;
      const adminSurfaceVisible =
        (await page.getByText('uat-sm@dhwaniris.com').count()) > 0 ||
        (await page.getByRole('button', { name: /add user|new user|\+ user/i }).count()) > 0;

      const blocked = !url.includes('/d/User') || noPermission || !adminSurfaceVisible;
      expect(blocked, `FA should not see User Management (url=${url}, adminSurfaceVisible=${adminSurfaceVisible})`).toBe(true);
    });
  });

  test.describe('As Core Team IT', () => {
    // User Management is gated to Core Team IT (verified 29 May 2026: even a
    // System Manager sees "Your role can't view User Manager"). So this runs as CTI.
    test.use({ storageState: '.auth/uat-cti.json' });

    test('PR-TC-UM-026 · user list renders with the 6 UAT users present', async ({ page }) => {
      await page.goto('/primerural/d/User%20Manager');
      await page.waitForLoadState('networkidle').catch(() => {});
      const search = page.getByPlaceholder(/search|filter/i).first();
      for (const email of [
        'uat-sm@dhwaniris.com',
        'uat-cti@dhwaniris.com',
        'uat-ctp@dhwaniris.com',
        'uat-fa@dhwaniris.com',
        'uat-selco@dhwaniris.com',
        'uat-designer@dhwaniris.com',
      ]) {
        // Use the search box if the page has one; otherwise rely on the rendered list.
        if (await search.count()) {
          await search.fill(email).catch(() => {});
          await page.waitForTimeout(400);
        }
        await expect(page.getByText(email).first()).toBeVisible({ timeout: 10_000 });
        if (await search.count()) await search.fill('').catch(() => {});
      }
    });
  });
});
