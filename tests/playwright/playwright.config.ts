import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/** The §5 cross-browser smoke spec — owned by the firefox/webkit/chromium-smoke projects only. */
const CROSS_BROWSER_SMOKE = /00-crossbrowser-smoke\.spec\.ts/;

/**
 * PRIME Rural E2E config.
 *
 * Auth strategy: global-setup logs in once per role and writes a storageState
 * JSON per role into ./.auth/. Specs reference these via the asRole() fixture
 * (fixtures/auth.ts).
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: process.env.CI ? 'never' : 'on-failure' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  use: {
    baseURL: process.env.BASE_URL ?? 'https://stgprime-rural.dhwaniris.in',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: false,
    viewport: { width: 1440, height: 900 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    extraHTTPHeaders: {
      'Accept-Language': 'en-IN,en;q=0.9',
    },
  },

  projects: [
    // Authenticated role projects (Chromium) — run the full suite EXCEPT the
    // cross-browser smoke (that is owned by the firefox/webkit/chromium-smoke projects).
    { name: 'sm',       testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-sm.json' } },
    { name: 'cti',      testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-cti.json' } },
    { name: 'ctp',      testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-ctp.json' } },
    { name: 'fa',       testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-fa.json' } },
    { name: 'selco',    testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-selco.json' } },
    { name: 'designer', testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: '.auth/uat-designer.json' } },

    // Unauthenticated project — for login / negative-auth tests
    { name: 'anon',     testIgnore: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'], storageState: { cookies: [], origins: [] } } },

    // §5 Cross-browser compatibility — these projects run ONLY the cross-browser
    // smoke spec, on the three desktop engines (Blink / Gecko / WebKit). Run all
    // three with: npm run test:xbrowser  (or --project=firefox / webkit / chromium-smoke)
    { name: 'chromium-smoke', testMatch: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Chrome'],   storageState: '.auth/uat-sm.json' } },
    { name: 'firefox',        testMatch: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Firefox'],  storageState: '.auth/uat-sm.json' } },
    { name: 'webkit',         testMatch: CROSS_BROWSER_SMOKE, use: { ...devices['Desktop Safari'],   storageState: '.auth/uat-sm.json' } },
  ],
});
