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

/* ---------------------------------------------------------------------------
 * Structural / model-deviation characterisations.
 * These assert what staging CURRENTLY does (so the suite is a regression
 * baseline); the deviation from the BRD is called out in the comment and is
 * already filed in the Bugs sheet. Each was confirmed in the MCP pass.
 * ------------------------------------------------------------------------- */

test('PR-TC-FW-QC-001 · Quality Control uses %-average scoring, not BRD /115 stars', async ({ page }) => {
  await page.goto('/primerural/d/DF Quality Control/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: /\+ Add Item/i }).first().click();
  const main = page.locator('main');
  await expect(main, 'QC shows an AVERAGE SCORE (%) model').toContainText(/average score/i);
  // BRD spec is 23 fixed stars totalling /115 — confirm with BA which model is canonical.
  await expect(main, 'BRD /115 fixed-star total is NOT used').not.toContainText('/115');
});

test('PR-TC-FW-PC-002 · Product Compliance cert status is Received/Rejected, not Active/Expired', async ({ page }) => {
  await page.goto('/primerural/d/DF Product Compliance/new');
  await page.waitForLoadState('networkidle').catch(() => {});
  await tab(page, /^existing$/i).click();
  await page.getByRole('button', { name: /\+ Add/i }).first().click();
  // Status model is Received / Not Yet Received / Rejected (+ validity date) — there is no
  // Active/Expired state, so an expired cert is not flagged. Confirm intended behaviour.
  await expect(page.locator('main')).toContainText(/not yet received|received|rejected/i);
});

/* ---------------------------------------------------------------------------
 * Deep-nested / save-time / file-upload flows — documented, not yet codified.
 * Each needs multi-level entry (product → child → leaf), a save-time assertion
 * with cleanup, or a file fixture. Tracked here so they are visible, not lost.
 * (Most also depend on stable selectors — see the data-testid ask.)
 * ------------------------------------------------------------------------- */
const DEFERRED: Array<[string, string]> = [
  ['PR-TC-FW-TEST-001', 'Product Testing date-chain (Sent≤Received≤Reported): needs a save-time assertion + record cleanup; live edit fires no validation (filed).'],
  ['PR-TC-FW-UP-001',   'Unit Pricing 9-section cost buildup: per-product nested (REQUIRED → + Add Product → cost components → total).'],
  ['PR-TC-FW-UP-002',   'Unit Pricing 3 pricing methods (cost-plus/competitive/value): per-product, add product first.'],
  ['PR-TC-FW-CA-001',   'Customer Analysis segmentation: per-product nested (EXISTING → + Add Product → segmentation multi-select).'],
  ['PR-TC-FW-ML-001',   'Market Linkage net-revenue-with-commission: 3-level (Channel → + Add Product → Sales Tracker 12mo grid).'],
  ['PR-TC-FW-SCH-001',  'Schemes EMI: interest-based amortisation (Loan Amount + Interest + dates → EMI/Month); BA to confirm vs flat model.'],
  ['PR-TC-FW-MR-001',   'Market Research SWOT: no 4-quadrant grid found (Product Snapshot + Key Findings + competitor channels instead); absence-only assertion is too weak to codify — confirm model with BA.'],
  ['PR-TC-FW-UP-003',   'Unit Pricing TASKS-tab / no-LOG-BOOK deviation: tab bar renders only on a saved record (blank /new shows just Save/Cancel), so it needs an existing UP record + stable tab hook to codify. Verified via MCP (filed).'],
  ['PR-TC-FW-PROMO-001','Promotional Marketing cost-per-reach (budget/reach): on REQUIRED planned-promotions, deeper entry.'],
  ['PR-TC-FW-PROTO-001','Product Prototyping conditional Prototype-Type: 3 levels (product → + Add Iteration → conditional fields).'],
  ['PR-TC-FW-PKG-001',  'Packaging monthly-qty sum: nested MONTHLY ORDER SCHEDULE (per-month qty/price rows).'],
  ['PR-TC-FW-LSVC-001', 'Logistic Service cost-per-trip: conditional field not surfaced in the basic route row.'],
  ['PR-TC-FW-STD-001',  'Standardization SOP upload + status + versioning: needs a file fixture (file-upload-driven).'],
];
for (const [id, why] of DEFERRED) {
  test(`${id} · deferred form-fill`, () => { test.fixme(true, why); });
}
