import { Page, Locator, expect } from '@playwright/test';

/**
 * App shell — sidebar nav + user menu. Shared by every authenticated page.
 */
export class AppShell {
  constructor(private readonly page: Page) {}

  // Live-verified (28 May 2026): the SPA shell renders the sidebar as a
  // <aside> (role=complementary), nav as a <nav> of links, and the user menu
  // as a button that contains the logged-in email. Notifications is a button
  // labelled "Open notifications" plus a nav link "Notifications".
  readonly sidebar = (): Locator => this.page.getByRole('complementary').first();
  readonly userMenu = (): Locator => this.page.getByRole('button').filter({ hasText: /@/ }).first();
  readonly notificationBell = (): Locator => this.page.getByRole('button', { name: /open notifications/i });
  readonly searchInput = (): Locator => this.page.getByRole('button', { name: /search doctypes/i }).first();

  navLink = (label: string | RegExp): Locator =>
    this.page.getByRole('navigation').getByRole('link', { name: label });

  async expectShellRendered(): Promise<void> {
    await expect(this.sidebar()).toBeVisible();
    await expect(this.userMenu()).toBeVisible();
  }

  async expectFullName(name: string | RegExp): Promise<void> {
    await expect(this.page.getByText(name)).toBeVisible();
  }

  async navigateTo(label: string | RegExp): Promise<void> {
    await this.navLink(label).first().click();
  }

  async signOut(): Promise<void> {
    await this.userMenu().click();
    await this.page.getByRole('menuitem', { name: /sign out|log out/i }).click();
    await expect(this.page).toHaveURL(/\/login/);
  }
}
