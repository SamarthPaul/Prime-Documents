/**
 * Section 15 — Entrepreneur Profile (sample coverage)
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#ep
 *
 * This file establishes the seed-via-API / drive-via-UI / cleanup-via-API
 * pattern that the rest of the EP suite will follow.
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';
import { seedEntrepreneur, UAT_PREFIX } from '../fixtures/data';

test.describe('PR-TC-EP · Entrepreneur Profile — role gates & basic flows', () => {

  test.describe('As Field Associate', () => {
    test.use({ storageState: '.auth/uat-fa.json' });

    test('PR-TC-EP-039 · FA cannot fetch EP outside their block via direct URL', async ({ page }) => {
      test.skip(!process.env.ADMIN_API_KEY, 'ADMIN_API_KEY required to seed cross-block EP');
      const api = await FrappeApi.asAdmin();
      let outsideEpName: string | undefined;
      try {
        const seeded = await seedEntrepreneur(api, {
          enterprenur_name: `${UAT_PREFIX} CrossBlock ${Date.now().toString(36)}`,
          // Intentionally pick a block the FA is NOT bound to. The FA user we
          // created has no block restriction yet — until that's set, this test
          // is informational. Once block-binding lands, the assert is binding.
        });
        outsideEpName = seeded.name;

        const resp = await page.goto(`/app/enterprenur-profile/${encodeURIComponent(outsideEpName)}`);
        // Expect either 403 OR a "no permission" banner OR a redirect away.
        const url = page.url();
        const status = resp?.status() ?? 200;
        const blocked =
          status === 403 ||
          (await page.locator('text=/no permission|not permitted|access denied/i').count()) > 0 ||
          !url.includes(outsideEpName);
        expect(blocked, `FA should not see cross-block EP (status=${status}, url=${url})`).toBeTruthy();
      } finally {
        if (outsideEpName) await api.deleteDoc('Enterprenur Profile', outsideEpName).catch(() => {});
        await api.dispose();
      }
    });
  });

  test.describe('As System Manager', () => {
    test.use({ storageState: '.auth/uat-sm.json' });

    test('PR-TC-EP-031 · EP list page renders', async ({ page }) => {
      await page.goto('/app/enterprenur-profile');
      // List shell present
      await expect(page.locator('text=/Enterprenur Profile/i').first()).toBeVisible();
    });

    test('PR-TC-EP-001 · create EP via UI happy path (smoke)', async ({ page }) => {
      // This is a smoke / scaffold-validation test. The real PR-TC-EP-001 (with
      // all 40 fields and KYC docs) will replace this once we lock the form
      // selectors with `data-testid` attributes in the Frappe app.
      test.fixme(true, 'Pending: stabilise selectors via data-testid on EP form.');
      await page.goto('/app/enterprenur-profile/new');
      // ... full form drive lands here once selectors stabilise
    });
  });

  test.describe('As any user · API seed sanity', () => {
    test('seed & delete an EP via admin API (proves teardown plumbing)', async () => {
      test.skip(!process.env.ADMIN_API_KEY, 'ADMIN_API_KEY required');
      const api = await FrappeApi.asAdmin();
      const seeded = await seedEntrepreneur(api);
      expect(seeded.entrepreneurName).toContain(UAT_PREFIX);
      await api.deleteDoc('Enterprenur Profile', seeded.name);
      await api.dispose();
    });
  });
});
