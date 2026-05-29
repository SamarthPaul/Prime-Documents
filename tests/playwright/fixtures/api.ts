import { APIRequestContext, request } from '@playwright/test';

/**
 * Lightweight Frappe REST helper used by seed / cleanup / negative-auth tests.
 *
 * Two auth modes:
 *   - asAdmin()   → uses ADMIN_API_KEY:SECRET (for setup / teardown only)
 *   - asUser(key) → uses a regular user's API key/secret (for role tests)
 */

export class FrappeApi {
  constructor(private readonly ctx: APIRequestContext, private readonly baseURL: string) {}

  static async asAdmin(): Promise<FrappeApi> {
    const key = process.env.ADMIN_API_KEY;
    const sec = process.env.ADMIN_API_SECRET;
    const baseURL = process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in';
    if (!key || !sec) throw new Error('ADMIN_API_KEY / ADMIN_API_SECRET not set');
    const ctx = await request.newContext({
      baseURL,
      // Force an empty cookie jar: under the test runner, newContext otherwise
      // inherits the project's storageState (a logged-in user's `sid` cookie),
      // and Frappe then prefers that session over the token header — which makes
      // writes demand a CSRF token (CSRFTokenError). Token auth must be cookieless.
      storageState: { cookies: [], origins: [] },
      extraHTTPHeaders: { Authorization: `token ${key}:${sec}` },
    });
    return new FrappeApi(ctx, baseURL);
  }

  static async asUser(key: string, secret: string): Promise<FrappeApi> {
    const baseURL = process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in';
    const ctx = await request.newContext({
      baseURL,
      storageState: { cookies: [], origins: [] },  // cookieless → token auth honored (see asAdmin)
      extraHTTPHeaders: { Authorization: `token ${key}:${secret}` },
    });
    return new FrappeApi(ctx, baseURL);
  }

  // ---------- CRUD primitives ----------

  async getDoc<T = unknown>(doctype: string, name: string): Promise<T> {
    const r = await this.ctx.get(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
    if (!r.ok()) throw new Error(`GET ${doctype}/${name} → ${r.status()}: ${await r.text()}`);
    return (await r.json()).data as T;
  }

  async insert<T = unknown>(doctype: string, doc: Record<string, unknown>): Promise<T> {
    const r = await this.ctx.post('/api/method/frappe.client.insert', {
      form: { doc: JSON.stringify({ doctype, ...doc }) },
    });
    if (!r.ok()) throw new Error(`INSERT ${doctype} → ${r.status()}: ${await r.text()}`);
    return (await r.json()).message as T;
  }

  async setValue(doctype: string, name: string, fieldname: string, value: unknown): Promise<void> {
    const r = await this.ctx.post('/api/method/frappe.client.set_value', {
      form: { doctype, name, fieldname, value: String(value) },
    });
    if (!r.ok()) throw new Error(`SET_VALUE ${doctype}/${name}.${fieldname} → ${r.status()}: ${await r.text()}`);
  }

  async deleteDoc(doctype: string, name: string): Promise<void> {
    const r = await this.ctx.delete(`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`);
    if (!r.ok() && r.status() !== 404) {
      throw new Error(`DELETE ${doctype}/${name} → ${r.status()}: ${await r.text()}`);
    }
  }

  async list<T = unknown>(doctype: string, opts: {
    filters?: unknown[][];
    fields?: string[];
    limit?: number;
    orderBy?: string;
  } = {}): Promise<T[]> {
    const qs = new URLSearchParams();
    if (opts.filters) qs.set('filters', JSON.stringify(opts.filters));
    if (opts.fields)  qs.set('fields',  JSON.stringify(opts.fields));
    if (opts.limit)   qs.set('limit_page_length', String(opts.limit));
    if (opts.orderBy) qs.set('order_by', opts.orderBy);
    const r = await this.ctx.get(`/api/resource/${encodeURIComponent(doctype)}?${qs.toString()}`);
    if (!r.ok()) throw new Error(`LIST ${doctype} → ${r.status()}: ${await r.text()}`);
    return (await r.json()).data as T[];
  }

  /** Direct access to the underlying request context — escape hatch. */
  raw(): APIRequestContext {
    return this.ctx;
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }
}
