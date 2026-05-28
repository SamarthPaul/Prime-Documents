import { chromium, FullConfig, request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Logs in as each of the 6 UAT roles via the API and writes a Playwright
 * storageState JSON to .auth/<role>.json. Specs then run in projects that
 * point at these files (see playwright.config.ts).
 *
 * Why API login (not UI)?
 *   - Faster (~200ms per role vs ~2s through the login form)
 *   - Avoids hammering the UI on every CI run
 *   - Still issues a real Frappe session cookie, so behaviour is identical
 */

type Role = {
  key: 'sm' | 'cti' | 'ctp' | 'fa' | 'selco' | 'designer';
  email: string;
  password: string;
};

const ROLES: Role[] = [
  { key: 'sm',       email: 'uat-sm@dhwaniris.com',       password: process.env.UAT_SM_PASSWORD ?? '' },
  { key: 'cti',      email: 'uat-cti@dhwaniris.com',      password: process.env.UAT_CTI_PASSWORD ?? '' },
  { key: 'ctp',      email: 'uat-ctp@dhwaniris.com',      password: process.env.UAT_CTP_PASSWORD ?? '' },
  { key: 'fa',       email: 'uat-fa@dhwaniris.com',       password: process.env.UAT_FA_PASSWORD ?? '' },
  { key: 'selco',    email: 'uat-selco@dhwaniris.com',    password: process.env.UAT_SELCO_PASSWORD ?? '' },
  { key: 'designer', email: 'uat-designer@dhwaniris.com', password: process.env.UAT_DESIGNER_PASSWORD ?? '' },
];

async function loginAndSaveState(baseURL: string, role: Role): Promise<void> {
  if (!role.password) {
    throw new Error(
      `Missing password for role "${role.key}". Set UAT_${role.key.toUpperCase()}_PASSWORD in .env or CI secrets.`
    );
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  // Frappe login endpoint accepts form-encoded usr / pwd and sets the sid cookie.
  const resp = await page.request.post(`${baseURL}/api/method/login`, {
    form: { usr: role.email, pwd: role.password },
  });

  if (!resp.ok()) {
    const body = await resp.text();
    await browser.close();
    throw new Error(`Login failed for ${role.email} (${resp.status()}): ${body.slice(0, 200)}`);
  }

  // Hit a protected page once so any client-side bootstrapping persists into storageState.
  await page.goto('/app');
  await page.waitForLoadState('networkidle').catch(() => { /* tolerate slow boot */ });

  const authDir = path.join(__dirname, '.auth');
  fs.mkdirSync(authDir, { recursive: true });
  const statePath = path.join(authDir, `uat-${role.key}.json`);
  await context.storageState({ path: statePath });

  await browser.close();
  console.log(`  ✓ ${role.email.padEnd(35)} → ${path.relative(__dirname, statePath)}`);
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0].use.baseURL ?? process.env.BASE_URL ?? '';
  if (!baseURL) throw new Error('BASE_URL not set — check playwright.config.ts and .env');

  console.log(`\n[global-setup] Logging in 6 UAT users at ${baseURL}\n`);
  for (const role of ROLES) {
    await loginAndSaveState(baseURL, role);
  }
  console.log(`\n[global-setup] All session states saved to .auth/\n`);
}
