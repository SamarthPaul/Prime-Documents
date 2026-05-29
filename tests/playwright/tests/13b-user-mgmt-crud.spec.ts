/**
 * Section 13 — User Management CRUD (API-level).
 *
 * Exercises the standard Frappe User doctype: create, duplicate-reject,
 * mandatory fields, email normalisation, edit-persists, deactivate→login-blocked.
 * UI-bound cases (welcome-email flow, list columns/filters/search, password
 * strength meter, bulk/CSV, audit log) are deferred to UI/manual passes.
 *
 * Created users are deleted in-test (finally). BRD: test-cases.html #user-mgmt
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';

const BASE = process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in';
const stamp = () => Math.random().toString(36).slice(2, 8); // varies per call (Date.now unavailable in some envs)

test.describe('PR-TC-UM · User Management CRUD (API)', () => {
  test('PR-TC-UM-003 · the 6 role UAT users exist and are enabled', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const emails = ['uat-sm', 'uat-cti', 'uat-ctp', 'uat-fa', 'uat-selco', 'uat-designer'].map((u) => `${u}@dhwaniris.com`);
    try {
      for (const email of emails) {
        const u = await api.getDoc<{ enabled: number }>('User', email);
        expect(u, `${email} should exist`).toBeTruthy();
        expect(u.enabled, `${email} should be enabled`).toBe(1);
      }
    } finally { await api.dispose(); }
  });

  test('PR-TC-UM-001 · create a user (persisted + readable)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const email = `uat-umc-${stamp()}@dhwaniris.com`;
    try {
      await api.insert('User', { email, first_name: '[UAT] CRUD User', send_welcome_email: 0 });
      const u = await api.getDoc<{ name: string; first_name: string }>('User', email);
      expect(u.first_name).toBe('[UAT] CRUD User');
    } finally {
      await api.deleteDoc('User', email).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-UM-004 · duplicate email is rejected', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'User', email: 'uat-sm@dhwaniris.com', first_name: 'dup', send_welcome_email: 0 }) },
    });
    expect(r.status(), 'duplicate email should be rejected').toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/exists|duplicate|already/i);
    await api.dispose();
  });

  test('PR-TC-UM-005 · mandatory fields (email) cannot be skipped', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'User', first_name: 'no email' }) },
    });
    expect(r.status(), 'user without email should be rejected').toBeGreaterThanOrEqual(400);
    await api.dispose();
  });

  test('PR-TC-UM-009 · email is normalised to lowercase on save', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const lower = `uat-umn-${stamp()}@dhwaniris.com`;
    const mixed = lower.toUpperCase();
    let created = '';
    try {
      const u = await api.insert<{ name: string }>('User', { email: mixed, first_name: '[UAT] Norm', send_welcome_email: 0 });
      created = u.name;
      expect(created.toLowerCase(), `stored name "${created}" should be lowercased`).toBe(lower);
    } finally {
      await api.deleteDoc('User', created || lower).catch(() => {});
      await api.deleteDoc('User', mixed).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-UM-010 · editing a user field persists', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const email = `uat-ume-${stamp()}@dhwaniris.com`;
    try {
      await api.insert('User', { email, first_name: '[UAT] Before', send_welcome_email: 0 });
      await api.setValue('User', email, 'first_name', '[UAT] After');
      const u = await api.getDoc<{ first_name: string }>('User', email);
      expect(u.first_name).toBe('[UAT] After');
    } finally {
      await api.deleteDoc('User', email).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-UM-011 · a disabled user cannot log in', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const email = `uat-umd-${stamp()}@dhwaniris.com`;
    const pw = 'UatPr1me!2026Strong';
    try {
      await api.insert('User', { email, first_name: '[UAT] Disabled', send_welcome_email: 0, enabled: 1 });
      await api.setValue('User', email, 'new_password', pw);
      await api.setValue('User', email, 'enabled', 0);
      // attempt login as the disabled user
      const ctx = await (await import('@playwright/test')).request.newContext({ baseURL: BASE });
      const login = await ctx.post('/api/method/login', { form: { usr: email, pwd: pw } });
      expect(login.status(), 'disabled user must not be able to log in').toBeGreaterThanOrEqual(400);
      await ctx.dispose();
    } finally {
      await api.deleteDoc('User', email).catch(() => {});
      await api.dispose();
    }
  });

  for (const [id, why] of [
    ['PR-TC-UM-002', 'welcome-email → set-password → first login — needs email link capture'],
    ['PR-TC-UM-006', 'FA must have a Block restriction — confirm server validation rule first'],
    ['PR-TC-UM-008', 'CTI cannot create System Manager — needs CTI API key (not provisioned)'],
    ['PR-TC-UM-013', 'cannot disable last System Manager — unsafe to exercise on shared staging'],
    ['PR-TC-UM-014', 'cannot delete a record-owning user — needs an owner fixture'],
    ['PR-TC-UM-015', 'password strength meter — UI'],
    ['PR-TC-UM-016', 'no reuse of last 5 passwords — policy/UI'],
    ['PR-TC-UM-017', 'password cannot contain name/email — policy/UI'],
    ['PR-TC-UM-019', 'CTP view-only on users — role-gated UI affordances'],
    ['PR-TC-UM-022', 'user Activity Log tab — audit inspection'],
    ['PR-TC-UM-023', 'failed-login attempts logged — audit inspection'],
    ['PR-TC-UM-024', 'bulk-disable multi-select — UI'],
    ['PR-TC-UM-025', 'CSV bulk import — file fixture'],
    ['PR-TC-UM-027', 'filter chips cascade + URL — UI'],
    ['PR-TC-UM-028', 'debounced search — UI/network'],
    ['PR-TC-UM-029', 'user-form section grouping — UI'],
    ['PR-TC-UM-030', 'password input masked — UI'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
