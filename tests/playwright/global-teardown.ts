import { request } from '@playwright/test';

/**
 * Cleanup of [UAT]-prefixed records via the admin API.
 *
 * We delete records whose primary text field starts with "[UAT]" across the
 * doctypes test specs are expected to mutate. The list is intentionally
 * narrow — we never blanket-delete from staging.
 *
 * Order matters: delete child / dependent docs first.
 */

const ADMIN_KEY = process.env.ADMIN_API_KEY ?? '';
const ADMIN_SECRET = process.env.ADMIN_API_SECRET ?? '';
const BASE_URL = process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in';

// Cleanup order: dependents first, then masters last.
const CLEANUP_DOCTYPES: Array<{ doctype: string; filterField: string }> = [
  { doctype: 'Entrepreneur Meeting Log',  filterField: 'name' },
  { doctype: 'Entrepreneur Introduction', filterField: 'name' },
  { doctype: 'Enterprenur Profile',       filterField: 'enterprenur_name' },
  { doctype: 'Product Master',            filterField: 'product_name' },
  { doctype: 'Mentor Master',             filterField: 'mentor_name' },
  { doctype: 'Cohort',                    filterField: 'name' },
  { doctype: 'Sector',                    filterField: 'name' },
];

async function adminAuthedRequest() {
  if (!ADMIN_KEY || !ADMIN_SECRET) {
    console.log('[global-teardown] ADMIN_API_KEY / ADMIN_API_SECRET not set — skipping cleanup.');
    return null;
  }
  return request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Authorization: `token ${ADMIN_KEY}:${ADMIN_SECRET}`,
    },
  });
}

export default async function globalTeardown(): Promise<void> {
  const api = await adminAuthedRequest();
  if (!api) return;

  console.log(`\n[global-teardown] Cleaning [UAT]-prefixed records\n`);
  let totalDeleted = 0;

  for (const { doctype, filterField } of CLEANUP_DOCTYPES) {
    const url =
      `/api/resource/${encodeURIComponent(doctype)}?` +
      `filters=${encodeURIComponent(JSON.stringify([[filterField, 'like', '[UAT]%']]))}` +
      `&limit_page_length=1000`;

    const resp = await api.get(url);
    if (!resp.ok()) {
      console.log(`  ⚠ ${doctype} list failed (${resp.status()}); skipping`);
      continue;
    }
    const data = await resp.json() as { data?: Array<{ name: string }> };
    const names = (data.data ?? []).map((d) => d.name);
    if (names.length === 0) continue;

    for (const name of names) {
      const del = await api.delete(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
      if (del.ok()) totalDeleted++;
    }
    console.log(`  ✓ ${doctype.padEnd(32)} deleted ${names.length}`);
  }

  console.log(`\n[global-teardown] Total records deleted: ${totalDeleted}\n`);
  await api.dispose();
}
