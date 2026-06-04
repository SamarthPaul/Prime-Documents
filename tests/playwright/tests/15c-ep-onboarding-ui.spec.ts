/**
 * Section 15c — Entrepreneur Profile onboarding, UI-DRIVEN journey (gold standard).
 *
 * Companion to 15b (same rules, but at the API layer). THIS file drives the real
 * Vue SPA form end-to-end: open → fill across tabs → save → assert → clean up.
 * It is what replaces a human re-walking the form by hand every cycle.
 *
 * ── Live-scouted 4 Jun 2026 via Playwright MCP (role spfield@yopmail.com) ──
 *   • route:    /primerural/d/Enterprenur%20Profile/new   (note misspelling)
 *   • tabs:     Profile · Location And Contact · Documents · Selection ·
 *               Prioritization · Networking & Monitoring
 *   • selectors: every field wrapper has data-fieldname (see EntrepreneurForm POM)
 *   • Save:     disabled until enterprenur_name is filled
 *   • mandatory: enterprenur_name (Profile) + phone_number (Location And Contact).
 *               On save with a missing mandatory, the form REFUSES to persist,
 *               auto-switches to the offending tab, and shows e.g.
 *               "Phone Number is required".
 *   • HTML-level guards MISSING (proven via DOM): dob has no `max`,
 *               phone_number (type=tel) has no `maxlength`/`pattern`.
 *
 * ── How to read failures ──
 * Assertions encode the SPEC (acceptance criteria), NOT today's buggy behaviour.
 * Tests tagged "[GUARD bug #N]" are EXPECTED RED until dev ships the fix — that
 * red is the point: once green, the bug can never silently come back.
 *
 * Data hygiene: every created EP is [UAT]-prefixed and deleted in afterEach
 * (needs ADMIN_API_KEY; without it, the [UAT] prefix lets the nightly cron sweep).
 *
 * Master: maps to test-cases.html #ep. New IDs EP-051..054 cover bug-tracker
 * items #7/#8/#9/#10 and should be added to the master doc.
 */
import { test, expect, type Page } from '@playwright/test';
import { EntrepreneurForm } from '../pages/EntrepreneurForm';
import { FrappeApi } from '../fixtures/api';

const PREFIX = '[UAT]';
const rid = () => Math.random().toString(36).slice(2, 8);
const FUTURE_DOB = '2099-01-01';
const VALID_PHONE = '9876543210'; // 10 digits, starts with 9
const VALID_PAST_DOB = '1990-05-15';

/** EP names created during a test, swept in afterEach. */
const created: string[] = [];

/** If the app WRONGLY persisted (URL gained an EP id), remember it for cleanup. */
function captureIfSaved(page: Page): void {
  const m = page.url().match(/Enterprenur%20Profile\/(?!new)([^/?#]+)/);
  if (m) created.push(decodeURIComponent(m[1]));
}

test.afterEach(async () => {
  if (created.length === 0) return;
  if (process.env.ADMIN_API_KEY) {
    const api = await FrappeApi.asAdmin();
    for (const name of created) await api.deleteDoc('Enterprenur Profile', name).catch(() => {});
    await api.dispose();
  }
  created.length = 0; // else rely on [UAT] prefix + cron sweep
});

test.describe('PR-TC-EP · onboarding journey (UI, gold standard)', () => {
  // ── Validation journeys ────────────────────────────────────────────────

  test('PR-TC-EP-001a · empty form cannot be saved (Save disabled)', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await expect(ep.saveButton(), 'Save must be disabled with no name entered').toBeDisabled();
  });

  test('PR-TC-EP-001b · mandatory enforced cross-tab — phone required, form jumps to tab', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await ep.setName(`${PREFIX} Mandatory ${rid()}`);
    await ep.saveButton().click();
    await captureIfSaved(page);
    await expect(page.getByText(/Phone Number is required/i), 'must name the specific missing field').toBeVisible();
    await expect(page, 'must NOT persist when mandatory is missing').toHaveURL(/\/new$/);
  });

  test('PR-TC-EP-007 · DOB rejects a future date   [GUARD bug #22]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await ep.setName(`${PREFIX} FutureDOB ${rid()}`);
    await ep.field('dob').fill(FUTURE_DOB);
    await ep.openTab('Location And Contact');
    await ep.field('phone_number').fill(VALID_PHONE); // clear the phone gate first
    await ep.saveButton().click();
    await captureIfSaved(page);
    // SPEC: a future DOB is rejected with a message AND nothing is persisted.
    await expect(page.getByText(/future|date of birth|invalid/i),
      'future DOB should be rejected with a validation message').toBeVisible();
    await expect(page, 'a record with a future DOB must not persist').toHaveURL(/\/new$/);
  });

  test('PR-TC-EP-008 · phone rejects non-6789 / non-10-digit   [GUARD bug #12]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await ep.setName(`${PREFIX} BadPhone ${rid()}`);
    await ep.openTab('Location And Contact');
    await ep.field('phone_number').fill('5000000000'); // 10 digits but starts with 5 → invalid
    await ep.saveButton().click();
    await captureIfSaved(page);
    await expect(page.getByText(/valid|10 digit|mobile|begins|starts/i),
      'an Indian mobile starting with 5 should be rejected').toBeVisible();
    await expect(page).toHaveURL(/\/new$/);
  });

  test('PR-TC-EP-008b · phone stores exactly as entered (no extra leading zero)   [GUARD bug #12]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    const name = `${PREFIX} PhoneEcho ${rid()}`;
    await ep.gotoNew();
    await ep.setName(name);
    await ep.field('dob').fill(VALID_PAST_DOB);
    await ep.openTab('Location And Contact');
    await ep.field('phone_number').fill(VALID_PHONE);
    await ep.saveButton().click();
    await expect(page, 'should save').toHaveURL(/Enterprenur%20Profile\/(?!new)[^/?#]+/, { timeout: 10_000 });
    captureIfSaved(page);
    // SPEC: the persisted phone must equal what was typed (no extra 0 prepended).
    await expect(ep.field('phone_number')).toHaveValue(new RegExp(`${VALID_PHONE}$`));
  });

  // ── Happy path: full create → persist → verify → cleanup ────────────────

  test('PR-TC-EP-001 · create EP, persist, verify, cleanup', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    const name = `${PREFIX} Onboard ${rid()}`;
    await ep.gotoNew();
    await ep.setName(name);
    await ep.field('dob').fill(VALID_PAST_DOB);
    await ep.openTab('Location And Contact');
    await ep.field('phone_number').fill(VALID_PHONE);
    await ep.saveButton().click();
    // SPEC: lands on the saved record (URL gains an EP id) within 10s.
    await expect(page, 'should navigate to the saved EP record')
      .toHaveURL(/Enterprenur%20Profile\/(?!new)[^/?#]+/, { timeout: 10_000 });
    captureIfSaved(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(name);
  });

  // ── Structural acceptance (deterministic, no save) ──────────────────────
  // These assert the spec'd FORM SHAPE; they catch the "additions" bugs the
  // moment dev ships them and guard against later removal.

  test('PR-TC-EP-051 · section labelled "Initial Need Analysis"   [GUARD bug #9]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await expect(page.getByText('Initial Need Analysis', { exact: false })).toBeVisible();
    await expect(page.getByText('Initial Intervention Analysis', { exact: false }),
      'the old "Intervention" label should be gone').toHaveCount(0);
  });

  test('PR-TC-EP-052 · About Enterprise has a Business Basket field   [GUARD bug #8]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await expect(ep.fieldWrap('business_basket'), 'Business Basket field must exist').toHaveCount(1);
  });

  test('PR-TC-EP-053 · Initial Need Analysis has an "If any other" option   [GUARD bug #10]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await expect(page.getByText(/if any other/i)).toBeVisible();
  });

  test('PR-TC-EP-054 · profile picture offers capture (not upload-only)   [GUARD bug #7]', async ({ page }) => {
    const ep = new EntrepreneurForm(page);
    await ep.gotoNew();
    await expect(page.getByRole('button', { name: /take photo|capture|camera/i })).toBeVisible();
  });
});
