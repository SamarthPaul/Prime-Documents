/**
 * Lighthouse-CI puppeteer login hook (authenticated pages).
 *
 * LHCI calls this with the shared browser BEFORE collecting each URL. We establish a
 * Frappe session by POSTing to /api/method/login (same mechanism the E2E suite uses),
 * which sets the `sid` cookie on the browser context so the subsequent authenticated
 * page collections render real data.
 *
 * Requires UAT_SM_PASSWORD in the environment (Super Admin — broadest read surface).
 * Override the host with BASE_URL.
 */
const BASE_URL = process.env.BASE_URL || 'https://stgprime-rural.dhwaniris.in';
const USR = process.env.LH_LOGIN_USR || 'uat-sm@dhwaniris.com';
const PWD = process.env.UAT_SM_PASSWORD;

module.exports = async (browser /*, context */) => {
  if (!PWD) {
    throw new Error('lh-login.js: UAT_SM_PASSWORD is not set — cannot authenticate for the authenticated Lighthouse run.');
  }
  const page = await browser.newPage();
  // Land on the origin first so the fetch is same-origin and the Set-Cookie sticks.
  await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(async ({ usr, pwd }) => {
    const r = await fetch('/api/method/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'include',
      body: new URLSearchParams({ usr, pwd }),
    });
    return { status: r.status, body: (await r.text()).slice(0, 120) };
  }, { usr: USR, pwd: PWD });

  if (result.status !== 200) {
    throw new Error(`lh-login.js: login failed (${result.status}) ${result.body}`);
  }
  // Hard reload so the SPA boots in the authenticated session (Frappe stale-boot guard).
  await page.goto(BASE_URL + '/primerural/', { waitUntil: 'networkidle' });
  await page.close();
};
