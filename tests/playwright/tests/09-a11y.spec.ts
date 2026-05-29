/**
 * Section 9 — Accessibility (WCAG 2.2 AA), automated with axe-core.
 *
 * axe covers the machine-detectable rules: form-field labels (XC-063),
 * colour contrast (XC-064), and a general WCAG 2a/2aa scan. Interaction-bound
 * rules (keyboard order, focus-trap, reduced-motion, SR route announce, colour-
 * not-the-only-signal) are deferred to the manual/MCP pass with a reason.
 *
 * BRD: test-cases.html #a11y
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.use({ storageState: '.auth/uat-sm.json' });

const PAGES: Array<{ label: string; url: string }> = [
  { label: 'Landscape', url: '/primerural/' },
  { label: 'EP form', url: '/primerural/d/Enterprenur%20Profile/new' },
  { label: 'Milestone Tracker', url: '/primerural/milestone-tracker' },
];

async function scan(page: import('@playwright/test').Page, url: string, rules?: string[]) {
  await page.goto(url);
  await page.waitForLoadState('networkidle').catch(() => {});
  let b = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']);
  if (rules) b = new AxeBuilder({ page }).withRules(rules);
  return b.analyze();
}

test('PR-TC-XC-063 · form fields have associated labels (axe "label")', async ({ page }) => {
  const r = await scan(page, '/primerural/d/Enterprenur%20Profile/new', ['label', 'label-title-only', 'form-field-multiple-labels']);
  const v = r.violations;
  expect(v, `label violations: ${JSON.stringify(v.map((x) => ({ id: x.id, n: x.nodes.length })))}`).toEqual([]);
});

test('PR-TC-XC-064 · colour contrast meets WCAG AA (axe "color-contrast")', async ({ page }) => {
  // Scan the densest text surface.
  const r = await scan(page, '/primerural/milestone-tracker', ['color-contrast']);
  const v = r.violations;
  expect(v, `contrast violations: ${JSON.stringify(v.map((x) => x.nodes.length))}`).toEqual([]);
});

test('PR-TC-XC-064b · landscape colour contrast (WCAG AA)', async ({ page }) => {
  const r = await scan(page, '/primerural/', ['color-contrast']);
  expect(r.violations, `landscape contrast nodes: ${r.violations.map((x) => x.nodes.length)}`).toEqual([]);
});

test('PR-TC-XC-A11Y-SCAN · no serious/critical WCAG 2a/2aa violations across key pages', async ({ page }) => {
  const summary: Record<string, string[]> = {};
  for (const p of PAGES) {
    const r = await scan(page, p.url);
    const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    if (serious.length) summary[p.label] = serious.map((v) => `${v.id}(${v.impact},${v.nodes.length})`);
  }
  expect(summary, `serious/critical a11y violations: ${JSON.stringify(summary)}`).toEqual({});
});

for (const [id, why] of [
  ['PR-TC-XC-061', 'keyboard reachability/order — needs tab-sequence interaction (manual/MCP)'],
  ['PR-TC-XC-062', 'modal focus-trap + restore — needs dialog interaction (manual/MCP)'],
  ['PR-TC-XC-065', 'chart aria-label/description — per-chart audit (manual)'],
  ['PR-TC-XC-066', 'prefers-reduced-motion disables animation — needs media emulation + visual check'],
  ['PR-TC-XC-067', 'SR route/error announce via aria-live — needs screen-reader/manual'],
  ['PR-TC-XC-068', 'colour-not-only-signal on pills — visual audit (manual/MCP)'],
] as const) {
  test(`${id} · (manual a11y)`, async () => { test.skip(true, why); });
}
