import { test, expect } from '@playwright/test';

/**
 * §5 Browser & Device Compatibility — cross-browser SMOKE.
 *
 * Runs ONLY on the chromium-smoke / firefox / webkit projects (see playwright.config.ts
 * project testMatch). Authenticated as Super Admin via the shared storageState so every
 * core surface is reachable. Keep this SMALL and engine-agnostic: it answers "does the
 * Vue SPA render and work on Blink / Gecko / WebKit", not deep functional coverage
 * (that lives in the role specs, Chromium-only).
 *
 * Run all three engines:  npm run test:xbrowser
 */

const projectName = (info: { project: { name: string } }) => info.project.name;

// Collect uncaught page errors + console errors per test so an engine-specific crash fails loudly.
test.beforeEach(async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });
  (testInfo as any).__errors = errors;
});

test('app shell + Entrepreneurial Landscape render', async ({ page }, testInfo) => {
  await page.goto('/primerural/');
  // App shell: the brand logo image and the left nav are present on every engine.
  await expect(page.getByRole('img', { name: /PRIME Rural/i }).first()).toBeVisible();
  // Landscape heading renders.
  await expect(page.getByRole('heading', { name: /Entrepreneurial Landscape/i })).toBeVisible({ timeout: 20_000 });
  // At least one KPI card value is shown (data fetched + rendered).
  await expect(page.getByText(/^MET$/).first()).toBeVisible();
  console.log(`[${projectName(testInfo)}] Landscape OK`);
});

test('Georgia serif is the resolved body font on this engine', async ({ page }) => {
  await page.goto('/primerural/');
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  // §8 token — must resolve to Georgia/serif on every engine, never sans-serif.
  expect(bodyFont.toLowerCase()).toContain('georgia');
  expect(bodyFont.toLowerCase()).not.toMatch(/arial|helvetica|inter|system-ui|sans-serif/);
});

test('Entrepreneur List loads with records', async ({ page }) => {
  await page.goto('/primerural/entrepreneurs');
  await expect(page.getByRole('heading', { name: /^Entrepreneurs$/ })).toBeVisible({ timeout: 20_000 });
  // The list renders a record count + a table.
  await expect(page.getByText(/\d+ records/)).toBeVisible();
  await expect(page.locator('table')).toBeVisible();
});

test('a diagnostic-framework list opens (DF Financials)', async ({ page }) => {
  await page.goto('/primerural/d/DF Financials');
  await expect(page.getByRole('heading', { name: /Financial Bookkeeping/i })).toBeVisible({ timeout: 20_000 });
});

test('no horizontal page scroll at 1440 width', async ({ page }) => {
  await page.goto('/primerural/');
  await expect(page.getByRole('heading', { name: /Entrepreneurial Landscape/i })).toBeVisible({ timeout: 20_000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test.afterEach(async ({}, testInfo) => {
  const errors: string[] = (testInfo as any).__errors ?? [];
  // Ignore known-benign network noise; fail on real JS/page errors that differ per engine.
  const real = errors.filter((e) => !/favicon|net::ERR_|Failed to load resource/i.test(e));
  expect(real, `Engine ${testInfo.project.name} produced JS errors:\n${real.join('\n')}`).toEqual([]);
});
