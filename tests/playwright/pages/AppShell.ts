import { Page, Locator, expect } from '@playwright/test';

/**
 * App shell — sidebar nav + user menu. Shared by every authenticated page.
 */
export class AppShell {
  constructor(private readonly page: Page) {}

  readonly sidebar = (): Locator => this.page.locator('aside, [data-testid="sidebar"]').first();
  readonly userMenu = (): Locator => this.page.locator('[data-testid="user-menu"], .avatar, .user-cluster').first();
  readonly notificationBell = (): Locator => this.page.locator('[data-testid="notification-bell"], .bell, [aria-label*="notification" i]').first();
  readonly searchInput = (): Locator => this.page.getByPlaceholder(/search/i).first();

  navLink = (label: string | RegExp): Locator =>
    this.page.locator('aside a, [role="navigation"] a').filter({ hasText: label });

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
