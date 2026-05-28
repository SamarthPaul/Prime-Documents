import { test as base, expect, BrowserContext, Page } from '@playwright/test';

/**
 * Shared fixtures across specs.
 *
 *   import { test, expect } from '@fixtures/auth';
 *   test('does the thing', async ({ page }) => { ... });
 *
 * The current project (set via `--project=fa` etc. or default order) picks the
 * storageState file — so `page` arrives already-logged-in.
 *
 * For specs that need to swap roles mid-test (rare), use `useRoleStorage`.
 */

export const ROLE_EMAILS = {
  sm:       'uat-sm@dhwaniris.com',
  cti:      'uat-cti@dhwaniris.com',
  ctp:      'uat-ctp@dhwaniris.com',
  fa:       'uat-fa@dhwaniris.com',
  selco:    'uat-selco@dhwaniris.com',
  designer: 'uat-designer@dhwaniris.com',
} as const;

export type RoleKey = keyof typeof ROLE_EMAILS;

type Fixtures = {
  /**
   * Re-creates the browser context with a different role's storageState.
   * Use sparingly — prefer running the spec under the right --project flag.
   */
  useRoleStorage: (role: RoleKey) => Promise<Page>;
};

export const test = base.extend<Fixtures>({
  useRoleStorage: async ({ browser }, use) => {
    const contexts: BrowserContext[] = [];
    await use(async (role: RoleKey) => {
      const ctx = await browser.newContext({ storageState: `.auth/uat-${role}.json` });
      contexts.push(ctx);
      return ctx.newPage();
    });
    for (const ctx of contexts) {
      await ctx.close();
    }
  },
});

export { expect };
