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

    await expect(page).toHaveURL(/\/app/, { timeout: 10_000 });
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
