import { Page, Locator, expect } from '@playwright/test';

/**
 * Login page object for the PRIME Rural SPA login at /primerural/login.
 *
 * IMPORTANT (verified 29 May 2026): there are TWO login pages on staging —
 *   - /login            → the stock Frappe web login (button "Login", #login_email)
 *   - /primerural/login → the product SPA login ("Welcome back", "Sign in" button)
 * Logged-out users (and the post-sign-out redirect) land on the SPA login, so
 * that is the real user-facing surface and the one we drive here. The SPA login
 * exposes no id/name/testid on its fields — we target by placeholder/role.
 *
 * The happy-path login for authenticated specs is handled in global-setup via
 * the API; this page object is for the entry / negative-auth specs.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly emailInput      = (): Locator => this.page.getByPlaceholder('you@dhwaniris.com');
  readonly passwordInput   = (): Locator => this.page.locator('main input[type="password"]').first();
  readonly submitButton    = (): Locator => this.page.getByRole('button', { name: /^sign in$/i });
  readonly googleSsoButton = (): Locator => this.page.getByRole('link', { name: /continue with google/i });
  readonly forgotPasswordLink = (): Locator => this.page.getByRole('link', { name: /forgot password/i });
  readonly errorBanner     = (): Locator => this.page.locator('[role="alert"]').first();

  async goto(): Promise<void> {
    await this.page.goto('/primerural/login');
    await expect(this.emailInput()).toBeVisible();
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton().click();
  }

  async expectStillOnLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
  }

  /**
   * A failed login must show a friendly, generic error — NOT the raw backend
   * exception class. As of 29 May 2026 staging shows the literal string
   * "AuthenticationError" (bug PR-TC-XC-032), so the friendly-message assertion
   * fails by design until the app maps the error to human-readable text.
   */
  async expectGenericInvalidCredsError(): Promise<void> {
    const banner = this.errorBanner();
    await expect(banner).toBeVisible();
    // Must not leak a raw exception class / type name to the user.
    await expect(banner, 'login error must be friendly text, not a raw exception class')
      .not.toContainText(/AuthenticationError|Exception|Traceback|\bError\b$/);
    // Must be a recognisably generic credentials error...
    await expect(banner).toContainText(/invalid|incorrect|wrong|credential/i);
    // ...and must NOT distinguish "user not found" from "wrong password".
    await expect(banner).not.toContainText(/no such user|user does not exist|email not found/i);
  }
}
