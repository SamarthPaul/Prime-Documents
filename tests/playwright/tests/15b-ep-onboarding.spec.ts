/**
 * Section 15 — Entrepreneur Profile onboarding (API-level validations).
 *
 * Exercises field validation / uniqueness / status defaults / API contract on
 * the Enterprenur Profile doctype. UI-bound cases (GPS capture, photo preview,
 * KYC upload, profile dashboard, priority drag, drawer) are deferred to UI/MCP.
 *
 * Several of these assert the SPEC'd behaviour and will FAIL where validation is
 * missing — that is the finding. Every created EP is [UAT]-prefixed + deleted.
 * BRD: test-cases.html #ep
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';

const PREFIX = '[UAT]';
const rid = () => Math.random().toString(36).slice(2, 8);

test.describe('PR-TC-EP · onboarding validations (API)', () => {
  test('PR-TC-EP-005 · required fields enforced (Sector & District mandatory)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile',
        enterprenur_name: `${PREFIX} NoSectorDist ${rid()}`, phone_number: '+919876543210', activity_status: 'Active' }) },
    });
    // capture for cleanup if it (wrongly) succeeded
    let created = '';
    try {
      if (r.ok()) created = (await r.json()).message?.name || '';
      expect(r.status(), 'EP without Sector/District should be rejected (BRD requires them)').toBeGreaterThanOrEqual(400);
    } finally {
      if (created) await api.deleteDoc('Enterprenur Profile', created).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-006 · Entrepreneur Name is unique', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const name = `${PREFIX} UniqName ${rid()}`;
    const a = await api.insert<{ name: string }>('Enterprenur Profile', { enterprenur_name: name, phone_number: '+919876543210', activity_status: 'Active' });
    let dup = '';
    try {
      const r = await api.raw().post('/api/method/frappe.client.insert', {
        form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile', enterprenur_name: name, phone_number: '+919876543210', activity_status: 'Active' }) },
      });
      if (r.ok()) dup = (await r.json()).message?.name || '';
      expect(r.status(), `duplicate entrepreneur name "${name}" should be rejected`).toBeGreaterThanOrEqual(400);
    } finally {
      await api.deleteDoc('Enterprenur Profile', a.name).catch(() => {});
      if (dup) await api.deleteDoc('Enterprenur Profile', dup).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-007 · DOB cannot be in the future', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile', enterprenur_name: `${PREFIX} FutureDOB ${rid()}`, phone_number: '+919876543210', dob: '2031-01-01', activity_status: 'Active' }) },
    });
    let created = '';
    try {
      if (r.ok()) created = (await r.json()).message?.name || '';
      expect(r.status(), 'future date of birth should be rejected').toBeGreaterThanOrEqual(400);
    } finally {
      if (created) await api.deleteDoc('Enterprenur Profile', created).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-008 · phone must be a valid Indian mobile (starts 6–9)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile', enterprenur_name: `${PREFIX} BadPhone ${rid()}`, phone_number: '+915000000000', activity_status: 'Active' }) },
    });
    let created = '';
    try {
      if (r.ok()) created = (await r.json()).message?.name || '';
      expect(r.status(), 'Indian mobile starting with 5 should be rejected').toBeGreaterThanOrEqual(400);
    } finally {
      if (created) await api.deleteDoc('Enterprenur Profile', created).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-016 · 10 ratings compute avg_rating', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const ratings: Record<string, number> = {};
    ['one','two','three','four','five','six','seven','eight','nine','ten'].forEach((w) => (ratings[`rating_${w}`] = 0.7));
    const ep = await api.insert<{ name: string }>('Enterprenur Profile', {
      enterprenur_name: `${PREFIX} Ratings ${rid()}`, phone_number: '+919876543210', activity_status: 'Active', ...ratings,
    });
    try {
      const got = await api.getDoc<{ avg_rating: string }>('Enterprenur Profile', ep.name);
      expect(Number(got.avg_rating), `avg_rating should compute to ~0.7 (got ${got.avg_rating})`).toBeCloseTo(0.7, 1);
    } finally {
      await api.deleteDoc('Enterprenur Profile', ep.name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-027 · new EP starts in MET (no final selection)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const ep = await api.insert<{ name: string }>('Enterprenur Profile', {
      enterprenur_name: `${PREFIX} MET ${rid()}`, phone_number: '+919876543210', activity_status: 'Active',
    });
    try {
      const got = await api.getDoc<{ final_selection_status: string }>('Enterprenur Profile', ep.name);
      expect(got.final_selection_status || '', 'a new EP must not be pre-Incubated/Supported (MET = no final selection)').toBe('');
    } finally {
      await api.deleteDoc('Enterprenur Profile', ep.name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-EP-042 · GET EP returns full record incl. child tables', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const got = await api.getDoc<Record<string, unknown>>('Enterprenur Profile', 'EP-00002');
    expect(got.enterprenur_name).toBeTruthy();
    expect(Object.keys(got).length, 'full record should expose many fields').toBeGreaterThan(20);
    await api.dispose();
  });

  test('PR-TC-EP-043 · list API supports pagination + ordering', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const page1 = await api.list<{ name: string }>('Enterprenur Profile', { fields: ['name'], limit: 5, orderBy: 'creation asc' });
    expect(page1.length).toBe(5);
    await api.dispose();
  });

  test('PR-TC-EP-041 · EP with linked framework data cannot be hard-deleted', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().delete('/api/resource/Enterprenur Profile/EP-00002'); // has 11 framework records
    expect(r.status(), 'EP with linked framework data must not hard-delete').toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/LinkExists|linked|Cannot delete/i);
    await api.dispose();
  });

  for (const [id, why] of [
    ['PR-TC-EP-002', 'profile-photo preview before save — UI'],
    ['PR-TC-EP-003', '"Use my location" GPS capture — browser geolocation UI'],
    ['PR-TC-EP-004', 'GPS-denied graceful fallback — UI'],
    ['PR-TC-EP-009', 'Block dropdown constrained to FA block — UI + FA session'],
    ['PR-TC-EP-010', 'business start ≤ visit date — confirm controller rule; UI inline'],
    ['PR-TC-EP-011', 'photo accepts JPEG/PNG ≤5MB + resize — file upload UI'],
    ['PR-TC-EP-012', 'photo rejects >5MB — file upload UI'],
    ['PR-TC-EP-013', 'photo rejects non-image MIME (magic bytes) — file upload'],
    ['PR-TC-EP-014', 'KYC doc upload from master + masked number — UI'],
    ['PR-TC-EP-015', 'cannot mark Available without attachment — UI'],
    ['PR-TC-EP-017', 'rating out-of-range rejected — Frappe Rating clamps 0–1; UI'],
    ['PR-TC-EP-018', 'Rural E-Champ score on Selection tab — UI'],
    ['PR-TC-EP-019', 'FA cannot set Final Selection (disabled) — role-gated UI'],
    ['PR-TC-EP-020', 'CTP sets Final Selection=Incubated + transition — CTP session UI'],
    ['PR-TC-EP-021', 'Final Selection requires attachment — UI'],
    ['PR-TC-EP-022', 'Framework Prioritisation picker → Diagnostics — UI'],
    ['PR-TC-EP-023', 'duplicate framework in priority rejected — UI/controller'],
    ['PR-TC-EP-024', 'priority positive-integer + warning — UI'],
    ['PR-TC-EP-025', 'profile dashboard hero card render — UI'],
    ['PR-TC-EP-026', '"+ Add New Product" drawer — UI'],
    ['PR-TC-EP-028', 'MET→Incubated pill + Sankey — UI'],
    ['PR-TC-EP-029', 'revert Incubated→MET needs admin confirm — UI'],
    ['PR-TC-EP-030', 'Incubated↔Supported transition rules — UI/controller'],
    ['PR-TC-EP-031', 'EP list columns show/hide — UI'],
    ['PR-TC-EP-032', 'EP list filters — UI (cascade covered in DB-EPS-005)'],
    ['PR-TC-EP-033', 'EP search debounced — UI'],
    ['PR-TC-EP-034', 'EP export CSV/XLSX — UI'],
    ['PR-TC-EP-035', 'add mentor introduction — UI (networking)'],
    ['PR-TC-EP-036', 'log meeting auto-syncs introduction — UI'],
    ['PR-TC-EP-037', 'mentor search filter — UI'],
    ['PR-TC-EP-038', 'Log Book aggregates 27-framework activities — UI'],
    ['PR-TC-EP-040', 'SELCO/Designer cannot create/list EPs — role session'],
    ['PR-TC-EP-044', 'composite indexes on filter columns — DB shell'],
    ['PR-TC-EP-045', 'NOT NULL on sector/block FKs — DB shell (app-level covered by EP-005)'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
