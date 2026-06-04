# Journey 1 — User Management & Role-Based Access (Test Case Draft)

> **Draft for review.** Once approved, these plot into `test-cases.html` (master) and codify into
> `tests/playwright/tests/13-user-mgmt.spec.ts` / `13b`.
> **Oracle:** BRD `PR-OV-004 · Role & Permission Matrix` (updated 4 Jun 2026 — Products in Fessociate menu,
> Entrepreneur Progress Report workspace, Super Admin implicit, District Coordinator district-scoped).
> **Live facts (scouted 4 Jun):** create-user form at `/primerural/d/User Manager/new` — mandatory
> `full_name` + `email`; fields by `data-fieldname`; role-profile cards assign role bundles; Permission
> Assignment child table (Allow = Block/District, For Value = …).
> **GUARD** = encodes the spec; expected RED until the linked bug is fixed.

---

## Part A — Field-user creation (run as Core Team IT; cross-check as Super Admin)

| ID | Title | Pre-conditions | Steps | Expected | Maps to |
|----|-------|----------------|-------|----------|---------|
| PR-TC-UM-101 | Create-user form loads with required markers | Logged in as Core Team IT | Open User Management → **+ New** | Form shows Basic Info, Role Profile Assignment, Permission Assignment; **Full Name \*** and **Email \*** marked required; **Save disabled** until both filled | BRD UM (CT-IT Full CRUD) |
| PR-TC-UM-102 | Empty save blocked with field-specific errors | CT-IT, new form | Click **Save** with all fields empty | Save blocked; explicit "Full Name is required" + "Email is required" (no generic error) | bug-class (exact-error) |
| PR-TC-UM-103 | Invalid email rejected | CT-IT, new form | Full Name = `[UAT] Test`; Email = `not-an-email` → Save | Rejected with email-format validation message | BRD UM |
| PR-TC-UM-104 | Email is unique | CT-IT; an existing user email known | Create user with an already-used email → Save | Rejected ("already exists"/duplicate) | BRD UM |
| PR-TC-UM-105 | Role profile → role mapping | CT-IT, new form | Assign **Field Team** profile; Save; inspect created user's roles | User receives exactly **Field Associate + Mobile User**; no Core Team roles | BRD role model |
| PR-TC-UM-106 | Permission assignment persists (block/district scope) | CT-IT, Field Team user | Add Permission rows: Allow=**Block** / Value=`<block>`, Allow=**District** / Value=`<district>`; Save | Rows persist as User Permissions; on the user's EP forms, District/Block auto-fill from these | BRD block-restriction callout |
| PR-TC-UM-107 | Mobile number optional but validated if entered | CT-IT, new form | Enter Mobile = `12345` → Save | If a rule exists: rejected (10-digit, starts 6–9); else flagged as a finding | BRD UM / bug #12 parity |
| PR-TC-UM-108 | Username auto-derives from name/email | CT-IT, new form | Enter Full Name; observe Username field | Username auto-suggested (e.g. `samarth_field_user`), editable, unique | live behaviour |
| PR-TC-UM-109 | Created user appears in list | CT-IT | After save, return to User Manager list | New user visible with Full Name / Email / Mobile columns; record count +1 | BRD UM |
| PR-TC-UM-110 | New user can authenticate | new field user created | Log in as the new user (set password / invite flow) | Login succeeds; lands on role landing page | BRD UM |

## Part B — Per-role access (login as each role; assert sidebar = BRD + landing + page-access + data-scope)

| ID | Title | Role | Steps | Expected (per BRD matrix) | Maps to |
|----|-------|------|-------|---------------------------|---------|
| PR-TC-UM-120 | Core Team IT sidebar + landing | Core Team IT | Login (clean reload) | Sidebar = Landscape, Intervention Dash, Milestone Tracker, Entrepreneur (List/Status/**Progress Report**), Products, Activity Logger, Diagnostics, Research Note, Village Survey, Notifications, **User Management**, **Masters**; landing = Landscape | BRD Core-IT lane ✅ verified live |
| PR-TC-UM-121 | Core Team Program — User Mgmt/Masters view-only | Core Team Program | Open User Management + Masters | Both visible but **view-only** (no + New / no edit/save) | BRD matrix |
| PR-TC-UM-122 | Fessociate sidebar | Field Associate | Login (clean reload) | Sidebar HAS Landscape, Entrepreneur (List/Status/Progress Report), **Products**, Diagnostics, Activity Logger, Research Note, Village Survey, Notifications; **NO** Milestone Tracker, Intervention Dash, User Management, Masters; landing = Landscape | BRD Fessociate lane ✅ verified live |
| PR-TC-UM-123 | Fessociate cannot reach User Management by URL | Field Associate | Navigate directly to `/primerural/d/User Manager` | Blocked / redirected / 403 — **not** rendered | BRD matrix (FA = —) |
| PR-TC-UM-124 | Fessociate block-scoped create | Field Associate (block X) | Create EP with block = own; then attempt block ≠ own | Own-block create allowed; cross-block create rejected; District/Block auto-fill from profile | BRD block-restriction |
| PR-TC-UM-125 | Designer sidebar + landing | Designer | Login | Sidebar = Marketing Tools › Branding Identity / Labels / Brochure + Notifications **only**; landing = Branding Identity; can **upload drafts** only | BRD Designer lane |
| PR-TC-UM-126 | SELCO Infrastructure-only + field-level edit | SELCO Exec | Login; open Infrastructure framework | Sidebar = Infrastructure + Notifications; can view all tabs (BE/EE/CE) but **edit only SELCO fields** (pricing, equipment status, disbursement) | BRD SELCO row |
| PR-TC-UM-127 | District Coordinator — district-scoped view-only | District Coordinator (district D) | Login | View-only across Landscape, Intervention, Milestone, Entrepreneur, Progress Report, Diagnostics, Notifications; **data scoped to district D**; no create/edit anywhere | BRD DC lane + matrix |
| PR-TC-UM-128 | Lifecycle authority — only Core Team IT sets Incubated/Supported | each role | On an EP record, attempt to set Final Selection = Incubated/Supported | Allowed only for Core Team IT (+ Super Admin); disabled/blocked for Fessociate, CT-Program, etc. | BRD `PR-OV-005` |
| PR-TC-UM-129 | Notifications matrix | each role | Open Notifications | CT-IT = Receive+Send+Manage; CT-Program = Receive only (no send); Fessociate/Designer/SELCO/DC = Receive | BRD Notifications row |
| PR-TC-UM-130 | Super Admin full access | Super Admin / System Manager | Login | All workspaces visible + full CRUD incl. User Management, Masters, Progress Report | BRD header note |

## Part C — Regression guards (the 3 logged bugs)

| ID | Title | Steps | Expected | Bug (tracker row) |
|----|-------|-------|----------|-------------------|
| PR-TC-UM-140 | **GUARD** Re-login refreshes user boot | Login as user A → sign out → login as user B (same browser, no manual reload) | Sidebar immediately shows **B's** name + B's role-appropriate nav (no stale A) | Stale boot — row 58 |
| PR-TC-UM-141 | **GUARD** Single Core Team IT role profile | Open create-user → Role Profile Assignment | Exactly one IT profile ("Core Team - IT"); **no** "Core Team Information Technology" | Duplicate IT — row 59 |
| PR-TC-UM-142 | **GUARD** District Coordinator profile (not Viewer) | Open create-user → Role Profile Assignment | A "District Coordinator" profile exists (district-scoped); **no** generic "Viewer" | Viewer→DC — row 60 |

---

### Notes / open items
- Role-label parity to confirm with client: app "Field Team" ↔ BRD "Fessociate"; app "SELCO" ↔ BRD "SELCO Executive". If the BRD names are canonical, the app cards should be relabelled (else a naming bug).
- Lingering **MSG91 Integration** module profile despite the no-MSG91 / Google-SSO decision — cleanup candidate.
- **Creds needed to execute Part B:** working logins for CT-Program, Designer, SELCO, District Coordinator, and a block-scoped Field Associate. Have: Core Team IT + Admin.
- On approval: plot PR-TC-UM-1xx into `test-cases.html` and codify into `13-user-mgmt.spec.ts` (sidebar/landing/url-guard assertions are deterministic; data-scope needs the per-role storageState).
