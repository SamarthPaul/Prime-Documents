/**
 * Section 17 — The 27 Diagnostic Frameworks: common runner.
 *
 * Every framework form shares the same shell (entrepreneur-name heading +
 * tabbed sections). This parameterised runner applies the common checks to all
 * 27 frameworks:
 *   - <CODE>-001  the framework form loads for a real record (heading + tabs)
 *   - <CODE>-002  no backend identifier leaks in the chrome (the "DF <Doctype>"
 *                 header bug, UUIDs, the "Enterprenur" misspelling)
 *
 * Route (verified): /primerural/d/<DocType>/<recordName>. We fetch one existing
 * record per framework via the API and open it (skips a framework if staging has
 * no record for it yet). Deprecated doctypes (Cataloguing, Design Experiment,
 * Design Thinking) are intentionally excluded.
 *
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#frameworks
 */
import { test, expect } from '@playwright/test';
import { scanChrome, sampleName } from '../fixtures/ui';

test.use({ storageState: '.auth/uat-sm.json' });

type Framework = { code: string; doctype: string; label: string };

const FRAMEWORKS: Framework[] = [
  { code: 'FIN',  doctype: 'DF Financials',              label: 'Financials' },
  { code: 'UP',   doctype: 'DF Unit Pricing',            label: 'Unit Pricing' },
  { code: 'RM',   doctype: 'DF Raw Material',            label: 'Raw Material' },
  { code: 'MACH', doctype: 'DF Machinery',               label: 'Machinery' },
  { code: 'HR',   doctype: 'DF Human Resource',          label: 'Human Resource' },
  { code: 'BREG', doctype: 'DF Business Registration',   label: 'Business Registration' },
  { code: 'PCMP', doctype: 'DF Product Compliance',      label: 'Product Compliance' },
  { code: 'PROT', doctype: 'DF Product Prototyping',     label: 'Product Prototyping' },
  { code: 'PTST', doctype: 'DF Product Testing',         label: 'Product Testing' },
  { code: 'STD',  doctype: 'DF Standardization',         label: 'Standardization' },
  { code: 'QC',   doctype: 'DF Quality Control',         label: 'Quality Control' },
  { code: 'PKG',  doctype: 'DF Packaging',               label: 'Packaging' },
  { code: 'MR',   doctype: 'DF Market Research',         label: 'Market Research' },
  { code: 'CA',   doctype: 'DF Customer Analysis',       label: 'Customer Analysis' },
  { code: 'PROM', doctype: 'DF Promotional Marketing',   label: 'Promotional Marketing' },
  { code: 'ML',   doctype: 'DF Market Linkage',          label: 'Market Linkage' },
  { code: 'BRND', doctype: 'DF Branding Identity',       label: 'Branding Identity' },
  { code: 'LABL', doctype: 'DF Marketing Label',         label: 'Marketing Label' },
  { code: 'BRCH', doctype: 'DF Marketing Brochure',      label: 'Marketing Brochure' },
  { code: 'LOGS', doctype: 'DF Logistic Service',        label: 'Logistic Service' },
  { code: 'LOGP', doctype: 'DF Logistic Packing',        label: 'Logistic Packing' },
  { code: 'DL',   doctype: 'DF Digital Literacy',        label: 'Digital Literacy' },
  { code: 'CB',   doctype: 'DF Capacity Building',       label: 'Capacity Building' },
  { code: 'BPC',  doctype: 'DF Business Plan Canvas',    label: 'Business Plan Canvas' },
  { code: 'INFR', doctype: 'DF Infrastructure BE EE CE', label: 'Infrastructure (BE/EE/CE)' },
  { code: 'PTCH', doctype: 'DF Pitch Deck',              label: 'Pitch Deck' },
  { code: 'SCHM', doctype: 'DF Schemes Funding',         label: 'Schemes & Funding' },
];

for (const fw of FRAMEWORKS) {
  test.describe(`Framework: ${fw.label}`, () => {
    test(`PR-TC-FWC-${fw.code}-001 · ${fw.label} form loads (heading + tabs)`, async ({ page, request }) => {
      const rec = await sampleName(request, fw.doctype);
      test.skip(!rec, `No ${fw.doctype} record on staging to open`);
      await page.goto(`/primerural/d/${encodeURIComponent(fw.doctype)}/${encodeURIComponent(rec!)}`);
      await page.waitForLoadState('networkidle').catch(() => {});
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.locator('main button').count(), 'framework form should render tab buttons').toBeGreaterThan(1);
    });

    test(`PR-TC-FWC-${fw.code}-002 · ${fw.label} header has no raw doctype / UUID`, async ({ page, request }) => {
      const rec = await sampleName(request, fw.doctype);
      test.skip(!rec, `No ${fw.doctype} record on staging`);
      await page.goto(`/primerural/d/${encodeURIComponent(fw.doctype)}/${encodeURIComponent(rec!)}`);
      await page.waitForLoadState('networkidle').catch(() => {});
      const leaks = await scanChrome(page);
      expect(leaks, `Backend identifiers visible on ${fw.label} (${rec}): ${JSON.stringify(leaks)}`).toEqual({});
    });
  });
}
