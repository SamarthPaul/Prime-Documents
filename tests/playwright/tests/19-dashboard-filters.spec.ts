/**
 * Section 19 — Dashboard filters: cascading + KPI recompute.
 *
 * Cascade source-of-truth is the masters (verified): Block.district → District,
 * Business Basket.sector → Sector. These tests derive the expected child list
 * from the masters via API and assert the Landscape dashboard's dependent
 * dropdowns honour it — so a broken cascade is caught in code.
 *
 * NOTE on maps: the Landscape map is Leaflet with the CANVAS renderer — pins are
 * drawn on a <canvas>, NOT as DOM markers, so DOM marker-counting is invalid.
 * Map cases (geo capture / plotting / boundaries / block drill-down) are in
 * 19-dashboard-maps and use the Leaflet layer object / visual snapshots.
 *
 * BRD: test-cases.html #dashboards
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';

test.use({ storageState: '.auth/uat-sm.json' });

test('PR-TC-DB-EPS-007 · selecting a filter recomputes the KPI counts', async ({ page }) => {
  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const totalBefore = await page.evaluate(() => {
    const m = document.querySelector('main')!.innerText;
    return Number((m.match(/(\d+)\s*\n\s*(?:Total|Filtered) Entrepreneurs/i) || [])[1] || -1);
  });
  await page.locator('main select').first().selectOption('Food Processing').catch(() => {});
  await page.waitForTimeout(600);
  const totalAfter = await page.evaluate(() => {
    const m = document.querySelector('main')!.innerText;
    return Number((m.match(/(\d+)\s*\n\s*(?:Total|Filtered) Entrepreneurs/i) || [])[1] || -1);
  });
  expect(totalAfter, `KPI should recompute on Sector filter (before=${totalBefore}, after=${totalAfter})`).toBeLessThan(totalBefore);
});

test('PR-TC-DB-EPS-005 · Sector→Business Basket dropdown cascades (basket filtered by sector)', async ({ page, request }) => {
  test.skip(!process.env.ADMIN_API_KEY, 'admin token required to derive basket→sector map');
  // Expected: when a Sector is chosen, the Basket dropdown lists only baskets
  // whose master `sector` == that Sector (plus the "All" option).
  const api = await FrappeApi.asAdmin();
  const baskets = await api.list<{ name: string; sector: string }>('Business Basket', {
    fields: ['name', 'sector'], limit: 200,
  });
  await api.dispose();
  // pick a sector that has baskets AND where other sectors' baskets exist (to prove filtering)
  const bySector: Record<string, string[]> = {};
  for (const b of baskets) (bySector[b.sector] ||= []).push(b.name);
  const sector = Object.keys(bySector).find((s) => s && bySector[s].length && baskets.some((b) => b.sector && b.sector !== s));
  test.skip(!sector, 'no suitable sector/basket data to test cascade');
  const expected = new Set(bySector[sector!]);

  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.locator('main select').first().selectOption(sector!).catch(() => {});
  await page.waitForTimeout(600);
  const shown = await page.evaluate(() =>
    [...document.querySelectorAll('main select')][1] // basket dropdown
      ? [...([...document.querySelectorAll('main select')][1] as HTMLSelectElement).options]
          .map((o) => o.text).filter((t) => !/^all /i.test(t))
      : []);
  const leaked = shown.filter((b) => !expected.has(b));
  expect(leaked,
    `Basket dropdown for Sector="${sector}" should list only its baskets (${[...expected].join(', ')}), but also showed: ${leaked.join(', ')}`
  ).toEqual([]);
});

test('PR-TC-DB-EPS-006 · District→Block cascade filter is available on the dashboard', async ({ page }) => {
  // Verified 29 May: the Landscape exposes only Sector/Basket/Cohort/Stage/Status —
  // there is NO District or Block filter — and the "Status Monitor" nav link is a
  // dead link (href=null, click does not route). So District→Block cascade cannot
  // exist. This asserts the filter is present (currently fails = the gap).
  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const hasDistrictFilter = await page.evaluate(() =>
    // ONLY inspect filter controls (select options / placeholders), not body text
    // (the KPI subtitle "Across all districts" must not count as a filter).
    [...document.querySelectorAll('main select')].some((s) =>
      [...(s as HTMLSelectElement).options].some((o) => /^(all )?(district|block)/i.test(o.text.trim()))));
  expect(hasDistrictFilter, 'dashboard should expose a District (and cascading Block) filter').toBe(true);
});

test('PR-TC-DB-VIS-001 · Village Visits mode updates KPIs to village-visit context (GPS pin count)', async ({ page }) => {
  // Requirement (user 29 May): GPS-Verified should show entrepreneur GPS-pin count
  // in Entrepreneurs mode, and VILLAGE-VISIT GPS-pin count when Village Visits is
  // active. Verified the cards stay entrepreneur-centric (Total Entrepreneurs / GPS=6)
  // after toggling — so this currently fails = the gap.
  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const readGps = () => page.evaluate(() => {
    const m = document.querySelector('main')!.innerText;
    return {
      gps: Number((m.match(/(\d+)\s*\n\s*GPS Verified/i) || [])[1] || -1),
      primaryLabel: (m.match(/\d+\s*\n\s*(Total [A-Za-z ]+)/) || [])[1] || '',
    };
  });
  const ent = await readGps();
  await page.locator('main button:has-text("Village Visits")').click();
  await page.waitForTimeout(600);
  const vis = await readGps();
  // In Village Visits mode the KPIs must reflect village data, not the entrepreneur
  // counts (label should switch away from "Total Entrepreneurs", and/or GPS pin count
  // should change to the village-visit pin count).
  const kpiSwitched = vis.primaryLabel !== ent.primaryLabel || vis.gps !== ent.gps;
  expect(kpiSwitched,
    `Village Visits mode should re-scope KPIs (entrepreneurs: label="${ent.primaryLabel}",gps=${ent.gps}; village: label="${vis.primaryLabel}",gps=${vis.gps})`
  ).toBe(true);
});
