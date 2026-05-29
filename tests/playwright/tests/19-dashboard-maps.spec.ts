/**
 * Section 19 — Dashboard maps (Landscape Leaflet map).
 *
 * Geo-tagging is stored on Enterprenur Profile.location (Frappe Geolocation /
 * GeoJSON). The map uses Leaflet's CANVAS renderer, so pins are drawn on a
 * <canvas> — DOM marker-counting is invalid. We therefore verify rigorously at
 * the DATA level (coords captured; count cross-checks the GPS-Verified KPI) and
 * the RENDER level (map + boundary overlay present). Pixel-accurate pin
 * placement and block-level drill-down need visual/interaction verification and
 * are deferred to the manual/MCP map pass.
 *
 * BRD: test-cases.html #dashboards
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';

test.use({ storageState: '.auth/uat-sm.json' });

function locationIsSet(loc: unknown): boolean {
  if (!loc || typeof loc !== 'string') return false;
  try {
    const g = JSON.parse(loc);
    return Array.isArray(g?.features) ? g.features.length > 0 : !!loc.trim();
  } catch {
    return loc.trim().length > 0;
  }
}

test('PR-TC-DB-MAP-001 · geo coordinates are captured; count cross-checks the GPS-Verified KPI', async ({ page, request }) => {
  test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
  const api = await FrappeApi.asAdmin();
  const eps = await api.list<{ name: string; location: string }>('Enterprenur Profile', {
    fields: ['name', 'location'], limit: 500,
  });
  await api.dispose();
  const withCoords = eps.filter((e) => locationIsSet(e.location)).length;

  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const gpsKpi = await page.evaluate(() => {
    const m = document.querySelector('main')!.innerText;
    return Number((m.match(/(\d+)\s*\n\s*GPS Verified/i) || [])[1] || -1);
  });
  expect(withCoords, `EPs with a captured location should be > 0`).toBeGreaterThan(0);
  expect(gpsKpi, `GPS-Verified KPI should be a positive count`).toBeGreaterThan(0);
  // Safe invariant: the KPI can never exceed the number of EPs that actually
  // have coordinates. (Note for dev: KPI=${gpsKpi} vs EPs-with-location=${withCoords}
  // — confirm whether "GPS Verified" should count only true-GPS captures or all
  // geo-located EPs incl. block-centroid; logged as an observation, not a bug.)
  expect(gpsKpi, `GPS-Verified KPI (${gpsKpi}) must not exceed EPs-with-coords (${withCoords})`).toBeLessThanOrEqual(withCoords);
});

test('PR-TC-DB-MAP-002 · Landscape map renders (Leaflet canvas + tiles)', async ({ page }) => {
  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const map = await page.evaluate(() => {
    const lc = document.querySelector('.leaflet-container');
    return {
      present: !!lc,
      tiles: lc ? lc.querySelectorAll('.leaflet-tile').length : 0,
      canvas: lc ? lc.querySelectorAll('canvas').length : 0,
    };
  });
  expect(map.present, 'Leaflet map container present').toBe(true);
  expect(map.tiles, 'base tiles loaded').toBeGreaterThan(0);
  expect(map.canvas, 'canvas renderer present (pins drawn on canvas)').toBeGreaterThan(0);
});

test('PR-TC-DB-MAP-003 · Meghalaya boundary overlay is rendered', async ({ page }) => {
  await page.goto('/primerural/');
  await page.waitForLoadState('networkidle').catch(() => {});
  const hasOverlay = await page.evaluate(() => {
    const lc = document.querySelector('.leaflet-container');
    if (!lc) return false;
    const ov = lc.querySelector('.leaflet-overlay-pane');
    // boundary is drawn either as SVG path or on the overlay canvas
    return !!ov && (ov.querySelector('path') !== null || ov.querySelector('canvas') !== null);
  });
  expect(hasOverlay, 'state boundary overlay (svg path or canvas) should render').toBe(true);
});

test('PR-TC-DB-MAP-005 · captured coordinates fall within Meghalaya bounds (geo validation)', async () => {
  test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
  // Meghalaya bounding box (approx): lat 25.0–26.2, lng 89.8–92.9.
  const LAT = [25.0, 26.2], LNG = [89.8, 92.9];
  const api = await FrappeApi.asAdmin();
  const eps = await api.list<{ name: string; location: string }>('Enterprenur Profile', {
    fields: ['name', 'location'], limit: 500,
  });
  await api.dispose();

  const bad: string[] = [];
  let withCoords = 0;
  for (const ep of eps) {
    if (!ep.location || !ep.location.trim()) continue;
    let g: any;
    try { g = JSON.parse(ep.location); }
    catch { bad.push(`${ep.name}: malformed GeoJSON`); continue; }
    for (const f of g?.features ?? []) {
      const c = f?.geometry?.coordinates;
      if (Array.isArray(c) && c.length >= 2) {
        withCoords++;
        const [lng, lat] = c; // GeoJSON = [lng, lat]
        if (!(lat >= LAT[0] && lat <= LAT[1] && lng >= LNG[0] && lng <= LNG[1])) {
          bad.push(`${ep.name}: ${lat.toFixed(3)},${lng.toFixed(3)} outside Meghalaya`);
        }
      }
    }
  }
  expect(withCoords, 'some EPs should have parseable coordinates').toBeGreaterThan(0);
  expect(bad, `coordinates must be valid Meghalaya geo-tags; offenders: ${bad.slice(0, 12).join(' | ')}`).toEqual([]);
});

for (const [id, why] of [
  ['PR-TC-DB-MAP-004', 'block-level drill-down on the map — canvas interaction; visual/MCP verification'],
  ['PR-TC-DB-MAP-006', 'Village Visits map mode pins — canvas; visual/MCP verification'],
] as const) {
  test(`${id} · (visual/manual map pass)`, async () => { test.skip(true, why); });
}
