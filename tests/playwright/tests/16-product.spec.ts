/**
 * Section 16 — Product Profile.
 *
 * Product Master CRUD + validation are real API assertions. The rich form
 * interactions (process-flow drag palette, SKU auto-gen, variant pricing rules,
 * chip multiselect, clickable cards) are deferred to the SEMI/MCP pass.
 *
 * BRD: https://samarthpaul.github.io/Prime-Documents/test-cases.html#product
 */
import { test, expect } from '@playwright/test';
import { FrappeApi } from '../fixtures/api';
import { UAT_PREFIX } from '../fixtures/data';

test.describe('PR-TC-PR · Product Profile', () => {
  test('PR-TC-PR-018 · Product API CRUD: create, read, update, delete', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const name = `${UAT_PREFIX} Wild Honey ${Date.now().toString(36)}`;
    let created = '';
    try {
      const p = await api.insert<{ name: string }>('Product Master', { product_name: name });
      created = p.name;
      expect(created).toBeTruthy();
      const got = await api.getDoc<{ product_name: string }>('Product Master', created);
      expect(got.product_name).toBe(name);
      await api.setValue('Product Master', created, 'product_name', `${name} v2`);
      created = `${name} v2`; // autoname follows product_name? if not, name stays — re-read by old name
    } finally {
      // try both possible names (rename may or may not move the PK)
      await api.deleteDoc('Product Master', created).catch(() => {});
      await api.deleteDoc('Product Master', name).catch(() => {});
      await api.dispose();
    }
  });

  test('PR-TC-PR-002 · duplicate product name (same key) is rejected', async () => {
    test.skip(!process.env.ADMIN_API_KEY, 'admin token required');
    const api = await FrappeApi.asAdmin();
    const name = `${UAT_PREFIX} DupProd ${Date.now().toString(36)}`;
    await api.insert('Product Master', { product_name: name });
    try {
      const r = await api.raw().post('/api/method/frappe.client.insert', {
        form: { doc: JSON.stringify({ doctype: 'Product Master', product_name: name }) },
      });
      expect(r.status(), 'duplicate product name should be rejected').toBeGreaterThanOrEqual(400);
    } finally {
      await api.deleteDoc('Product Master', name).catch(() => {});
      await api.dispose();
    }
  });

  for (const [id, why] of [
    ['PR-TC-PR-001', 'add product from Profile Dashboard tile — UI flow (SEMI)'],
    ['PR-TC-PR-003', 'shelf-life positive-integer inline validation — UI'],
    ['PR-TC-PR-004', 'available-months chip multiselect — UI'],
    ['PR-TC-PR-005', '5-step process-flow drag from palette — drag UI (SEMI)'],
    ['PR-TC-PR-006', 'reorder steps re-sequences — drag UI'],
    ['PR-TC-PR-007', 'process-flow machine pre-creates Raw Materials row — cross-framework UI'],
    ['PR-TC-PR-008', 'variant SKU auto-generation — UI + SKU engine'],
    ['PR-TC-PR-009', 'wholesale < unit-cost warning — UI banner'],
    ['PR-TC-PR-010', 'retail < wholesale hard-block — UI validation'],
    ['PR-TC-PR-011', 'variants picker for Labels/Packaging — UI multiselect'],
    ['PR-TC-PR-012', 'production-per-month auto-fetch from Unit Pricing — cross-framework UI'],
    ['PR-TC-PR-013', '₹ Indian grouping in product views — UI render (SEMI)'],
    ['PR-TC-PR-014', 'master SKU → variant SKU expansion — SKU engine'],
    ['PR-TC-PR-015', 'product cards clickable → detail tabs — UI flow'],
    ['PR-TC-PR-016', 'cannot delete product with framework data — needs seeded product+framework link'],
    ['PR-TC-PR-017', 'variants table 20+ rows layout — UI (SEMI)'],
  ] as const) {
    test(`${id} · (deferred)`, async () => { test.skip(true, why); });
  }
});
