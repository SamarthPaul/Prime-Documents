/**
 * Section 8 (UI/UX) — No backend / internal identifiers in the client UI.
 *
 * Raised from a UAT observation (29 May 2026): framework headers showed raw
 * doctype names (e.g. "DF Financials"), the EP profile shows a "DF PROGRESS"
 * section, the new-EP form eyebrow shows the raw, misspelled doctype
 * "Enterprenur Profile", and mobile-sync UUID fields are visible on screen.
 * None of these should ever reach an end user.
 *
 * These tests assert the CORRECT behaviour (friendly labels, no raw ids). They
 * are expected to FAIL against current staging — each failure is a real bug
 * that flows into the Bugs Only sheet. Do NOT soften the assertions to make
 * them pass; fix the app instead.
 *
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#ui
 */
import { test, expect } from '@playwright/test';
import { scanChrome, sampleName } from '../fixtures/ui';

test.use({ storageState: '.auth/uat-sm.json' });

test.describe('PR-TC-UI-LEAK · no backend identifiers in client UI', () => {
  test('PR-TC-UI-LEAK-001 · EP profile shows no raw doctype / UUID', async ({ page, request }) => {
    const ep = await sampleName(request, 'Enterprenur Profile');
    test.skip(!ep, 'No entrepreneur on staging to open');
    await page.goto(`/primerural/entrepreneurs/${encodeURIComponent(ep!)}`);
    await page.waitForLoadState('networkidle').catch(() => {});
    const leaks = await scanChrome(page);
    expect(leaks, `Backend identifiers visible on EP profile (${ep}): ${JSON.stringify(leaks)}`).toEqual({});
  });

  test('PR-TC-UI-LEAK-002 · new EP form header is a friendly label, not the raw doctype', async ({ page }) => {
    await page.goto('/primerural/d/Enterprenur%20Profile/new');
    await page.waitForLoadState('networkidle').catch(() => {});
    const leaks = await scanChrome(page);
    expect(leaks, `Backend identifiers visible on new EP form: ${JSON.stringify(leaks)}`).toEqual({});
  });

  test('PR-TC-UI-LEAK-003 · framework form header is a friendly label, not "DF <Doctype>"', async ({ page, request }) => {
    const fin = await sampleName(request, 'DF Financials');
    test.skip(!fin, 'No DF Financials record on staging');
    await page.goto(`/primerural/d/DF%20Financials/${encodeURIComponent(fin!)}`);
    await page.waitForLoadState('networkidle').catch(() => {});
    const leaks = await scanChrome(page);
    expect(leaks, `Backend identifiers visible on DF Financials form (${fin}): ${JSON.stringify(leaks)}`).toEqual({});
  });
});
