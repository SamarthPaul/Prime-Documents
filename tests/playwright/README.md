# PRIME Rural — Playwright E2E

End-to-end test suite for the PRIME Rural Web CRM, executing against
**`https://stgprime-rural.dhwaniris.in/`** (staging).

Test cases that this suite implements are catalogued at
**[test-cases.html](https://samarthpaul.github.io/Prime-Documents/test-cases.html)**
(319 cases). Each `*.spec.ts` references the corresponding `PR-TC-*` ID in
its test name so failures map back to the master document.

---

## Layout

```
tests/playwright/
├── package.json
├── playwright.config.ts          # baseURL, browsers, projects, reporters
├── tsconfig.json
├── .env.example                  # copy to .env locally; CI uses GH secrets
├── global-setup.ts               # logs in as 6 roles → .auth/<role>.json
├── global-teardown.ts            # sweeps [UAT]-prefixed records via admin API
├── fixtures/
│   ├── auth.ts                   # role helpers (rare — most specs use --project)
│   ├── api.ts                    # FrappeApi class (admin / user mode)
│   └── data.ts                   # seedEntrepreneur(), seedCohort(), etc.
├── pages/
│   ├── LoginPage.ts              # negative-auth UI page object
│   └── AppShell.ts               # sidebar + user menu + nav helpers
└── tests/
    ├── 04-entry.spec.ts          # PR-TC-XC-001…004,007,009
    ├── 07-auth.spec.ts           # PR-TC-XC-031,032,033,035
    ├── 13-user-mgmt.spec.ts      # PR-TC-UM-018,026
    └── 15-ep-profile.spec.ts     # PR-TC-EP-031,039 + seed-sanity
```

---

## Local quickstart

```bash
cd tests/playwright
cp .env.example .env             # fill in the placeholder secrets (see §Auth)
npm install
npx playwright install --with-deps chromium

npm test                         # full suite, headless
npm run test:headed              # watch the browser
npm run test:ui                  # interactive UI mode
npm run test:auth                # only login / entry specs
npm run report                   # open the last HTML report
```

To inspect a flaky failure later:

```bash
npx playwright show-trace test-results/<spec>-<test>/trace.zip
```

---

## Auth strategy

`global-setup.ts` logs in as each of the 6 UAT users via `POST /api/method/login`
(form-encoded `usr` + `pwd`) and writes the resulting cookies to
`.auth/uat-<role>.json`. Each Playwright **project** in `playwright.config.ts`
points at one of these files, so specs that run under `--project=fa` arrive
already logged in as the Field Associate.

| Project   | Role                       | storageState              |
| --------- | -------------------------- | ------------------------- |
| `sm`      | System Manager             | `.auth/uat-sm.json`       |
| `cti`     | Core Team IT               | `.auth/uat-cti.json`      |
| `ctp`     | Core Team Member (Program) | `.auth/uat-ctp.json`      |
| `fa`      | Field Associate            | `.auth/uat-fa.json`       |
| `selco`   | SELCO                      | `.auth/uat-selco.json`    |
| `designer`| Designer                   | `.auth/uat-designer.json` |
| `anon`    | unauthenticated            | (none)                    |
| `firefox` | SM in Firefox              | `.auth/uat-sm.json`       |
| `webkit`  | SM in Safari/WebKit        | `.auth/uat-sm.json`       |

Run a single project: `npx playwright test --project=fa`.

A spec can override the project's default at the file level with
`test.use({ storageState: '.auth/uat-XYZ.json' })` — both `13-user-mgmt.spec.ts`
and `15-ep-profile.spec.ts` show this pattern.

---

## Secrets

| Variable                 | Used by             | Source                  |
| ------------------------ | ------------------- | ----------------------- |
| `BASE_URL`               | config              | `.env` / repo secret    |
| `UAT_*_PASSWORD` (× 6)   | `global-setup.ts`   | `.env` / repo secret    |
| `ADMIN_API_KEY`/`SECRET` | seed / teardown     | `.env` / repo secret    |

**Never commit `.env`.** CI reads from GitHub Actions secrets — see
`.github/workflows/playwright.yml`.

To generate the admin API key/secret: log in as Administrator on staging →
*My Profile → API Access → Generate Keys*. Rotate before go-live.

---

## Data hygiene

Every record created during a run is prefixed with `[UAT]` in its primary
text field. `global-teardown.ts` walks a fixed list of doctypes and deletes
matching rows in dependency order:

1. `Entrepreneur Meeting Log`
2. `Entrepreneur Introduction`
3. `Enterprenur Profile`
4. `Product Master`
5. `Mentor Master`
6. `Cohort`
7. `Sector`

If teardown skips (no admin creds), records linger — a Sunday-night cron will
sweep them.

---

## CI

`.github/workflows/playwright.yml` runs:

- on `workflow_dispatch` (manual trigger, with optional `suite` + `project` inputs)
- nightly at 07:30 IST Mon–Fri

Artifacts: HTML report (always) + traces (on failure). 14-day retention.

---

## Patterns

### Role-deny test (no UI)

```ts
test('PR-TC-SEC-003 · FA blocked from cross-block EP', async ({ request }) => {
  const r = await request.get('/api/resource/Enterprenur%20Profile/EP-CrossBlock-001', {
    headers: { Authorization: `token ${process.env.UAT_FA_API_KEY}:${process.env.UAT_FA_API_SECRET}` },
  });
  expect(r.status()).toBe(403);
});
```

### Parameterised framework suite

```ts
const FRAMEWORKS = [
  { id: 'm-financials', doctype: 'DF Financials',   tabs: ['BMC', 'Monthly', 'Log Book'] },
  // ...
];
for (const fw of FRAMEWORKS) {
  test.describe(`Framework: ${fw.id}`, () => {
    test('PR-TC-FW-COM-001 · page loads', async ({ page }) => {
      await page.goto(`/app/${fw.doctype}/new`);
      await expect(page.locator('.framework-header, h1').first()).toBeVisible();
    });
    test('PR-TC-FW-COM-002 · all tabs render', async ({ page }) => {
      await page.goto(`/app/${fw.doctype}/new`);
      for (const t of fw.tabs) await page.getByRole('tab', { name: t }).click();
    });
  });
}
```

---

## Live-verified findings (28 May 2026)

Browsed staging via the Playwright MCP as `uat-sm`. Key facts the specs depend on:

**Routes — the product is a Vue SPA at `/primerural`, NOT the Frappe desk `/app`.**

| Surface              | Real route                                  |
| -------------------- | ------------------------------------------- |
| Landscape (landing)  | `/primerural/`                              |
| Entrepreneur List    | `/primerural/entrepreneurs`                 |
| Products             | `/primerural/products`                      |
| Activity Logger      | `/primerural/calendar`                      |
| Intervention Dash    | `/primerural/interventions`                 |
| Milestone Tracker    | `/primerural/milestone-tracker`             |
| Village Survey       | `/primerural/village-survey`                |
| Masters              | `/primerural/masters`                       |
| User Management      | `/primerural/d/User Manager`                |
| Generic doctype form | `/primerural/d/<DocType>/new` and `/<name>` |

After a successful login the app lands on `/primerural` (a deep link may bounce
through `/desk/...`). `global-setup` mints cookies via `/app`, which is fine —
cookies are domain-scoped, so the storageState is valid for `/primerural` too.

**Login form** (`/login`): inputs use `#login_email` / `#login_password` but
those IDs are **duplicated** (a hidden email-link form reuses them) — scope with
`.first()`. The submit control reads **"Login"** (`button.btn-login`); Google SSO
is a **link** ("Login with Google"), not a button.

**EP form selectors — the `data-testid` blocker is RESOLVED.** The form has no
testids, but every field wrapper carries **`data-fieldname="<frappe_field>"`**
(unique, stable). Address controls as `[data-fieldname="x"] input|select|textarea`.
See `pages/EntrepreneurForm.ts`. Verified: 6 tabs, 38 fields on the Profile tab,
required `enterprenur_name` gates the Save button.

**Auth API**: bad password and unknown user both return **HTTP 401** with an
identical `{"message":"Invalid login credentials","exc_type":"AuthenticationError"}`
→ no user enumeration (`PR-TC-XC-032b`).

---

## Status

This is the **initial scaffold** — exercising the plumbing end-to-end. As of
28 May 2026 the login + EP page objects and the auth/EP specs are aligned to the
**live-verified** routes and selectors above; remaining `test.fixme` markers are
for surfaces not yet browsed.

Iteration order from here:

1. ✅ Login + storageState (this scaffold)
2. ✅ EP form selectors stabilised via `data-fieldname` (no dev-team testids needed)
3. ⏳ Full EP onboarding spec (`PR-TC-EP-001b` create+persist+cleanup → `...045`)
4. ⏳ Common framework runner (`PR-TC-FW-COM-001` ... `012`) parameterised
   across the 27 frameworks — confirm each framework's `/primerural` route + doctype
5. ⏳ Per-framework deltas (Financials BMC, Infra dual-mode + EMI, etc.)
6. ⏳ Dashboards + Activity Logger
7. ⏳ Negative-auth + security suite (API-level XC-032b landed)

> **Note for the rest of the suite:** any spec still pointing at `/app/...` is
> testing the raw Frappe desk, not the product. Re-point to `/primerural/...`
> before relying on it.

---

## Troubleshooting

| Symptom                                | Likely cause                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------- |
| `Missing password for role "xx"`       | `.env` missing `UAT_XX_PASSWORD` (local) or GH secret (CI)                    |
| All tests fail with `401` / `403`      | Staging admin API key rotated; regenerate and update `ADMIN_API_*`            |
| `Element not found` on `data-testid`   | App side hasn't shipped the testid yet — see `test.fixme` markers in specs    |
| Storage state outdated (`enabled = 0`) | UAT user got disabled on staging; re-enable via API and rerun                 |
| Pages site test-report 404             | Workflow uploads `playwright-report` as an artifact, not Pages — fetch from   |
|                                        | the workflow run page                                                         |
