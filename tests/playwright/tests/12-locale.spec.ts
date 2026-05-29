/**
 * Section 12 — Locale, Number, Date & Currency.
 *
 * Server-enforced validations are real API assertions (phone format). Inline
 * input-mask / picker behaviour and ₹ Indian-grouping display are UI-judgement
 * and move to the SEMI/MCP pass.
 *
 * BRD: https://samarthpaul.github.io/Prime-Documents/test-cases.html#i18n
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';
import { UAT_PREFIX } from '../fixtures/data';

test.describe('PR-TC-XC · Locale / number / date / currency', () => {
  test('PR-TC-XC-086 · phone number validation (accepts valid +91 10-digit, rejects malformed)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    // Reject: the bare "+91-" prefix (no number) must fail validation.
    const bad = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile',
        enterprenur_name: `${UAT_PREFIX} BadPhone ${Date.now()}`, activity_status: 'Active', phone_number: '+91-' }) },
    });
    expect(bad.status(), 'malformed phone should be rejected').toBeGreaterThanOrEqual(400);
    expect(await bad.text()).toMatch(/phone/i);

    // Accept: a valid number.
    let created = '';
    try {
      const ok = await api.insert<{ name: string }>('Enterprenur Profile', {
        enterprenur_name: `${UAT_PREFIX} GoodPhone ${Date.now().toString(36)}`,
        activity_status: 'Active', phone_number: '+919876543210',
      });
      created = ok.name;
      expect(created).toBeTruthy();
    } finally {
      if (created) await api.deleteDoc('Enterprenur Profile', created).catch(() => {});
      await api.dispose();
    }
  });

  for (const [id, why] of [
    ['PR-TC-XC-081', 'date-picker rejects illogical dates — inline UI validation (SEMI)'],
    ['PR-TC-XC-082', 'DOB < 14y rejected — needs form-level age validation check'],
    ['PR-TC-XC-083', 'end-before-start date range — inline UI (covered server-side for Cohort in MS-008)'],
    ['PR-TC-XC-084', 'numeric field input masking — UI'],
    ['PR-TC-XC-085', '₹ Indian grouping display (₹ 15,00,000.00) — UI render (SEMI)'],
    ['PR-TC-XC-087', 'Aadhaar 12-digit + checksum — field location/validation TBD'],
    ['PR-TC-XC-088', 'PAN pattern + auto-uppercase — field location/validation TBD'],
    ['PR-TC-XC-089', 'GSTIN 15-char pattern — field location/validation TBD'],
    ['PR-TC-XC-090', 'pincode 6-digit not-starting-0 — field location/validation TBD'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
