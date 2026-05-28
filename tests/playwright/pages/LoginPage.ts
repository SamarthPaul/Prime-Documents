import { Page, Locator, expect } from '@playwright/test';

/**
 * /login page object. Used by negative-auth specs that exercise the form
 * (the happy-path login is handled in global-setup via API, not the UI).
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  readonly emailInput  = (): Locator => this.page.getByLabel(/email/i).first();
  readonly passwordInput = (): Locator => this.page.getByLabel(/password/i).first();
  readonly submitButton = (): Locator => this.page.getByRole('button', { name: /sign in|log in/i });
  readonly googleSsoButton = (): Locator => this.page.getByRole('button', { name: /continue with google/i });
  readonly forgotPasswordLink = (): Locator => this.page.getByRole('link', { name: /forgot password/i });
  readonly errorBanner = (): Locator => this.page.locator('[role="alert"], .form-message-error, .invalid-feedback').first();

  async goto(): Promise<void> {
    await this.page.goto('/login');
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

  async expectGenericInvalidCredsError(): Promise<void> {
    await expect(this.errorBanner()).toContainText(/invalid|incorrect|wrong/i, { ignoreCase: true });
    // Must NOT distinguish "user not found" vs "wrong password"
    await expect(this.errorBanner()).not.toContainText(/no such user|user does not exist|email not found/i);
  }
}
