import { APIRequestContext, Page } from '@playwright/test';

/**
 * Shared UI helpers for the "no backend identifiers in the client UI" checks
 * (used by 08-ui-no-backend-leak and the 17-frameworks sweep).
 *
 * All patterns verified against staging 29 May 2026.
 */
export const LEAK_PATTERNS: { id: string; re: RegExp; what: string }[] = [
  { id: 'doctype-df-prefix',    re: /\bDF [A-Z][A-Za-z]+/g,                            what: 'raw "DF <Doctype>" name' },
  { id: 'enterprenur-internal', re: /Enterprenur/g,                                    what: 'internal doctype label / misspelling "Enterprenur"' },
  { id: 'raw-uuid',             re: /[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/gi,   what: 'raw UUID on screen' },
  { id: 'sync-id-label',        re: /\b(mobile uuid|sync id|device id|mobile id)\b/gi, what: 'mobile/sync identifier label' },
];

/** Distinct leak strings found in the page's main-content chrome. */
export async function scanChrome(page: Page): Promise<Record<string, string[]>> {
  const text = await page.evaluate(() => {
    const main = document.querySelector('main');
    return (main as HTMLElement | null)?.innerText ?? document.body.innerText;
  });
  const found: Record<string, string[]> = {};
  for (const p of LEAK_PATTERNS) {
    const m = text.match(p.re);
    if (m) found[p.id] = [...new Set(m)].slice(0, 8);
  }
  return found;
}

/** Most-recently-modified record name for a doctype, or null if none / no access. */
export async function sampleName(request: APIRequestContext, doctype: string): Promise<string | null> {
  const r = await request.get(`/api/resource/${encodeURIComponent(doctype)}`, {
    params: { limit_page_length: '1', order_by: 'modified desc' },
  });
  if (!r.ok()) return null;
  const data = (await r.json()).data;
  return data?.[0]?.name ?? null;
}
