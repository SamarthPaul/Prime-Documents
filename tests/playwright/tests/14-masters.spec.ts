/**
 * Section 14 — Masters & Reference Data.
 *
 * Data-existence, CRUD and validation cases are real assertions via the admin
 * API. Deep-UI cases (cascading dropdowns, CSV import, drag palettes, archive
 * UI, role-gated affordances) are deferred to the SEMI/MCP pass with a reason.
 *
 * BRD: https://samarthpaul.github.io/Prime-Documents/test-cases.html#masters
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';
import { UAT_PREFIX } from '../fixtures/data';

test.describe('PR-TC-MS · Masters & reference data', () => {
  test('PR-TC-MS-001 · create a Sector (then available as a record)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const name = `${UAT_PREFIX} Apiculture ${Date.now().toString(36)}`;
    try {
      await api.insert('Sector', { sector_name: name });
      const got = await api.getDoc<{ sector_name: string }>('Sector', name);
      expect(got.sector_name).toBe(name);
    } finally {
      await api.deleteDoc('Sector', name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-MS-002 · duplicate sector name is rejected (case-insensitive)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const base = `${UAT_PREFIX} DupSec ${Date.now().toString(36)}`;
    await api.insert('Sector', { sector_name: base });
    try {
      const r = await api.raw().post('/api/method/frappe.client.insert', {
        form: { doc: JSON.stringify({ doctype: 'Sector', sector_name: base.toUpperCase() }) },
      });
      expect(r.status(), 'case-insensitive duplicate sector should be rejected').toBeGreaterThanOrEqual(400);
    } finally {
      await api.deleteDoc('Sector', base).catch(() => {});
      await api.deleteDoc('Sector', base.toUpperCase()).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-MS-003 · cannot delete a Sector in use by an EP', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    // Find a sector referenced by at least one EP.
    const eps = await api.list<{ sector: string }>('Enterprenur Profile', {
      filters: [['sector', '!=', '']], fields: ['sector'], limit: 1,
    });
    test.skip(!eps.length, 'no EP with a sector set');
    const r = await api.raw().delete(`/api/resource/Sector/${encodeURIComponent(eps[0].sector)}`);
    expect(r.status(), `in-use sector ${eps[0].sector} must not be deletable`).toBeGreaterThanOrEqual(400);
    await api.dispose();
  });

  test('PR-TC-MS-007 · create a multi-year Cohort', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const name = `${UAT_PREFIX} Cohort ${Date.now().toString(36)}`;
    let created = '';
    try {
      const c = await api.insert<{ name: string }>('Cohort', {
        cohort_name: name, start_date: '2026-04-01', end_date: '2029-03-31', status: 'Active',
      });
      created = c.name;
      expect(created).toBeTruthy();
    } finally {
      if (created) await api.deleteDoc('Cohort', created).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-MS-008 · Cohort end date before start date is rejected', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({
        doctype: 'Cohort', cohort_name: `${UAT_PREFIX} BadCohort ${Date.now()}`,
        start_date: '2027-01-01', end_date: '2026-01-01', status: 'Active',
      }) },
    });
    expect(r.status(), 'end-before-start cohort should be rejected').toBeGreaterThanOrEqual(400);
    await api.dispose();
  });

  test('PR-TC-MS-011 · Framework Task Master exists with the 351 seed rows', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().get('/api/method/frappe.client.get_count?doctype=Framework Task Master');
    expect(r.status(), 'Framework Task Master doctype should exist').toBe(200);
    const count = (await r.json()).message;
    expect(count, 'expected 351 seeded Framework Task Master rows').toBeGreaterThanOrEqual(351);
    await api.dispose();
  });

  test('PR-TC-MS-020 · 19 funding schemes are pre-seeded', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().get('/api/method/frappe.client.get_count?doctype=DF Funding Scheme Master');
    const count = r.ok() ? (await r.json()).message : 0;
    expect(count, 'BRD m-schemes expects 19 pre-seeded schemes').toBeGreaterThanOrEqual(19);
    await api.dispose();
  });

  test('PR-TC-MS-015 · standard document types are present', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().get('/api/method/frappe.client.get_count?doctype=Document Master');
    const count = r.ok() ? (await r.json()).message : 0;
    expect(count, 'expected the standard document types (Aadhaar/PAN/EPIC/Bank/Photo/...)').toBeGreaterThanOrEqual(6);
    await api.dispose();
  });

  // ── Deferred to SEMI/MCP or pending build (honest skips, not faked) ──
  for (const [id, why] of [
    ['PR-TC-MS-004', 'District→Block→Village cascade — UI interaction (SEMI)'],
    ['PR-TC-MS-005', 'EP with block not under district — needs form-level geo validation check'],
    ['PR-TC-MS-006', 'CSV bulk import of 100 villages — file-upload fixture'],
    ['PR-TC-MS-009', 'overlapping-cohort warning banner — UI (SEMI)'],
    ['PR-TC-MS-010', 'Business Basket ↔ Sector inheritance — UI cascade'],
    ['PR-TC-MS-012', 'Activity Logger task dropdown filter — blocked: Framework Task Master not built'],
    ['PR-TC-MS-013', '"Other" task → required Comments — blocked: Framework Task Master not built'],
    ['PR-TC-MS-014', 'cannot delete task with linked activity — blocked: Framework Task Master not built'],
    ['PR-TC-MS-016', 'Material Master CRUD + flows into Raw Materials — UI'],
    ['PR-TC-MS-017', 'Mentor Master + Networking search — multi-step UI'],
    ['PR-TC-MS-018', 'Packaging/Type/Months masters CRUD — UI'],
    ['PR-TC-MS-019', 'Process Flow Step Master palette — drag UI'],
    ['PR-TC-MS-021', 'FA read-only on masters — role-gated UI affordances (SEMI)'],
    ['PR-TC-MS-022', 'CTP view-only on masters — role-gated UI affordances (SEMI)'],
    ['PR-TC-MS-023', 'consistent master layout — UI (SEMI)'],
    ['PR-TC-MS-024', 'archive vs delete button styling — UI (SEMI)'],
    ['PR-TC-MS-025', 'archived rows excluded from dropdowns — UI flow'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
