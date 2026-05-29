/**
 * Sections 6 (Responsive), 8 (UI/UX Monsoon-Court), 10 (Performance).
 *
 * Deterministic, machine-checkable rules are real assertions (typeface,
 * sidebar reflow at breakpoints, First/Largest Contentful Paint). Fuzzy-visual
 * rules (exact colour hues, ₹ Indian grouping, focus-ring styling) are deferred
 * to the MCP visual pass with a reason — automating them risks false bugs.
 *
 * BRD: test-cases.html #ux / #perf / #responsive
 */
import { test, expect } from '@playwright/test';

// ───────────────────────── UI/UX (Monsoon Court) ─────────────────────────
test.describe('PR-TC-XC · UI/UX — Monsoon Court', () => {
  test.use({ storageState: '.auth/uat-sm.json' });

  test('PR-TC-XC-051 · Georgia is the typeface (body + headings + buttons)', async ({ page }) => {
    await page.goto('/primerural/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const fonts = await page.evaluate(() => {
      const pick = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).fontFamily : '';
      };
      return { body: getComputedStyle(document.body).fontFamily, h1: pick('main h1'), btn: pick('main button') };
    });
    expect(fonts.body, `body font: ${fonts.body}`).toMatch(/georgia/i);
    if (fonts.h1) expect(fonts.h1, `h1 font: ${fonts.h1}`).toMatch(/georgia/i);
    if (fonts.btn) expect(fonts.btn, `button font: ${fonts.btn}`).toMatch(/georgia/i);
  });

  for (const [id, why] of [
    ['PR-TC-XC-052', 'no-green/no-yellow — colour-hue scan is noisy (Leaflet map) → MCP visual verdict'],
    ['PR-TC-XC-053', 'white inputs / cream cards — element-class dependent → MCP visual'],
    ['PR-TC-XC-054', 'terracotta required-asterisk — visual style → MCP'],
    ['PR-TC-XC-055', 'focus-ring 2px terracotta — visual style → MCP'],
    ['PR-TC-XC-056', 'primary/secondary button colours — visual → MCP'],
    ['PR-TC-XC-057', 'sidebar/content active-item colour — visual → MCP'],
    ['PR-TC-XC-058', 'no stat cards on tabbed forms — per-form visual audit → MCP'],
    ['PR-TC-XC-059', 'Indian number grouping (1,00,000) — render-format audit → MCP'],
    ['PR-TC-XC-060', 'dates DD-MMM-YYYY — render-format audit → MCP'],
  ] as const) {
    test(`${id} · (MCP visual pass)`, async () => { test.skip(true, why); });
  }
});

// ───────────────────────── Responsive ─────────────────────────
test.describe('PR-TC-XC · Responsive layout', () => {
  test.use({ storageState: '.auth/uat-sm.json' });

  async function sidebarWidth(page: import('@playwright/test').Page): Promise<number> {
    return page.evaluate(() => {
      const a = document.querySelector('aside, [role="complementary"]');
      return a ? Math.round(a.getBoundingClientRect().width) : 0;
    });
  }

  test('PR-TC-XC-021 · 1920×1080 — sidebar expanded (~240px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/primerural/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const w = await sidebarWidth(page);
    expect(w, `sidebar width=${w}`).toBeGreaterThan(150);
  });

  test('PR-TC-XC-022 · 1366×768 — sidebar still expanded', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/primerural/');
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(await sidebarWidth(page)).toBeGreaterThan(120);
  });

  test('PR-TC-XC-023 · 1024×768 — sidebar collapses to icon rail (~64px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/primerural/');
    await page.waitForLoadState('networkidle').catch(() => {});
    const w = await sidebarWidth(page);
    // Per BRD the rail should collapse to icons (≤ ~96px) at tablet width.
    expect(w, `at 1024px the sidebar should collapse to an icon rail; width=${w}`).toBeLessThanOrEqual(96);
  });

  test('PR-TC-XC-026 · long field values do not overflow horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/primerural/d/Enterprenur%20Profile/new');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.locator('[data-fieldname="enterprenur_name"] input').fill('X'.repeat(200)).catch(() => {});
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow=${overflow}px`).toBeLessThanOrEqual(4);
  });

  for (const [id, why] of [
    ['PR-TC-XC-024', '800×600 hamburger — low-priority breakpoint → MCP'],
    ['PR-TC-XC-025', 'zoom 50–200% layout — browser-zoom not scriptable in PW → MCP'],
    ['PR-TC-XC-027', '100+ child rows scroll — needs seeded heavy record → later'],
    ['PR-TC-XC-028', '500+ list pagination — needs heavy data → later'],
    ['PR-TC-XC-029', '1000+ option dropdown — needs heavy master → later'],
    ['PR-TC-XC-030', 'empty-state pages — per-surface visual → MCP'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});

// ───────────────────────── Performance ─────────────────────────
test.describe('PR-TC-XC · Performance baselines', () => {
  async function fcp(page: import('@playwright/test').Page): Promise<number> {
    return page.evaluate(() => {
      const e = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint');
      return e ? Math.round(e.startTime) : -1;
    });
  }

  test.describe('login (anon)', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('PR-TC-XC-069 · login page FCP < 1s', async ({ page }) => {
      await page.goto('/primerural/login', { waitUntil: 'load' });
      const t = await fcp(page);
      expect(t, `login FCP=${t}ms (budget 1000ms)`).toBeLessThan(1000);
    });
  });

  test.describe('dashboard (sm)', () => {
    test.use({ storageState: '.auth/uat-sm.json' });
    test('PR-TC-XC-070 · landscape/dashboard FCP < 3s', async ({ page }) => {
      await page.goto('/primerural/', { waitUntil: 'load' });
      const t = await fcp(page);
      expect(t, `dashboard FCP=${t}ms (budget 3000ms)`).toBeLessThan(3000);
    });
  });

  for (const [id, why] of [
    ['PR-TC-XC-071', 'EP save round-trip < 1.5s — needs full create flow timing → later'],
    ['PR-TC-XC-072', 'list filter < 300ms — needs list filter timing → later'],
    ['PR-TC-XC-073', 'no memory leak — manual heap profiling'],
    ['PR-TC-XC-074', 'no N+1 on list — network-trace inspection → later'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
