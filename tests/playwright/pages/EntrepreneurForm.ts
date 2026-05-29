import { Page, Locator, expect } from '@playwright/test';

/**
 * Entrepreneur Profile form (the "+ Add Entrepreneur" flow).
 *
 * Route (live-verified 28 May 2026): the product is a custom Vue SPA mounted at
 * `/primerural`, NOT the Frappe desk at `/app`. A new EP form lives at
 *   /primerural/d/Enterprenur%20Profile/new
 * and an existing one at
 *   /primerural/d/Enterprenur%20Profile/<name>
 *
 * Selector strategy: the form ships NO `data-testid`, no input `id`/`name`, and
 * labels are not associated (`<label for>` is absent). BUT every field wrapper
 * carries `data-fieldname="<frappe_field>"`, which is unique and stable. So we
 * address controls as `[data-fieldname="x"] input|select|textarea`. This is the
 * hook the README's `test.fixme` notes were waiting on — it already exists.
 */
export class EntrepreneurForm {
  constructor(private readonly page: Page) {}

  static readonly NEW_URL = '/primerural/d/Enterprenur%20Profile/new';

  /** Tabs, in render order (verified on the live Profile form). */
  static readonly TABS = [
    'Profile',
    'Location And Contact',
    'Documents',
    'Selection',
    'Prioritization',
    'Networking & Monitoring',
  ] as const;

  // --- structural locators -------------------------------------------------
  readonly heading = (): Locator => this.page.getByRole('heading', { level: 1 });
  readonly saveButton = (): Locator => this.page.getByRole('button', { name: 'Save', exact: true });
  readonly cancelButton = (): Locator => this.page.getByRole('button', { name: 'Cancel', exact: true });
  tab = (name: string): Locator => this.page.getByRole('button', { name });

  /** A control addressed by its Frappe fieldname (the verified strategy). */
  field = (fieldname: string): Locator =>
    this.page.locator(`[data-fieldname="${fieldname}"]`).locator('input, select, textarea').first();

  fieldWrap = (fieldname: string): Locator =>
    this.page.locator(`[data-fieldname="${fieldname}"]`);

  // --- actions -------------------------------------------------------------
  async gotoNew(): Promise<void> {
    await this.page.goto(EntrepreneurForm.NEW_URL);
    await expect(this.heading()).toContainText(/New Enterprenur Profile/i);
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
  }

  async setName(value: string): Promise<void> {
    await this.field('enterprenur_name').fill(value);
  }
}
