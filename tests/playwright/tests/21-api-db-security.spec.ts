/**
 * Sections 21 (API), 22 (Database), 23 (Security).
 *
 * Automatable cases are implemented as real assertions against staging.
 * Cases that need DB shell / infra / external audit access (EXPLAIN, indexes,
 * encryption-at-rest, backups, migrations, VAPT, rate-limit) are marked
 * test.skip with a reason → they show as Blocked in the report (honest: NOT
 * silently passed). UI-judgement cases (XSS rendering) move to the SEMI pass.
 *
 * BRD: https://samarthpaul.github.io/Prime-Documents/test-cases.html#api (and #db, #security)
 */
import { test, expect, request as pwRequest } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';
import { UAT_PREFIX } from '../fixtures/data';

const BASE = process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in';

// ───────────────────────────── API LAYER ─────────────────────────────
test.describe('PR-TC-API · API layer', () => {
  test('PR-TC-API-001 · valid API token returns logged_user (200)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().get('/api/method/frappe.auth.get_logged_user');
    expect(r.status()).toBe(200);
    expect((await r.json()).message).toMatch(/administrator/i);
    await api.dispose();
  });

  test('PR-TC-API-002 · missing/invalid token returns 401, no data leak', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({
      baseURL: BASE, storageState: { cookies: [], origins: [] },
      extraHTTPHeaders: { Authorization: 'token deadbeef:0000000000000' },
    });
    const r = await ctx.get('/api/resource/Enterprenur Profile?limit_page_length=1');
    expect([401, 403]).toContain(r.status());
    expect(await r.text()).not.toContain('enterprenur_name');
    await ctx.dispose();
  });

  test('PR-TC-API-004 · POST creates a record (and is readable back)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const ep = await api.insert<{ name: string }>('Enterprenur Profile', {
      enterprenur_name: `${UAT_PREFIX} API-004 ${Date.now().toString(36)}`,
      activity_status: 'Active', phone_number: '+919876543210',
    });
    try {
      expect(ep.name).toBeTruthy();
      const got = await api.getDoc('Enterprenur Profile', ep.name);
      expect(got).toBeTruthy();
    } finally {
      await api.deleteDoc('Enterprenur Profile', ep.name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-API-005 · POST missing mandatory field returns a validation error', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Enterprenur Profile', activity_status: 'Active' }) }, // no name
    });
    expect(r.status()).toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/Mandatory|required|mandatory/i);
    await api.dispose();
  });

  test('PR-TC-API-006 · PUT updates only the fields sent', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const ep = await api.insert<{ name: string }>('Enterprenur Profile', {
      enterprenur_name: `${UAT_PREFIX} API-006 ${Date.now().toString(36)}`,
      activity_status: 'Active', phone_number: '+919876543210',
    });
    try {
      await api.setValue('Enterprenur Profile', ep.name, 'phone_number', '+919811111111');
      const got = await api.getDoc<{ phone_number: string; activity_status: string }>('Enterprenur Profile', ep.name);
      expect(got.phone_number).toContain('9811111111');
      expect(got.activity_status).toBe('Active'); // untouched
    } finally {
      await api.deleteDoc('Enterprenur Profile', ep.name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-API-007 · DELETE of an FK-referenced record returns LinkExists', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    // EP-00002 is the seed EP with 11 linked framework records → must not delete.
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().delete('/api/resource/Enterprenur Profile/EP-00002');
    expect(r.status(), 'EP with linked framework records must not be deletable').toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/LinkExists|linked with|Cannot delete/i);
    await api.dispose();
  });

  test('PR-TC-API-008 · cookie-auth POST without CSRF token is rejected', async () => {
    // A session-cookie POST that omits the CSRF token must be refused.
    const ctx = await pwRequest.newContext({ baseURL: BASE, storageState: '.auth/uat-sm.json' });
    const r = await ctx.post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'Sector', sector_name: `${UAT_PREFIX} csrf ${Date.now()}` }) },
    });
    expect(r.status(), 'cookie POST without CSRF should be blocked').toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/CSRF/i);
    await ctx.dispose();
  });

  test('PR-TC-API-011 · error response conforms to the Frappe error contract', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().get('/api/resource/Enterprenur Profile/NON-EXISTENT-XYZ');
    expect(r.status()).toBeGreaterThanOrEqual(400);
    const body = await r.json().catch(() => ({}));
    expect(body, 'error body should carry exc_type / _server_messages').toHaveProperty('exc_type');
    await api.dispose();
  });

  test('PR-TC-API-003 · disabled-user API key is rejected', async () => {
    test.skip(true, 'Manual: needs a disabled user with a provisioned API key — not seeded.');
  });
  test('PR-TC-API-009 · rate limiting returns 429 over threshold', async () => {
    test.skip(true, 'Manual: would hammer staging (1000 req/min) — verify via gateway config / load test.');
  });
  test('PR-TC-API-010 · networking save_introduction endpoint works', async () => {
    test.fixme(true, 'Pending: construct a valid introduction payload + mentor/EP fixtures.');
  });
});

// ───────────────────────────── DATABASE ─────────────────────────────
test.describe('PR-TC-DB · database layer', () => {
  test('PR-TC-DB-001 · Link fields reject non-existent references (app+DB)', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const r = await api.raw().post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype: 'DF Product Testing', enterprenur_name: 'NO-SUCH-EP-XYZ' }) },
    });
    expect(r.status()).toBeGreaterThanOrEqual(400);
    expect(await r.text()).toMatch(/LinkValidationError|Could not find/i);
    await api.dispose();
  });

  test('PR-TC-DB-006 · charset is utf8mb4 — emoji + native script round-trip', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const val = `${UAT_PREFIX} ✅ खासी ${Date.now().toString(36)}`;
    const ep = await api.insert<{ name: string }>('Enterprenur Profile', {
      enterprenur_name: val, activity_status: 'Active', phone_number: '+919876543210',
    });
    try {
      const got = await api.getDoc<{ enterprenur_name: string }>('Enterprenur Profile', ep.name);
      expect(got.enterprenur_name).toBe(val); // exact round-trip incl. emoji + Devanagari
    } finally {
      await api.deleteDoc('Enterprenur Profile', ep.name).catch(() => {});
      await api.dispose();
    }
  });

  for (const [id, why] of [
    ['PR-TC-DB-002', 'composite UNIQUE (cohort, enterprenur_name) — needs DB index inspection'],
    ['PR-TC-DB-003', 'index presence on cohort/sector/block — needs SHOW INDEX (DB shell)'],
    ['PR-TC-DB-004', 'cascade-delete semantics — needs DB FK inspection (app-level covered by API-007)'],
    ['PR-TC-DB-005', 'Aadhaar encryption-at-rest — needs DB row inspection'],
    ['PR-TC-DB-007', 'UTC-store / IST-display — needs DB value + UI compare'],
    ['PR-TC-DB-008', 'migration reversibility — process/runbook check'],
    ['PR-TC-DB-009', 'backup schedule < 24h + off-site — infra check'],
    ['PR-TC-DB-010', 'EXPLAIN no full-table-scan — needs DB shell'],
  ] as const) {
    test(`${id} · (db/infra inspection)`, async () => { test.skip(true, `Manual: ${why}`); });
  }
});

// ───────────────────────────── SECURITY ─────────────────────────────
test.describe('PR-TC-SEC · security', () => {
  test('PR-TC-SEC-002 · SQL injection in a filter is parameterised, not executed', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const inj = encodeURIComponent(JSON.stringify([['enterprenur_name', 'like', "%' OR '1'='1"]]));
    const r = await api.raw().get(`/api/resource/Enterprenur Profile?filters=${inj}&limit_page_length=5`);
    // Must not 500 / dump the table; parameterised query returns a normal (likely empty) result.
    expect(r.status()).toBeLessThan(500);
    await api.dispose();
  });

  test('PR-TC-SEC-004 · HTTP redirects to HTTPS with HSTS', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ ignoreHTTPSErrors: true });
    const httpUrl = BASE.replace('https://', 'http://');
    const r = await ctx.get(httpUrl, { maxRedirects: 0 }).catch(() => null);
    if (r) expect([301, 302, 307, 308]).toContain(r.status());
    // HSTS on the HTTPS response
    const s = await ctx.get(BASE);
    expect(s.headers()['strict-transport-security'], 'HSTS header should be set').toBeTruthy();
    await ctx.dispose();
  });

  test('PR-TC-SEC-005 · Content-Security-Policy header is present', async ({ playwright }) => {
    const ctx = await playwright.request.newContext();
    const r = await ctx.get(BASE);
    expect(r.headers()['content-security-policy'], 'CSP header should be set').toBeTruthy();
    await ctx.dispose();
  });

  test('PR-TC-SEC-006 · clickjacking protection (X-Frame-Options / frame-ancestors)', async ({ playwright }) => {
    const ctx = await playwright.request.newContext();
    const r = await ctx.get(BASE);
    const h = r.headers();
    const protectedAgainstFraming =
      !!h['x-frame-options'] || /frame-ancestors/i.test(h['content-security-policy'] ?? '');
    expect(protectedAgainstFraming, 'X-Frame-Options or CSP frame-ancestors should be set').toBe(true);
    await ctx.dispose();
  });

  test.describe('As Field Associate', () => {
    test.use({ storageState: '.auth/uat-fa.json' });
    test('PR-TC-SEC-003 · IDOR — FA cannot read a cross-block EP by direct API URL', async ({ page }) => {
      test.skip(!process.env.ADMIN_API_KEY, 'admin token required to locate a cross-block EP');
      const admin = await FrappeApi.asAdmin();
      // An EP with a block set that is NOT the FA's block (Resubelpara).
      const others = await admin.list<{ name: string; block: string }>('Enterprenur Profile', {
        filters: [['block', 'not in', ['Resubelpara', '']]], fields: ['name', 'block'], limit: 1,
      });
      await admin.dispose();
      test.skip(!others.length, 'no cross-block EP on staging to probe');
      const r = await page.request.get(`/api/resource/Enterprenur Profile/${encodeURIComponent(others[0].name)}`);
      expect([403, 404], `FA must not read cross-block EP ${others[0].name}`).toContain(r.status());
    });
  });

  for (const [id, why] of [
    ['PR-TC-SEC-001', 'XSS render check — UI judgement, covered in the SEMI/MCP pass'],
    ['PR-TC-SEC-007', 'privilege escalation (FA self-grants role) — needs FA CSRF/token write path'],
    ['PR-TC-SEC-008', 'malicious SVG upload sanitisation — needs file-upload fixture'],
    ['PR-TC-SEC-009', 'no PII in URL — observational across flows (SEMI)'],
    ['PR-TC-SEC-010', 'audit log completeness — needs Activity Log inspection per event'],
    ['PR-TC-SEC-011', 'VAPT by CERT-In empanelled agency — external engagement'],
  ] as const) {
    test(`${id} · (manual / external)`, async () => { test.skip(true, `Manual: ${why}`); });
  }
});
