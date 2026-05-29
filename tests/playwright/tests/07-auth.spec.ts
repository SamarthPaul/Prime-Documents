/**
 * Section 7 — Login & session
 * BRD source: https://samarthpaul.github.io/Prime-Documents/test-cases.html#auth
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppShell } from '../pages/AppShell';

test.describe('PR-TC-XC-AUTH · Email/password login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('PR-TC-XC-031 · valid SM credentials log in and land on app', async ({ page, context }) => {
    const pw = process.env.UAT_SM_PASSWORD;
    test.skip(!pw, 'UAT_SM_PASSWORD not set');

    const login = new LoginPage(page);
    await login.goto();
    await login.fillCredentials('uat-sm@dhwaniris.com', pw!);
    await login.submit();

    // Verified 28 May 2026: successful login lands on the Vue SPA at
    // /primerural (NOT the Frappe desk /app). Accept /desk too in case a deep
    // link bounced through the workspace router.
    await expect(page).toHaveURL(/\/(primerural|app|desk)/, { timeout: 10_000 });
    const shell = new AppShell(page);
    await shell.expectShellRendered();

    // sid cookie should be HttpOnly + Secure (HTTPS)
    const sid = (await context.cookies()).find((c) => c.name === 'sid');
    expect(sid, 'sid cookie should be set after login').toBeDefined();
    expect(sid!.httpOnly).toBe(true);
    expect(sid!.secure).toBe(true);
  });

  test('PR-TC-XC-032 · wrong password shows generic error (no enumeration)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillCredentials('uat-sm@dhwaniris.com', 'definitely-not-the-password-1!');
    await login.submit();
    await login.expectStillOnLogin();
    await login.expectGenericInvalidCredsError();
  });

  test('PR-TC-XC-033 · non-existent email shows identical generic error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillCredentials('does-not-exist-on-staging@example.com', 'whatever');
    await login.submit();
    await login.expectStillOnLogin();
    await login.expectGenericInvalidCredsError();
  });

  test('PR-TC-XC-032b · login API returns generic 401 (no user enumeration)', async ({ request }) => {
    // Verified live 28 May 2026: both a real user with a wrong password and a
    // wholly non-existent user return an IDENTICAL 401 + message, so the API
    // does not leak which emails exist. This is the robust (UI-independent)
    // form of the no-enumeration check.
    const wrongPw = await request.post('/api/method/login', {
      form: { usr: 'uat-sm@dhwaniris.com', pwd: 'definitely-not-the-password-1!' },
    });
    const noSuchUser = await request.post('/api/method/login', {
      form: { usr: `nobody-${Date.now()}@nowhere.invalid`, pwd: 'whatever' },
    });

    expect(wrongPw.status()).toBe(401);
    expect(noSuchUser.status()).toBe(401);
    const a = await wrongPw.json();
    const b = await noSuchUser.json();
    expect(a.message).toMatch(/invalid login credentials/i);
    expect(b.message).toBe(a.message); // identical → no enumeration
  });

  test('PR-TC-XC-035 · malformed email is blocked client-side', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillCredentials('not-an-email', 'whatever');

    // The browser may block submit via :invalid styling, or the app may show inline.
    // Either way, after submit we should still be on /login.
    await login.submit().catch(() => { /* native form may reject the click */ });
    await login.expectStillOnLogin();
  });
});
