/**
 * Section 17 — Framework calculations, codified as real form-fill specs.
 *
 * These DRIVE the actual DF forms as a Fellow would (open form → open the child
 * tab → "+ Add ..." → type into the cells → assert the live computed output),
 * so they run end-to-end in one go — headless in CI, or watch them in Chrome:
 *     npm run test:headed        # visible browser
 *     npm run test:ui            # step through interactively
 *
 * No save needed — the computed fields update live as you type, so these create
 * no records on staging. Each was first verified via the MCP browser pass.
 */
import { test, expect, Page } from '@playwright/test';

test.use({ storageState: '.auth/uat-sm.json' });

const tab = (page: Page, name: RegExp) => page.locator('main button').filter({ hasText: name }).first();
const nums = (page: Page) => page.locator('main input[type="number"]');

test('PR-TC-FW-RAWMAT-001 · Raw Materials: qty × price = cost', async ({ page }) => {
  await page.goto('/primerural/d/DF Raw Material/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: '+ Add Raw Material' }).click();
  await nums(page).nth(1).fill('10');   // Quantity Required Per Batch
  await nums(page).nth(2).fill('800');  // Price Per Unit
  await expect(page.locator('main'), 'Amount/Batch should be 10 × 800 = ₹8,000')
    .toContainText('₹8,000');
});

test('PR-TC-FW-MACH-001 · Machinery: depreciation computes from cost ÷ life', async ({ page }) => {
  await page.goto('/primerural/d/DF Machinery/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: '+ Add Machine' }).click();
  await nums(page).nth(6).fill('50000');           // Cost of Machine (Useful Life defaults to 10)
  // ₹50,000 / 10y / 12 = ₹416.67/mo (straight-line, no salvage — see FW-MACH-001 finding)
  await expect(page.locator('main')).toContainText('416.67');
});

test('PR-TC-FW-HR-001 · Human Resource: below-GoM-minimum-wage warning fires', async ({ page }) => {
  await page.goto('/primerural/d/DF Human Resource/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: '+ Add Worker Category' }).click();
  await nums(page).nth(1).fill('100');  // Wage Rate
  await nums(page).nth(2).fill('500');  // GoM Minimum Wage
  await expect(page.locator('main'), 'wage 100 < GoM min 500 should flag non-compliance')
    .toContainText(/below GoM minimum|GOM COMPLIANT\?\s*✕?\s*No/i);
});

test('PR-TC-FW-FIN-001 · Financials BMC: weighted avg selling price = revenue ÷ qty', async ({ page }) => {
  // Verified via the MCP pass (Qty 100 + Rev ₹50,000 → Weighted Avg Selling Price
  // ₹500.00). The BMC tab mixes auto-fetched read-only inputs with editable ones,
  // so positional nth() selectors are unreliable here — this needs data-testid on
  // the BMC fields for a stable codified spec. Tracked as the data-testid ask.
  test.fixme(true, 'BMC tab needs data-testid on Quantity/Revenue/WASP fields — nth() positional selectors shift. Calc verified via MCP.');
  await page.goto('/primerural/d/DF Financials/new');
});

test('PR-TC-FW-DL-001 · Digital Literacy: skill ratings aggregate to avg', async ({ page }) => {
  await page.goto('/primerural/d/DF Digital Literacy/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: '+ Add Skill' }).click();
  await page.locator('main [class*="star"]').nth(4).click();  // set skill level 5
  await expect(page.locator('main'), 'one skill @ level 5 → AVG SKILL LEVEL 5.0').toContainText('5.0');
});

test('PR-TC-FW-LBL-001 · Labels: alcohol toggle reveals Alcohol Content field', async ({ page }) => {
  await page.goto('/primerural/d/DF Marketing Label/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^required$/i).click();
  await page.getByRole('button', { name: '+ Add Row' }).first().click();
  await page.locator('main input[type="checkbox"]').first().check();  // Wine / Alcohol Product?
  await expect(page.locator('main'), 'alcohol toggle should reveal Alcohol Content (ABV)')
    .toContainText(/Alcohol Content/i);
});
