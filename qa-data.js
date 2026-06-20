/* PRIME Rural — Wireframe-vs-Portal QA checklist data.
 *
 * One entry per framework (keyed by wireframe filename). Each `rows` item is ONE
 * element from the wireframe that must exist AND function on the portal.
 *
 * Verdict columns (p = present, v = shows values/options, fn = clickable/functional):
 *   'Y'  verified present / works
 *   'N'  missing / broken  -> counts as a GAP
 *   '?'  not yet verified on staging
 *   '-'  not applicable (e.g. a static label has no "options")
 * Row severity (sev): 'blocker' | 'serious' | 'minor' | '' .
 * fe = front-end requirement (from the wireframe HTML + BRD).
 * be = back-end requirement (from the BRD).
 *
 * A row is a GAP if p==='N' or v==='N' or fn==='N'. Empty p/v/fn that are '?'
 * render as "to verify" — never silently treated as pass.
 */
window.QA_DATA = {

  /* ============================================================
   * RAW MATERIALS  (Manufacturing module)  — PILOT
   * Portal path: Diagnostics > Raw Materials  (doctype: DF Raw Material)
   * Wireframe: from-client/raw_material_module.html (1555 lines, fully read)
   * ============================================================ */
  'raw_material_module.html': {
    framework: 'Raw Materials',
    module: 'Manufacturing',
    portalPath: 'Diagnostics › Manufacturing › Raw Materials  (DF Raw Material)',
    checkedOn: '20-Jun-2026 (CT-IT, RM-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (RM-EP-00026-00001, product Orange Jam + RAW-MAT Orange(Raw)). Tabs: Summary, Details (build add), Existing, Required, Resources, Log Book. Calc verified correct (Total ₹17) and persists on a UI-driven save. Skip-logic bridge (Existing flag → Required §I) WORKS. HEADLINE GAP confirmed: Required §III "New Raw Material" is absent (Bug 95). Also missing: Product SKU (Bug 96), Procured Season Time (Bug 97); contradictory "no products" banner (Bug 98); calc not server-side (Bug 86).',
    rows: [
      // ---- FRAMEWORK SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'minor',
        fe:'HTML 5 tabs', be:'BRD standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. Build ADDS Details tab; "Task Log"→"Log Book". All present + switch fine. (Summary appears after first save.)' },
      { t:'Shell', s:'Header', e:'Entrepreneur chip "Auto-fetched from profile" + product filter chips', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound; product chips filter', be:'per-EP record', n:'' },

      // ---- SUMMARY TAB ----
      { t:'Summary', s:'Material-wise Overview', e:'Overview table — 10 cols (Product, Raw Material, Source, Availability, Essential, Price/Unit, Intervention Type, Implementation Status, New Price/Unit, Saving)', ty:'table', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'auto-populated from Existing + Required', be:'each row feeds Unit Pricing individually', n:'Verified: shows the filled material (PRD-2026-00010 / RAW-MAT row).' },
      { t:'Summary', s:'Aggregates', e:'Cards: Materials, Cost, Interventions, Status (Total Logged, Essential, Difficult, Monthly Spend, etc.)', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'auto-computed counts', be:'derived', n:'Present; deep value cross-checks spot-only.' },
      { t:'Summary', s:'Intervention Flags', e:'4 flag cards: Alt Source Needed, Alt Material Needed, Difficult Availability, Essential Materials', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'count tiles', be:'derived', n:'Present.' },

      // ---- EXISTING TAB ----
      { t:'Existing', s:'Products banner', e:'"This entrepreneur has no products yet — Create products first" warning', ty:'display', w:'Existing tab', p:'Y', v:'N', fn:'-', sev:'minor', fe:'should only show with zero products', be:'', n:'Bug 98: banner shows despite 3 product chips present (contradictory/stale).' },
      { t:'Existing', s:'List', e:'"+ Add Raw Material" → adds collapsible material block', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds block', be:'raw_material_existing child table', n:'Verified.' },
      { t:'Existing', s:'Material block', e:'Collapsible block (Product/Raw Material header), chevron, Remove', ty:'control', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'collapse/remove', be:'per-material grouping', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Product Name * (product picker)', ty:'picker', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'mandatory; wireframe was free text — build uses a product link picker (improvement)', be:'links to Product', n:'Verified: picker lists EP products.' },
      { t:'Existing', s:'I. Material Identity', e:'Product SKU', ty:'text', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe has Product SKU field', be:'', n:'Bug 96: MISSING on portal.' },
      { t:'Existing', s:'I. Material Identity', e:'Current Status of Use * (Yes/No)', ty:'select', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'mandatory', be:'required', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Name of Raw Material * (raw-material picker)', ty:'picker', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'mandatory; wireframe free text — build uses a raw-material master picker', be:'links to raw material master', n:'Verified: picker (Orange (Raw)/RAW-MAT-000065).' },
      { t:'Existing', s:'I. Material Identity', e:'Is It Essential? * (Yes/No)', ty:'select', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'mandatory; drives Essential count', be:'required', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Availability (Easy/Moderate/Difficult)', ty:'select', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'3 options', be:'difficult flag', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procurement Frequency (Daily/Weekly/Monthly/Seasonal)', ty:'select', w:'block', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'4 options', be:'', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procured Season Time', ty:'text', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe has free-text season window (e.g. Oct–Mar)', be:'', n:'Bug 97: MISSING on portal.' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procurement Source (Market/Wholesaler/Middleman/Farm/Forest/Online/Others)', ty:'select', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'7 options', be:'source classification', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Source Name / Location / Contact', ty:'text', w:'block', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'free text', be:'', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Unit *, Monthly Requirement, Quantity Required Per Batch *, Price Per Unit *, Batch Size *, Transport Cost Per Trip', ty:'fields', w:'block', p:'Y', v:'-', fn:'Y', sev:'', fe:'feed calc', be:'required', n:'Verified all present + accept input.' },
      { t:'Existing', s:'II. Calculated', e:'Auto-calc: Amount/Batch, RM Qty/Unit, RM Cost/Unit, Transport/Unit + Calc Summary + TOTAL LANDED COST/UNIT', ty:'calc', w:'block (read-only)', p:'Y', v:'Y', fn:'Y', sev:'serious', fe:'live calc', be:'landed cost/unit; feeds Unit Pricing — but NOT computed server-side', n:'Verified live: 50×30=₹1,500, /100 ⇒ RM ₹15, transport ₹2, TOTAL ₹17. Persists on UI-driven save. BUT Bug 86: no server-side recompute → API/mobile/untouched saves store ₹0.' },
      { t:'Existing', s:'III. Intervention Need', e:'Toggle "Alternate procurement source needed?" + Justify (skip-logic → Required §I)', ty:'toggle+text', w:'block', p:'Y', v:'-', fn:'Y', sev:'', fe:'ON → creates Required §I row w/ Product/Material/Justification', be:'bridge to Required', n:'VERIFIED end-to-end: toggle → "↻ Flagged → Details in Required tab" → row appeared in Required §I (PRD-2026-00010 / RAW-MAT-000065).' },
      { t:'Existing', s:'III. Intervention Need', e:'Toggle "Alternate raw material needed?" + Justify (skip-logic → Required §II)', ty:'toggle+text', w:'block', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'ON → creates Required §II row', be:'bridge to Required', n:'Toggle present (same mechanism as source toggle, verified).' },
      { t:'Existing', s:'Totals', e:'Total bar: Material Count, Essential, Total Monthly Spend, Total RM Cost/Unit, "Auto-fetches to Existing Unit Pricing → Raw Materials"', ty:'calc', w:'Existing tab footer', p:'Y', v:'?', fn:'-', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Bar present; the Unit Pricing cross-feed to verify when driving Unit Pricing.' },

      // ---- REQUIRED TAB ----
      { t:'Required', s:'I. Alternate Procurement Sources', e:'Auto-populated list (from Existing flag) + add row; empty-state when none', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows arrive via flag OR manual', be:'alternate-source child table', n:'VERIFIED: flagging "Alt procurement source" in Existing created a §I row (PRD-2026-00010 / RAW-MAT-000065 / ↻ Alternate Source). Skip-logic bridge works.' },
      { t:'Required', s:'I. Alt Source row', e:'Fields: Product/Current RM/Justification (bridge RO), New Source Type, Name, Location, Contact, New Price/Unit, Old Price/Unit, Expected Saving (auto), Notes, Implementation Status', ty:'row', w:'Required §I', p:'Y', v:'?', fn:'?', sev:'minor', fe:'saving auto = Old−New', be:'persists per row', n:'Row present with bridged Product/RM; per-field fill + saving calc to spot-check.' },
      { t:'Required', s:'II. Alternate Raw Materials', e:'Auto-populated list + add row', ty:'section', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'rows via flag OR manual', be:'alternate-material child table', n:'Section present (header II. Alternate Raw Materials).' },
      { t:'Required', s:'III. New Raw Material', e:'SECTION III "New Raw Material" + "+ Add New Raw Material" (standalone, always-on)', ty:'section', w:'Required tab', p:'N', v:'N', fn:'N', sev:'serious', fe:'standalone new raw materials NOT linked to an existing one — add freely', be:'new-material child table; feeds Optimised Unit Pricing', n:'Bug 95 (HEADLINE): CONFIRMED ABSENT on portal — Required has only §I & §II. No "+ Add New Raw Material". The original trigger for this audit.' },
      { t:'Required', s:'III. New Material row + status', e:'Full new-material entry (Name, Source, cost inputs, Essential, Reason) + Implementation Status', ty:'row', w:'Required §III', p:'N', v:'N', fn:'N', sev:'serious', fe:'full entry', be:'persists; feeds Optimised Unit Pricing', n:'Bug 95: absent (Section III missing).' },
      { t:'Required', s:'Totals (Optimised View)', e:'Total bar: Alternate Sources, Alternate Materials, New Raw Materials, Status Completed, "Auto-fetches to Optimised Unit Pricing"', ty:'calc', w:'Required tab footer', p:'Y', v:'N', fn:'-', sev:'minor', fe:'roll-up incl. New Raw Materials count', be:'CROSS-FRAMEWORK feed to Optimised Unit Pricing', n:'Bar present (Alternate Sources/Materials counts) but "New Raw Materials" count OMITTED — consistent with Bug 95.' },

      // ---- RESOURCES TAB ----
      { t:'Resources', s:'Reference Materials', e:'Table: Resource Title, Category, Type, Description/Notes, File (Upload+View), delete, "+ Add Resource"', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table + file attach', n:'Tab present; CRUD not yet driven — to verify.' },

      // ---- LOG BOOK TAB (wireframe "Task Log") ----
      { t:'Log Book', s:'Activities', e:'Log table + "+ Add Row" (wireframe Task Log: No., Date, Task Name (16 preset), Notes/Outcome, Attachment)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task dropdown + date + notes', be:'log child table', n:'Tab present; build likely mirrors Financials Log Book (Date/Hours/Task/Activity Type/Comments, no attachment — cf Bug 94). Drive + confirm attachment-missing applies here too.' }
    ]
  },

  /* ============================================================
   * FINANCIALS  (Accounts module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal path: Diagnostics > Accounts > Financial Bookkeeping (DF Financials)
   * Wireframe: from-client/financials_module.html (2533 lines, fully read)
   * Driven end-to-end as Core Team IT on FIN-EP-00026-00001 (fixture EP-00026).
   * Verdict legend: p=present, v=shows values/options, fn=clickable/functional.
   * ============================================================ */
  'financials_module.html': {
    framework: 'Financials',
    module: 'Accounts',
    portalPath: 'Diagnostics › Accounts › Financial Bookkeeping  (DF Financials)',
    checkedOn: '20-Jun-2026 (CT-IT, FIN-EP-00026-00001)',
    status: 'done',
    note: 'Largely faithful to the wireframe — every tab present and the cross-tab data flow (Financial Assessment Pre + Growth Post → Summary trajectory; BMC → Summary break-even) works. Build ADDS a Details tab + Resources tab + Hours/Activity-Type on the log (enhancements). Gaps are modest: no Revenue Evidence attachment, Log Book has no per-row attachment, Investment Source option-set diverges, and 3 functional bugs (89/90/91).',
    rows: [
      // ---- SHELL / TABS ----
      { t:'Shell', s:'Tabs', e:'Tab bar', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'minor',
        fe:'Wireframe: Summary | Financial Assessment | Growth | Business Model Calculator | Task Log', be:'BRD standard pattern', n:'Build has Summary | Details | Financial Assessment | Growth | Business Model Calculator | Resources | Log Book. Build ADDS Details + Resources tabs; "Task Log"→"Log Book" rename. All present + switch fine.' },
      { t:'Shell', s:'Header', e:'Entrepreneur chip "Auto-fetched from profile" + Save/Back', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'' },

      // ---- SUMMARY TAB (all verified rendering with live cross-tab data) ----
      { t:'Summary', s:'KPI tiles', e:'4 KPIs: Total Investment, Avg Monthly Revenue, Avg Net Profit/Month, Profit Margin', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'auto-computed', be:'roll-up from Growth + Financial Assessment', n:'Verified ₹1,50,000 / ₹38,500 / ₹15,500 / 40% — correct.' },
      { t:'Summary', s:'Investment & Loans', e:'Investment breakdown bar list + Loans table (Source/Sanctioned/Outstanding/EMI)', ty:'table', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'from Financial Assessment', be:'derived', n:'Self-funded ₹50k + Bank Loan ₹1L bars; loan row ₹1L/₹80k/₹4,707.' },
      { t:'Summary', s:'Revenue & Income', e:'6 fields: Avg Monthly Business Revenue, Avg Monthly Expenditure, Average Additional Income, Avg Overall Monthly Revenue, Avg Net Profit/Month, Business Status', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'per-month averages', be:'derived', n:'' },
      { t:'Summary', s:'Trend chart', e:'Monthly Revenue & Profit Trend (SVG bar chart, Revenue + Profit)', ty:'chart', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'updates live from Growth edits', be:'from Growth monthly rows', n:'Renders (Apr bar shown). Only 1 month on file in fixture.' },
      { t:'Summary', s:'Bookkeeping Growth Trajectory', e:'3 cards Pre→Post: Practices Bookkeeping, Bookkeeping Level, Maintenance Frequency + delta badges', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'Pre from Financial Assessment, Post from Growth', be:'cross-tab', n:'VERIFIED cross-tab: Yes→Yes, Level 2→4 "+2 levels", Occasionally→Monthly "Improved by 2 steps". Excellent.' },
      { t:'Summary', s:'Monthly Break-even', e:'2 cards: Break-even Revenue, Break-even Units (from BMC Projected)', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'auto-fetched from Calculator', be:'from BMC', n:'VERIFIED ₹11,000 / 33 units, matches BMC.' },

      // ---- DETAILS TAB (build addition; wireframe had this as a card in Financial Assessment) ----
      { t:'Details', s:'Details', e:'Enterprenur Name, Module, Applicable To, Lifecycle (+ build adds Pre/Post Intervention Notes)', ty:'fields', w:'Details tab (build) / FA card (wireframe)', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'wireframe: 4 read fields in a Details card', be:'EP context', n:'Build adds Pre/Post Intervention Notes (enhancement). NB Lifecycle: set "New" but displayed "Pending Update" — likely auto-managed, to confirm.' },

      // ---- FINANCIAL ASSESSMENT TAB ----
      { t:'Financial Assessment', s:'I. Investment Sources', e:'Table + "+ Add Investment Source"; cols #, Investment Source, Other Source Name, Source Name, Amount, delete; Total foot', ty:'table', w:'FA › Section I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'add/remove rows; total sums', be:'investment_sources child table; total_investment_sources', n:'Verified: 2 rows persisted, total ₹1.5L server-side.' },
      { t:'Financial Assessment', s:'I. Investment Sources', e:'Investment Source dropdown OPTIONS', ty:'select', w:'FA › Section I', p:'Y', v:'N', fn:'Y', sev:'minor', fe:'Wireframe options: Self-funded, Family/Friends, Friends, Bank Loan, Government Scheme, NGO, Other', be:'BRD master', n:'DIVERGENCE → Bug 92: portal = Self-funded, Family/Friends, Angel, VC, Bank Loan, Govt Grants, PMEGP, Other. Wireframe "Friends", "Government Scheme", "NGO" MISSING; portal adds Angel/VC. Reconcile vs BRD.' },
      { t:'Financial Assessment', s:'I. Investment Sources', e:'Running total updates live as rows added', ty:'calc', w:'FA › Section I', p:'Y', v:'N', fn:'N', sev:'minor', fe:'total should sum all rows live', be:'correct on save', n:'Bug 89: total ignored 2nd row until save (showed ₹50k for ₹50k+₹1L).' },
      { t:'Financial Assessment', s:'I. Loan Details', e:'Table + "+ Add Loan"; cols #, Loan Amount, Interest %, Outstanding, Term, Start, End, EMI, Loan %, Loan/Scheme', ty:'table', w:'FA › Section I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'add/remove; feeds BMC Existing Loan 1/2', be:'loan_details child table', n:'Verified: 1 loan persisted incl. dates + contribution %.' },
      { t:'Financial Assessment', s:'I. Revenue & Expenditure', e:'Inputs: Avg Monthly Business Revenue, Avg Monthly Expenditure, Avg Additional Income; calc: Net Profit, Overall Revenue, Profit Margin; Business Status', ty:'fields+calc', w:'FA › Section I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'calc live', be:'feeds BMC + Summary', n:'Verified calc: Net ₹15,500, Overall ₹38,500, Margin 40% — correct & live.' },
      { t:'Financial Assessment', s:'I. Revenue & Expenditure', e:'Additional Income Source (text)', ty:'text', w:'FA › Section I', p:'Y', v:'-', fn:'N', sev:'serious', fe:'qualifies the Additional Income amount', be:'persist on save', n:'Bug 90: does NOT persist on save (silent data loss); also cleared by Business Status re-render.' },
      { t:'Financial Assessment', s:'I. Revenue & Expenditure', e:'Revenue Evidence (file attachment)', ty:'upload', w:'FA › Section I', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe shows an attached file (📎 revenue-*.pdf)', be:'attach proof of revenue', n:'Bug 93: portal shows "— none" with NO upload control (0 file inputs on tab) — cannot attach revenue evidence.' },
      { t:'Financial Assessment', s:'II. Bookkeeping Practice', e:'Q1 Practices? (Yes/No), Q2 Level (1–5), Q3 Frequency (Daily…Occasionally)', ty:'select', w:'FA › Section II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'3 selects; feed Summary Pre trajectory', be:'persist', n:'Verified persisted (Yes / Level 2 / Occasionally).' },
      { t:'Financial Assessment', s:'II. Intervention Need', e:'Toggle "Does the entrepreneur need Intervention in bookkeeping?" + Justify textarea (skip-logic reveal)', ty:'toggle+text', w:'FA › Section II', p:'Y', v:'-', fn:'?', sev:'minor', fe:'toggle reveals justify textarea', be:'bk_intervention_needed + reason', n:'Present; toggle/justify reveal not yet driven — to verify.' },

      // ---- GROWTH TAB ----
      { t:'Growth', s:'I. Monthly Tracker', e:'Monthly Performance table (#, Reporting Month, Revenue, Expenses, Profit, Evidence) + "+ Add Month"; Totals foot', ty:'table', w:'Growth › Section I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'add months; profit auto; totals', be:'financials_monthly child table', n:'Verified: row persists, profit 16000 server-computed. NB monthly date must fall in cohort window (rejected otherwise — fixed the bad cohort).' },
      { t:'Growth', s:'I. Monthly Tracker', e:'3 teal stats: Average Revenue, Average Expenditure, Average Profit', ty:'metrics', w:'Growth › Section I', p:'Y', v:'Y', fn:'-', sev:'', fe:'mean across months', be:'derived', n:'' },
      { t:'Growth', s:'II. Implementation Status', e:'Bookkeeping Post-Intervention Q1/Q2/Q3 (feed Summary Post trajectory)', ty:'select', w:'Growth › Section II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'3 selects', be:'bk_*_post; feed Summary', n:'Verified persisted (Yes / Level 4 / Monthly).' },

      // ---- BUSINESS MODEL CALCULATOR TAB ----
      { t:'BMC', s:'Legend', e:'Auto-fetched / Input / Auto-calculated legend', ty:'display', w:'BMC top', p:'Y', v:'-', fn:'-', sev:'', fe:'colour key', be:'', n:'' },
      { t:'BMC', s:'I. Loan Terms', e:'Loans table: Existing Loan 1 & 2 (auto from FA) + New Loan (manual); Amount/Interest/Instalments/Contribution + Add-to-Total checkbox; Total Loan Amount', ty:'table', w:'BMC › Section I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'auto-fetch loans; checkbox-conditioned total', be:'bmc_* loan fields', n:'Verified: Existing Loan 1 auto-fetched ₹1L/12%/24mo; Total ₹1L; checkbox works.' },
      { t:'BMC', s:'II. Revenue & Expense', e:'Total Quantity (pre/post), Weighted Avg Selling Price (calc), Avg Revenue/month (pre/post), Avg Expense/month (pre/post)', ty:'fields+calc', w:'BMC › Section II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'pre auto-fetch + editable; post manual; price auto', be:'persist + calc', n:'Verified: Weighted Avg Selling Price Existing ₹365 (=36500/100), Projected ₹333.33 (=50000/150).' },
      { t:'BMC', s:'III. Monthly Break-even', e:'Output table (8 rows: Operating Profit, EMI, Net Profit, Variable cost/unit, Contribution/unit, Monthly fixed costs, Revenue BE, Unit BE) — Existing/Projected + Comment', ty:'calc', w:'BMC › Section III', p:'Y', v:'Y', fn:'-', sev:'', fe:'all auto-calculated', be:'bmc breakeven fields', n:'Verified stored: existing 35u/₹12,775, projected 33u/₹11,000.' },
      { t:'BMC', s:'IV. Capital Costs', e:'Capital card: Total Capital Cost, Loan Amount Taken, Interest Rate (blended), No. of Instalments (blended), EMI/month, Total Loan Repayment', ty:'calc', w:'BMC › Section IV', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'amortisation EMI', be:'bmc_blended_emi etc.', n:'Blended EMI 4707 stored; full card render to spot-check visually.' },
      { t:'BMC', s:'Result hero + status + help', e:'Result hero (BE Revenue + Units), status banner, help card', ty:'display', w:'BMC bottom', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'hero echoes break-even', be:'', n:'Hero present; status banner/help to spot-check.' },

      // ---- RESOURCES TAB (build addition — not in wireframe) ----
      { t:'Resources', s:'Reference Materials', e:'Resources tab (build addition; wireframe has no Resources tab for Financials)', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'n/a (not in wireframe)', be:'BRD standard Resources pattern', n:'Build enhancement; not yet driven — to verify CRUD.' },

      // ---- LOG BOOK TAB (wireframe "Task Log") ----
      { t:'Log Book', s:'Activities', e:'Log table + "+ Add Row"; Task Name dropdown', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe Task Log: No., Date, Task Name (16 preset), Notes/Outcome, Attachment, +Add Entry', be:'log child table', n:'Build cols: Log Date, Hours, Task Name (link to DF Module Step Master = Financials steps), Activity Type, Comments. Verified entry persisted. Build ADDS Hours + Activity Type (enhancement).' },
      { t:'Log Book', s:'Activities', e:'Per-row Attachment (Upload / View / filename)', ty:'upload', w:'Log Book tab', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe Task Log has Upload + View + filename per row', be:'attach evidence to a task entry', n:'Bug 94: Log Book has NO attachment column/control — cannot attach evidence to a financials log entry.' },

      // ---- CROSS-CUTTING ----
      { t:'Cross-cutting', s:'Overview framework %', e:'Entrepreneur Overview "Diagnostic Framework Status" Financials % rises with Log Book activity', ty:'metric', w:'EP Overview', p:'Y', v:'N', fn:'N', sev:'minor', fe:'% should rise as activities logged', be:'progress recompute', n:'Bug 91: stays 0% after full framework fill + complete Log Book entry. Confirm exact %-driver with dev/BRD.' }
    ]
  },

  /* ============================================================
   * MACHINERY  (Manufacturing module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Manufacturing > Machinery (DF Machinery)
   * Wireframe: from-client/machinery_module.html (1364 lines, fully parsed)
   * Driven as CT-IT on MACH-EP-00026-00001 (fixture EP-00026).
   * ============================================================ */
  'machinery_module.html': {
    framework: 'Machinery',
    module: 'Manufacturing',
    portalPath: 'Diagnostics › Manufacturing › Machinery  (DF Machinery)',
    checkedOn: '20-Jun-2026 (CT-IT, MACH-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging. KEY: the portal uses STRAIGHT-LINE depreciation with Salvage + Useful Life (BRD model) — NOT the wireframe\'s condition-based model. Old "no salvage" finding is RESOLVED. Straight-line calc verified correct (Dep ₹375/mo, Dep/Unit ₹0.23). Skip-logic flag toggles present (Solarization/Servicing/Capacity Upgrade). Gaps filed: 99 (dep-model divergence + Machinery Condition absent), 100 (mandatory Name not enforced), 101 (Product + Reference fields missing).',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'5 tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book (adds Details; Task Log→Log Book). Summary appears after save.' },
      // SUMMARY
      { t:'Summary', s:'Overview + Aggregates + Flags', e:'Machine-wise Overview table, Aggregates, Intervention Flags', ty:'table+metrics', w:'Summary tab', p:'Y', v:'?', fn:'-', sev:'minor', fe:'auto-populated', be:'derived', n:'Tab present; deep value cross-check deferred (filled 1 machine).' },
      // EXISTING — block fields
      { t:'Existing', s:'List', e:'"+ Add Machine" → collapsible machine block; Existing totals bar', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'add block', be:'machine child table', n:'Verified.' },
      { t:'Existing', s:'I. Classification', e:'Name of Machinery/Tool * (machine-master picker), Process Flow No., Purpose, Critical/Non-Critical', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe Name was free text; build uses a picker', be:'links to machine master', n:'Picker verified (MACH-00009). Name is mandatory but NOT enforced → Bug 100.' },
      { t:'Existing', s:'I. Classification', e:'Product (link the machine to a product)', ty:'picker', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe Classification has a Product field', be:'', n:'Bug 101: no per-machine Product field on portal (confirm vs BRD — machine may serve many products).' },
      { t:'Existing', s:'I. Classification', e:'If Critical, provide reason', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'conditional on Critical', be:'', n:'Likely a conditional reveal (only when Critical chosen) — to verify, not yet driven.' },
      { t:'Existing', s:'II. Technical & Power', e:'Power/Phase Needed, No. of Machinery/Tool *, Wattage/Load (W), Total Power Load (calc), Main Usage Time', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'specs', be:'', n:'Total Power Load = build addition. Present.' },
      { t:'Existing', s:'III. Operational Capacity', e:'Days/Month, Hours/Day, Current Capacity/hr, Max Capacity/hr → Monthly Output, Capacity Utilization, Capacity Gap', ty:'fields+calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'output = days×hrs×cap', be:'derived', n:'Verified: 20×8×10 = 1,600/mo; Utilization 66.7% (10/15); persists.' },
      { t:'Existing', s:'IV. Financial & Maintenance', e:'Cost of Machine *, Salvage/Residual Value, Brand/Series, Age, Useful Life, Remaining Life (calc), Servicing Required, Monthly Upkeep', ty:'fields+calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'BRD straight-line inputs', be:'persist', n:'Build ADDS Salvage + Useful Life + Remaining Life (BRD). Remaining Life 8.0 verified.' },
      { t:'Existing', s:'IV. Depreciation', e:'Depreciation Rate, Monthly Depreciation, Depreciation/Unit', ty:'calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'WIREFRAME: condition-based (Good/Fair/Poor 10/20/30%); PORTAL: straight-line (cost−salvage)/life', be:'BRD: straight-line', n:'Bug 99: MODEL DIVERGENCE. Portal straight-line verified correct (9%/yr, ₹375/mo, ₹0.23/unit) + matches BRD; old "no salvage" RESOLVED. Wireframe "Machinery Condition" field absent.' },
      { t:'Existing', s:'IV. Machinery Condition', e:'Machinery Condition (Good/Fair/Poor) — wireframe depreciation driver', ty:'select', w:'block', p:'N', v:'N', fn:'-', sev:'minor', fe:'wireframe field', be:'replaced by straight-line model', n:'Bug 99: absent on portal (portal uses straight-line instead).' },
      { t:'Existing', s:'IV. Reference', e:'Reference (current cost / condition)', ty:'text', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe field', be:'', n:'Bug 101: missing on portal.' },
      { t:'Existing', s:'V. Intervention Need', e:'Flag toggles: Solarization Needed?, Servicing Intervention Needed?, Capacity Upgrade Needed? (bridge to Required)', ty:'toggle', w:'block', p:'Y', v:'-', fn:'?', sev:'minor', fe:'wireframe had inline Intervention Details (Issue/Description, Intervention Cost, New Electricity Cost); portal uses flag toggles → Required', be:'bridge to Required', n:'Toggles present (model differs from wireframe inline fields). Bridge + detail fields to verify in Required (cf RM bridge works).' },
      { t:'Existing', s:'Totals', e:'All Existing Machines — Total: Machine Count, Total Investment, Total Depreciation/Unit, "Auto-fetches to Existing Unit Pricing → Machinery Depreciation/Unit"', ty:'calc', w:'Existing footer', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Present (Machine Count 1, Total Investment ₹50k).' },
      // REQUIRED / RESOURCES / LOG BOOK
      { t:'Required', s:'Required tab', e:'New Machinery (+ Add New Machine), intervention rows bridged from Existing flags, Optimised totals', ty:'section', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'New Machine block + bridged intervention rows', be:'feeds Optimised Unit Pricing', n:'Tab present; not yet driven — verify New Machine entry + bridged intervention-detail fields (Issue/Description, Intervention Cost, New Electricity Cost) land here.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task dropdown + date + notes', be:'log child table', n:'Tab present; likely mirrors Financials Log Book (no attachment, cf Bug 94) — to verify.' }
    ]
  },

  /* ============================================================
   * HUMAN RESOURCE  (Manufacturing module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Manufacturing > Human Resource (DF Human Resource)
   * Wireframe: from-client/human_resource_module.html (1543 lines, parsed)
   * Driven as CT-IT on HR-EP-00026-00001 (fixture EP-00026).
   * ============================================================ */
  'human_resource_module.html': {
    framework: 'Human Resource',
    module: 'Manufacturing',
    portalPath: 'Diagnostics › Manufacturing › Human Resource  (DF Human Resource)',
    checkedOn: '20-Jun-2026 (CT-IT, HR-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging. Monthly Labour Cost calc verified (₹39,000 = 3×₹500×26). GoM compliance LOGIC works when a threshold is supplied (wage 400 vs min 480 → "✗ No" + warning), BUT the GoM minimum wage is NOT auto-derived from Skill Level → stored 0 → saved gom_compliant = trivially TRUE (Bug 102, P2, safeguard defeated). "Avg Hours/Day" input missing → labour rate assumes 8h (Bug 103).',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'5 tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book (adds Details; Task Log→Log Book).' },
      { t:'Summary', s:'Overview + Aggregates + Flags', e:'Worker-wise Overview, Aggregates (incl GoM Compliant/Non-Compliant), Intervention Flags', ty:'table+metrics', w:'Summary tab', p:'Y', v:'?', fn:'-', sev:'minor', fe:'auto-populated', be:'derived', n:'Tab present; deep cross-check deferred.' },
      { t:'Existing', s:'List', e:'"+ Add Worker Category" → collapsible worker block; Existing totals bar', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'add block', be:'worker child table', n:'Verified.' },
      { t:'Existing', s:'Worker fields', e:'Worker Category * (Self/Unpaid Family/Paid Family/Hired), Skill Level * (4), Employment Nature * (5), No. of Male, No. of Female, Total Workers (auto)', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'all present', be:'persist', n:'Verified: Total Workers auto = 3 (2M+1F).' },
      { t:'Existing', s:'Wage', e:'Wage Type * (Per Day/Per Month/Per Hour), Wage Rate *, Avg Working Days / Month', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'feed labour cost', be:'persist', n:'Verified.' },
      { t:'Existing', s:'Avg Hours / Day', e:'Avg Hours / Day input', ty:'number', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe has Avg Hours/Day', be:'avg_hours_per_day field exists (default 8)', n:'Bug 103: input MISSING from UI; labour rate/hr assumes fixed 8h.' },
      { t:'Existing', s:'Calc — Labour Cost', e:'Monthly Labour Cost, Labour Rate / hr', ty:'calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'PerDay: wage×days×count', be:'persist', n:'Verified: ₹39,000 = 3×₹500×26; Rate/hr ₹50 (assumes 8h, see Bug 103).' },
      { t:'Existing', s:'GoM Minimum Wage', e:'GoM Minimum Wage (threshold by Skill Level)', ty:'number', w:'block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'wireframe AUTO-derives from skill (Unskilled360/Semi410/Skilled480/Highly550)', be:'should auto-set + persist', n:'Bug 102: manual field, NOT auto-derived from skill; stays 0; manual entry did not persist (stored 0).' },
      { t:'Existing', s:'GoM Compliant?', e:'GoM Compliant? verdict + below-minimum warning', ty:'calc', w:'block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'flag non-compliant when wage < GoM min for skill', be:'persist real verdict', n:'Bug 102: logic works WHEN threshold supplied (400 vs 480 → "✗ No" + warning), but with auto-threshold 0 the saved gom_compliant = TRUE trivially → false compliant. Safeguard defeated.' },
      { t:'Existing', s:'V. Intervention Need', e:'"Labour intervention needed?" toggle (bridge to Required)', ty:'toggle', w:'block', p:'Y', v:'-', fn:'?', sev:'minor', fe:'flag → Required bridge', be:'bridge', n:'Toggle present; bridge to verify (cf RM bridge works).' },
      { t:'Existing', s:'Totals', e:'All Existing — Total: Worker count, Monthly Labour Cost, GoM Compliant (x/y), "Auto-fetches to Existing Unit Pricing"', ty:'calc', w:'Existing footer', p:'Y', v:'?', fn:'-', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Bar present.' },
      { t:'Required', s:'Required tab', e:'New Labour Category (+ Add), Labour Intervention rows (bridged), Optimised totals', ty:'section', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'new category + intervention rows', be:'feeds Optimised Unit Pricing', n:'Tab present; not yet driven.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task dropdown + date + notes', be:'log child table', n:'Tab present; likely mirrors Financials Log Book (no attachment) — to verify.' }
    ]
  },

  /* ============================================================
   * INFRASTRUCTURE  (Infrastructure module)  — BLOCKED 20-Jun-2026
   * Portal: Diagnostics > Infrastructure (DF Infrastructure)
   * Wireframe: from-client/infrastructure_module.html (2760 lines)
   * ============================================================ */
  'infrastructure_module.html': {
    framework: 'Infrastructure',
    module: 'Infrastructure',
    portalPath: 'Diagnostics › Infrastructure  (DF Infrastructure)',
    checkedOn: '20-Jun-2026 — ACCESSIBLE (re-QA pending); correct doctype = DF Infrastructure BE EE CE',
    status: 'verifying',
    note: 'NOT blocked — earlier "blocked" was a TESTER ERROR (wrong doctype name). The real doctype is "DF Infrastructure BE EE CE" (sidebar link /d/DF Infrastructure BE EE CE); CT-IT meta/get_count = 200 (4 records). Bug 104 RETRACTED. Full UI QA pending (re-drive). Wireframe is rich: tabs Summary | Built-Environment | Machines | Solar | Financial Model | Tracker | Task Log | Resources; Financial Model has LIFCOM funding split + LIFCOM EMI Calculator (3yr=÷36, 5yr=÷60 flat) + tranches/vendor payment — re-verify LIFCOM EMI vs prior Bug 83/INFRA-004 when driven.',
    rows: [
      { t:'Shell', s:'Access', e:'Open Infrastructure framework as Core Team IT (doctype DF Infrastructure BE EE CE)', ty:'access', w:'Diagnostics › Infrastructure', p:'Y', v:'Y', fn:'Y', sev:'', fe:'BRD PR-OV-004: CT-IT Full CRUD', be:'role permission allows read meta+list+CRUD', n:'ACCESSIBLE (meta/count 200, 4 records). Bug 104 was a false finding (wrong doctype name) — retracted.' },
      { t:'(pending)', s:'Built-Environment / Machines / Solar / Financial Model / Tracker', e:'Full wireframe comparison (Land/Rent/Water/NOC; LIFCOM funding split + EMI calculator; tranches; vendor payment)', ty:'section', w:'all tabs', p:'?', v:'?', fn:'?', sev:'', fe:'per wireframe', be:'BRD', n:'Re-QA pending (now accessible). Drive end-to-end; re-check LIFCOM EMI vs prior Bug 83.' }
    ]
  },

  /* ============================================================
   * BRANDING IDENTITY  (Marketing Tools module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Marketing Tools > Branding Identity (DF Branding Identity)
   * Wireframe: from-client/branding_identity_module.html (967 lines)
   * Driven as CT-IT on BI-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful to the wireframe — NO bugs. (Designer's landing framework.)
   * ============================================================ */
  'branding_identity_module.html': {
    framework: 'Branding Identity',
    module: 'Marketing Tools',
    portalPath: 'Diagnostics › Marketing Tools › Branding Identity  (DF Branding Identity)',
    checkedOn: '20-Jun-2026 (CT-IT, BI-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful to the wireframe, no bugs found. Brand/Logo/Business Card tabs all present; each has its own "Need New …?" intervention toggle that reveals conditional fields (New Brand Name + Justification, both mandatory) + a per-item DUAL approval (Entrepreneur + Core Team, Pending/Approved/Rejected). Logo & Business-Card QR uploads present (file inputs). Brand data + dual-approval verified persisted. NOTE: this framework nearly produced ~3 FALSE bugs — toggles + conditional reveals were missed by the flat field scan; confirmed present via the toggle + stored data. Build adds a Details tab + "Market Scope" field.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Business Card | Brand | Logo | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Brand | Logo | Business Card | Resources | Log Book. Adds Details; Task Log→Log Book. All present.' },
      { t:'Brand', s:'Brand Identity Data', e:'Storyline, Current Brand Name, Brand Tagline, USP of Brand, Entrepreneur Media Folder Link, Market Scope', ty:'fields', w:'Brand tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'all present + editable', be:'persist', n:'Verified filled + persisted (Dakini Naturals / Taste of the Garo Hills). "Market Scope" = build addition.' },
      { t:'Brand', s:'Intervention Need', e:'"Need New Brand Name?" toggle → reveals "New Brand Name (if advised) *" + "Justification *"', ty:'toggle', w:'Brand tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'skip-logic conditional reveal', be:'need_new_brand', n:'VERIFIED: toggle ON reveals both mandatory conditional fields ("↻ Flagged — capture the proposed name + justification").' },
      { t:'Brand', s:'Approvals', e:'Dual approval: Entrepreneur Approval + Core Team Approval (Pending/Approved/Rejected)', ty:'select', w:'Brand tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dual approval', be:'brand_entrepreneur_approval + brand_core_team_approval', n:'VERIFIED: set both Approved, persisted.' },
      { t:'Logo', s:'Logo', e:'"Need New Logo?" toggle, Existing Logo, logo upload (file inputs), dual approval', ty:'fields+upload', w:'Logo tab', p:'Y', v:'Y', fn:'?', sev:'', fe:'upload + approval', be:'need_new_logo + logo_*_approval', n:'2 file inputs + Upload button present; logo_entrepreneur/core_team_approval exist (stored Pending). Upload view/replace/delete CRUD not yet driven — to verify.' },
      { t:'Business Card', s:'Card Content', e:'Contact Number, Email, Instagram QR, WhatsApp Catalogue QR, QR uploads, "Need New?" + dual approval', ty:'fields+upload', w:'Business Card tab', p:'Y', v:'Y', fn:'?', sev:'minor', fe:'card fields + QR uploads + approval', be:'need_new_bizcard + bizcard_*_approval', n:'Contact/Email/Instagram QR/WhatsApp QR + 2 file inputs present; bizcard approvals exist (stored). "Profile Link" + "Designer" not confirmed in UI (likely conditional / auto — verify, low priority).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * LABELS  (Marketing Tools module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Marketing Tools > Labels (DF Marketing Label)
   * Wireframe: from-client/labels_module.html (1054 lines)
   * Driven as CT-IT on LBL-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful to the wireframe — NO bugs. Alcohol skip-logic + statutory warning work.
   * ============================================================ */
  'labels_module.html': {
    framework: 'Labels',
    module: 'Marketing Tools',
    portalPath: 'Diagnostics › Marketing Tools › Labels  (DF Marketing Label)',
    checkedOn: '20-Jun-2026 (CT-IT, LBL-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful to the wireframe, no bugs. Existing tab = per-variant rows (Variant/SKU picker + Upload Existing File + "Need New Label?" flag). The rich Label Content lives in the Required tab (Master Content: Product Name/Snapshot/Storyline/Tagline/Ingredients/Benefits/Directions/Manufactured by/Label Type/Product Pictures + Variant Content + Label Status). KEY skip-logic VERIFIED: "Wine / Alcohol Product?" toggle ON → reveals Alcohol Content (ABV) + the statutory warning "CONSUMPTION OF ALCOHOL IS INJURIOUS TO HEALTH / DON\'T DRINK AND DRIVE" (in-form — an improvement over the wireframe). Validation fires (Variant + Justification required). To-verify: full Variant Content fill needs product variants/SKUs (fixture products have none yet) — fixture-completeness, not a portal gap.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. Adds Details; Task Log→Log Book.' },
      { t:'Existing', s:'Existing Label', e:'"+ Add Variant" → per-variant row: Variant (SKU) picker, Upload Existing File, "Need New Label?" toggle', ty:'fields+upload', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'flag new-label need', be:'existing-variant child table', n:'Verified: row adds; SKU picker present (no SKUs because fixture products have no variants). Validation: Variant + Justification required on save.' },
      { t:'Required', s:'Master Content', e:'Product Name, Product Snapshot, Storyline Text, Product Tagline, Ingredients/Material, Benefits, Directions of Use, Manufactured by, Marketed by, Label Type, Product Pictures (upload)', ty:'fields+upload', w:'Required tab', p:'Y', v:'Y', fn:'?', sev:'', fe:'full label content', be:'persist', n:'All present in Required (the new-label design workspace). Per-field fill to spot-check.' },
      { t:'Required', s:'Wine/Alcohol skip-logic', e:'"Wine / Alcohol Product?" toggle → reveals Alcohol Content (ABV) + statutory warning', ty:'toggle', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'conditional reveal + fixed statutory warning', be:'', n:'VERIFIED: toggle ON reveals ABV + "CONSUMPTION OF ALCOHOL IS INJURIOUS TO HEALTH / DON\'T DRINK AND DRIVE" (in-form, improvement vs wireframe). Matches FW-LBL-001.' },
      { t:'Required', s:'Variant Content + Label Status', e:'Variant Content (+ Add Variant), Label Status (Designer assignment / status)', ty:'section', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'per-variant label content', be:'persist', n:'Sections present; full Variant Content fill needs product variants/SKUs (fixture lacks them) — to verify once a product has variants.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * BROCHURE  (Marketing Tools module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Marketing Tools > Brochure (DF Marketing Brochure)
   * Wireframe: from-client/brochures_module.html (939 lines)
   * Driven as CT-IT on MBR-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful (+richer) — NO bugs. Completes the Marketing Tools module.
   * ============================================================ */
  'brochures_module.html': {
    framework: 'Brochure',
    module: 'Marketing Tools',
    portalPath: 'Diagnostics › Marketing Tools › Brochure  (DF Marketing Brochure)',
    checkedOn: '20-Jun-2026 (CT-IT, MBR-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful to the wireframe, no bugs. Content (Brochure Setup + Status) lives in the Required tab. Brochure Setup: Title, Type (Single Product/Multi-Product Catalogue/Tri-fold/Bi-fold/Single-page Flyer), Tagline, About/Storyline (AI-assisted), Contact/Email/Address, Market Scope, Product Listings (+ Add Product, product picker works). Brochure Status: Assigned Designer (read-only for FA), Print Format (A4/A5/DL/Custom), Page Count, Draft upload, Status workflow. All filled + persisted (incl. 1 product listing). Build is RICHER than the wireframe: supports a 3-draft review cycle (draft_1/2/3_status, each Pending → Under Review → Redo → Approved).',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book.' },
      { t:'Existing', s:'Existing Brochure', e:'Upload Existing File + "Need New" flag (per the wireframe Existing tab)', ty:'fields+upload', w:'Existing tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'flag new-brochure need', be:'existing child table', n:'Existing tab present (upload + flag); deep fill deferred — content is in Required.' },
      { t:'Required', s:'Brochure Setup', e:'Title, Brochure Type, Tagline/Headline, About/Storyline (AI), Contact, Email, Address, Market Scope', ty:'fields', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'all content fields', be:'persist', n:'VERIFIED filled + persisted (Title, Type=Multi-Product Catalogue, Tagline, Storyline, Contact/Email/Address).' },
      { t:'Required', s:'Product Listings', e:'"+ Add Product" → product-listing rows (product picker)', ty:'table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'add product listings', be:'products child table', n:'VERIFIED: added Orange Jam; products child table = 1, persisted.' },
      { t:'Required', s:'Brochure Status', e:'Assigned Designer (RO for FA), Print Format (A4/A5/DL/Custom), Page Count, Draft upload, Status workflow', ty:'fields+upload', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'design review status', be:'draft_*_status', n:'VERIFIED: Status set Under Review, persisted (draft_1_status). Build RICHER: 3-draft cycle (draft_1/2/3, each Pending/Under Review/Redo/Approved).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * MARKET RESEARCH  (Market module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Market > Market Research (DF Market Research)
   * Wireframe: from-client/market_research_module.html (1114 lines)
   * Driven as CT-IT on DF-MR-EP-00026-00001 (fixture EP-00026).
   * RESULT: structurally complete + faithful — NO bugs. (Large research framework; structural + representative-persistence verified, deep per-row fills sampled.)
   * ============================================================ */
  'market_research_module.html': {
    framework: 'Market Research',
    module: 'Market',
    portalPath: 'Diagnostics › Market › Market Research  (DF Market Research)',
    checkedOn: '20-Jun-2026 (CT-IT, DF-MR-EP-00026-00001)',
    status: 'done',
    note: 'Large research framework — structurally complete & faithful, no bugs found. Two data tabs: (1) Market Research = Market Landscape (I.a Product Scope auto-fetched; I.b Global, I.c India, I.d Meghalaya/NE — Market Size USD/INR, CAGR, Key Brands, Key Selling Locations) + II. Channel Research + III. Key Brands Research + IV. Respondent/Consumer Survey (each "+ Add"). (2) Competitive Pricing = Competitor Analysis (Local/State/National) with OFFLINE + ONLINE channel pricing tables + SWOT. Sub-table CRUD verified persisting (added an Offline competitor row → competitors_offline=1 saved). Depth note: structural + representative-persistence verified; the many sub-tables (channels/brands/respondents/online rows/SWOT detail/landscape numerics) are present but not each individually filled — sampled.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Market Research | Competitive Pricing Assessment | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Market Research | Competitive Pricing | Resources | Log Book. NB the breadcrumb "Market Research" link goes to the doctype LIST — distinct from the in-form tab.' },
      { t:'Market Research', s:'I. Market Landscape', e:'I.a Product Scope (auto-fetched), I.b Global (Market Size USD, Key Brands, Key Exporting Countries), I.c India (Market Size INR), I.d Meghalaya/NE (Key Selling Locations, CAGR)', ty:'fields', w:'Market Research tab', p:'Y', v:'Y', fn:'?', sev:'', fe:'market landscape inputs', be:'persist', n:'All sections present; numeric fields not each filled — sampled.' },
      { t:'Market Research', s:'II. Channel Research', e:'Channel rows ("+ Add Channel") — selling channels/platforms', ty:'table', w:'Market Research tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'add channel rows', be:'channels child table', n:'+ Add Channel present; row fill sampled (not driven this pass).' },
      { t:'Market Research', s:'III. Key Brands Research', e:'Brand rows ("+ Add Brand") — competitor brands, USP, etc.', ty:'table', w:'Market Research tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'add brand rows', be:'brands child table', n:'+ Add Brand present.' },
      { t:'Market Research', s:'IV. Respondent / Consumer Survey', e:'Respondent rows ("+ Add Respondent") — Age Group/Gender/Occupation/District/Used product?/Purchase Frequency', ty:'table', w:'Market Research tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'add respondent rows', be:'respondents child table', n:'+ Add Respondent present.' },
      { t:'Competitive Pricing', s:'Competitor Analysis', e:'Local / State / National market sub-sections', ty:'section', w:'Competitive Pricing tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'3 market levels', be:'', n:'Present (I. Local, II. State, III. National).' },
      { t:'Competitive Pricing', s:'Offline + Online channels', e:'OFFLINE CHANNELS + ONLINE CHANNELS pricing tables (Brand/Competitor, Outlet/Channel, Price, etc.); "+ Add Offline Row" / "+ Add Online Row"', ty:'table', w:'Competitive Pricing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'offline + online competitor pricing', be:'competitors_offline / competitors_online child tables', n:'VERIFIED: added + filled an offline row (Naga Pickles / Tura Bazaar Store / ₹180) → competitors_offline=1 persisted.' },
      { t:'Competitive Pricing', s:'SWOT', e:'SWOT analysis (Strength/Weakness/Opportunity/Threat)', ty:'section', w:'Competitive Pricing tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'SWOT', be:'persist', n:'SWOT section present on this tab (was a prior "deferred" item — now confirmed present); detail fill sampled.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * CUSTOMER ANALYSIS  (Market module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Market > Customer Analysis (DF Customer Analysis)
   * Wireframe: from-client/customer_analysis_module.html (973 lines)
   * Driven as CT-IT on CA-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful — NO bugs. Per-product customer segmentation.
   * ============================================================ */
  'customer_analysis_module.html': {
    framework: 'Customer Analysis',
    module: 'Market',
    portalPath: 'Diagnostics › Market › Customer Analysis  (DF Customer Analysis)',
    checkedOn: '20-Jun-2026 (CT-IT, CA-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful, no bugs. Per-product customer segmentation: Existing tab "+ Add Product" reveals the full segmentation block for that product. All wireframe fields present (Age Group, Gender, Income Bracket, Occupation, Location Type, Primary/Secondary Target Segment, Primary Geography, Key Cities, Buying Motivation, Purchase Behaviour, Usage Rate, Loyalty Status, Market Readiness, Values & Lifestyle). Product block persists (existing_product_blocks=1). Required tab = target/aspiring segments. No calc in this framework.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Log Book | Resources.' },
      { t:'Existing', s:'Per-product segmentation', e:'"+ Add Product" → product picker + full customer segmentation block', ty:'fields', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'each product holds its own segmentation', be:'existing_product_blocks child table', n:'VERIFIED: + Add Product reveals all segmentation fields; selected Bamboo Shoot Pickle → existing_product_blocks=1 persisted.' },
      { t:'Existing', s:'Segmentation fields', e:'Age Group, Gender, Income Bracket, Occupation, Location Type, Primary/Secondary Target Segment, Primary Geography, Key Cities, Buying Motivation, Purchase Behaviour, Usage Rate, Loyalty Status, Market Readiness, Values & Lifestyle', ty:'fields', w:'Existing product block', p:'Y', v:'Y', fn:'?', sev:'', fe:'full segmentation per wireframe', be:'persist', n:'All present after adding a product; per-field fill sampled.' },
      { t:'Required', s:'Target segments', e:'Target / aspiring customer segments per product', ty:'section', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'desired segment definition', be:'persist', n:'Tab present; not deep-filled this pass.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * MARKET LINKAGE  (Market module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Market > Market Linkage (DF Market Linkage)
   * Wireframe: from-client/market_linkage_module.html (1056 lines)
   * Driven as CT-IT on ML-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful + calc CORRECT (persists server-side) — NO bugs.
   * ============================================================ */
  'market_linkage_module.html': {
    framework: 'Market Linkage',
    module: 'Market',
    portalPath: 'Diagnostics › Market › Market Linkage  (DF Market Linkage)',
    checkedOn: '20-Jun-2026 (CT-IT, ML-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful, no bugs, and the revenue calc PERSISTS server-side (unlike RM/Financials ₹0 bug). Existing channels table (Channel Name & Type Online/Offline, Location, Price, Avg Units/Month → Avg Revenue/Month, Annual Revenue, Annual Total auto-calc). Required = recommended channels. Sales Tracker tab = monthly collapsible sections, per-SKU-per-channel rows with auto revenue. VERIFIED calc: Price ₹50 × 200 units = Avg Rev/Month ₹10,000 → Annual ₹1,20,000; SAVED + persisted (avg_revenue_per_month=10000, annual_revenue=120000).',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Sales Tracker | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Sales Tracker | Resources | Log Book.' },
      { t:'Existing', s:'Channels', e:'"+ Add Channel" → row: Channel Name & Type (Online/Offline), Location (block), Price, Avg Units/Month → Avg Revenue/Month, Annual Revenue, Annual Total (auto)', ty:'table+calc', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'revenue auto = price×units; annual = ×12', be:'existing_channels child table; calc persists', n:'VERIFIED: 50×200 → Avg ₹10,000, Annual ₹1,20,000; persisted server-side (avg_revenue_per_month=10000, annual_revenue=120000). Calc is correct AND persists (contrast RM/Financials Bug 86).' },
      { t:'Required', s:'Recommended Channels', e:'"+ Add Recommended Channel" → recommended/target channels + implementation status', ty:'table', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'recommended channels', be:'persist', n:'Tab present; not deep-filled this pass.' },
      { t:'Sales Tracker', s:'Monthly sales', e:'Collapsible monthly sections; each row = one SKU via one channel; Price per month; Revenue auto-calc', ty:'table+calc', w:'Sales Tracker tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'per-month per-SKU revenue', be:'tracker child table; Tracker Annual Revenue agg', n:'Tab present (structure per wireframe); deep monthly fill sampled — to verify the per-month revenue roll-up.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * PROMOTIONS  (Market/Marketing module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Marketing > Promotions (DF Promotional Marketing)
   * Wireframe: from-client/promotions_module.html (722 lines)
   * Driven as CT-IT on PRM-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful — NO bugs. (Doctype name is "DF Promotional Marketing".)
   * ============================================================ */
  'promotions_module.html': {
    framework: 'Promotions',
    module: 'Market',
    portalPath: 'Diagnostics › Marketing › Promotions  (DF Promotional Marketing)',
    checkedOn: '20-Jun-2026 (CT-IT, PRM-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful, no bugs. Content/list framework (no calc). Existing tab "+ Add Promotion" → row: Promotion Name, Type (Offline/Online), Handled by, Frequency (Daily/Weekly/Monthly/Yearly), Notes (reach/spend free text). Required = recommended promotions. Row persisted (existing_promotions=1). NB doctype is "DF Promotional Marketing" (non-obvious name; under the Marketing menu group). No cost-per-reach calc (the wireframe "Reach, spend" is a free-text notes field).',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book.' },
      { t:'Existing', s:'Promotions', e:'"+ Add Promotion" → row: Promotion Name, Type (Offline/Online), Handled by, Frequency, Notes', ty:'table', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'list current promotions', be:'existing_promotions child table', n:'VERIFIED filled + persisted (Facebook page posts / Online / Self / Weekly) → existing_promotions=1.' },
      { t:'Required', s:'Recommended Promotions', e:'"+ Add Recommended" → suggested promotions + intervention status', ty:'table', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'recommended promotions', be:'persist', n:'Tab present; not deep-filled this pass.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * PRODUCT PROTOTYPING  (Product Development module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Product Development > Prototyping (DF Product Prototyping)
   * Wireframe: from-client/product_prototyping_module.html (774 lines)
   * Driven as CT-IT on DF-PROTO-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful — NO bugs. Nested Product → Iteration persists.
   * ============================================================ */
  'product_prototyping_module.html': {
    framework: 'Product Prototyping',
    module: 'Product Development',
    portalPath: 'Diagnostics › Product Development › Prototyping  (DF Product Prototyping)',
    checkedOn: '20-Jun-2026 (CT-IT, DF-PROTO-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful, no bugs. Nested: Prototypes tab "+ Add Product" → per-product block (product picker, Prototype Type / Type of Prototyping, Version, Key Learnings, Design Upload, Implementation Status) → "+ Add Iteration" (nested iteration rows). Verified persistence of BOTH levels (prototyping_products=1, prototyping_iterations=1) — resolves prior PROTO-001 "3 levels deep, deferred". Content/nested framework, no calc.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Prototypes | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Prototypes | Resources | Log Book.' },
      { t:'Prototypes', s:'Per-product prototype', e:'"+ Add Product" → product picker, Prototype Type/Type of Prototyping, Version, Key Learnings, Design Upload, Implementation Status', ty:'fields+upload', w:'Prototypes tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'per-product prototype block', be:'prototyping_products child table', n:'VERIFIED: added product (Orange Jam) → prototyping_products=1 persisted. Design Upload present.' },
      { t:'Prototypes', s:'Iterations', e:'"+ Add Iteration" → nested iteration rows (version/notes/uploads per iteration)', ty:'table', w:'Prototypes tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'nested iterations under a prototype', be:'prototyping_iterations child table', n:'VERIFIED: added iteration → prototyping_iterations=1 persisted (nested level works).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * PRODUCT TESTING  (Product Development module)  — VERIFIED ON STAGING 20-Jun-2026
   * Portal: Diagnostics > Product Development > Testing (DF Product Testing)
   * Wireframe: from-client/product_testing_module.html (1039 lines)
   * Driven as CT-IT on PT-EP-00026-00001 (fixture EP-00026).
   * RESULT: faithful — NO bugs. Date-chain validation now WORKS (prior FW-TEST-001 RESOLVED).
   * ============================================================ */
  'product_testing_module.html': {
    framework: 'Product Testing',
    module: 'Product Development',
    portalPath: 'Diagnostics › Product Development › Testing  (DF Product Testing)',
    checkedOn: '20-Jun-2026 (CT-IT, PT-EP-00026-00001)',
    status: 'done',
    note: 'CLEAN — faithful, no bugs. Existing tab "+ Add Test" → test row: Product, Test Type, Purpose, Lab/Lab Name, the 3-date chain (Office deposit → Lab deposit → Result), Consent Letter Signed (+ reason if not), Upload Consent Letter, Testing Report upload, Retesting Flagged, Approved by Core Team, Implementation Status. KEY: the DATE-CHAIN VALIDATION NOW WORKS — out-of-order dates (Lab 05-10 before Office 05-20) were REJECTED on save with a clear message; valid order saved fine. This RESOLVES the prior FW-TEST-001 finding ("date-chain not validated"). Mandatory Product enforced too.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book.' },
      { t:'Existing', s:'Test row', e:'"+ Add Test" → Product, Test Type, Purpose, Lab Name, dates, Consent Letter Signed (+reason), uploads, Retesting Flagged, Approved by Core Team, Implementation Status', ty:'fields+upload', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'full test record', be:'product_testing_existing child table', n:'VERIFIED filled + persisted (Orange Jam / Shillong Food Lab / valid dates) → product_testing_existing=1.' },
      { t:'Existing', s:'Date-chain validation', e:'Office deposit ≤ Lab deposit ≤ Result date', ty:'validation', w:'Existing test row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'reject out-of-order dates', be:'server validation', n:'VERIFIED: out-of-order (Lab 2026-05-10 before Office 2026-05-20) REJECTED — "Date of Sample Deposit to Lab cannot be earlier than Date of Sample Deposit to Office." Prior FW-TEST-001 (date-chain not validated) is RESOLVED.' },
      { t:'Existing', s:'Mandatory + uploads', e:'Product Name mandatory; Consent Letter + Testing Report uploads; Approved by Core Team', ty:'fields+upload', w:'Existing test row', p:'Y', v:'Y', fn:'?', sev:'minor', fe:'mandatory product; file uploads; core approval', be:'persist', n:'Mandatory Product enforced (blocked save). Upload CRUD + consent-conditional reason sampled — to verify.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'dropdowns + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify (attachment cf Bug 94).' }
    ]
  },

  /* ============================================================
   * STANDARDIZATION  (Product Development module)
   * Portal path: Diagnostics > Product Development > Standardization  (doctype: DF Standardization)
   * Wireframe: from-client/product_standardization_module.html (1084 lines, fully read)
   * ============================================================ */
  'product_standardization_module.html': {
    framework: 'Standardization',
    module: 'Product Development',
    portalPath: 'Diagnostics › Product Development › Standardization  (DF Standardization)',
    checkedOn: '20-Jun-2026 (CT-IT, STD-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (STD-EP-00026-00001, products Bamboo Shoot Pickle PRD-00011/00012). Tabs: Summary, Details, Existing, Required, Resources, Log Book — all present. Existing row (Product, Sector, Type, SOP link, External URL, Developed By, Version) saves & persists on real keystrokes (the earlier null saves were a native-setter automation artifact, NOT a bug). Required row (Product, Type, Collaborating Partner, Assessment Remarks, Partner Assigned, Status, dates, Final SOP) saves ONLY when Status="Completed". HEADLINE: Bug 105 (BLOCKER) Required Status dropdown options mismatch backend → "In-Progress"/"Dropped" fail the whole save (417). Also: Bug 106 Upload SOP file control missing (URL only), Bug 107 "Is being followed?" Yes/No+reason missing, Bug 108 Product Sector free-text editable & not auto-fetched. Seeded the empty Standardization Type master with 4 real values (Recipe/Process/Packaging/Quality Standardisation).',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present + switch fine.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound "Auto-fetched from profile"; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; district/block persisted on save.' },

      // ---- EXISTING TAB ----
      { t:'Existing', s:'List', e:'"+ Add Existing Standard" → adds standardisation row', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds row', be:'std_entries child (phase=Existing)', n:'Verified.' },
      { t:'Existing', s:'Identity', e:'Product * (product picker)', ty:'picker', w:'Existing row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'product picker', be:'links Product', n:'Picker lists EP products (PRD-00011/00012). Selected + persisted.' },
      { t:'Existing', s:'Identity', e:'Product Sector (wireframe: read-only, auto-fetched from product)', ty:'text', w:'Existing row', p:'Y', v:'N', fn:'N', sev:'minor', fe:'wireframe = readonly "Auto-fetched when product is selected"', be:'derive from product', n:'Bug 108: free-text editable (readOnly=false), does NOT auto-fetch on product select — stays blank, typed manually.' },
      { t:'Existing', s:'Identity', e:'Type of Standardization (master picker)', ty:'picker', w:'Existing row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'master-backed picker', be:'Standardization Type master', n:'Master had ONLY junk ("abcd"/"abcdddd"); seeded 4 real types. No inline-create in picker (had to seed via API/Masters). Then selected Recipe Standardisation; persisted.' },
      { t:'Existing', s:'SOP', e:'Upload SOP file control (file picker .pdf/.doc/.img + View + Replace + Delete)', ty:'upload', w:'Existing row', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe file input w/ pill+View+remove (full CRUD)', be:'attach SOP to CRM', n:'Bug 106: NO file input anywhere (0 input[type=file]). Only free-text URL fields — no capture/view/replace/delete.' },
      { t:'Existing', s:'SOP', e:'SOP / Recipe Link + External SOP URL (free text)', ty:'text', w:'Existing row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'URL fields', be:'persist', n:'Both persist on real keystrokes (recipe_sop_link + sop_url). Earlier null was native-setter artifact, re-tested = OK.' },
      { t:'Existing', s:'Authoring', e:'Developed By + Version', ty:'text', w:'Existing row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'free text', be:'persist', n:'Persist (developed_by="MBMA Food Lab", version="v1.0").' },
      { t:'Existing', s:'Follow-up', e:'"Is the standardisation being followed?" Yes/No radio + conditional "Why not followed?" textarea', ty:'radio+text', w:'Existing row', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe Yes/No radio + conditional reason; feeds Summary "Being Followed" counts', be:'reasons_not_followed (field exists, no UI)', n:'Bug 107: NO control (0 radios). Backend reasons_not_followed unreachable; Summary "Being Followed (Yes)/(No)" counters can never populate.' },

      // ---- REQUIRED TAB ----
      { t:'Required', s:'List', e:'"+ Add Required Standardization" → adds required-standardisation row', ty:'button', w:'Required tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds row', be:'std_entries child (phase=Required)', n:'Verified.' },
      { t:'Required', s:'Identity', e:'Product * + Type Required (pickers)', ty:'picker', w:'Required row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'pickers', be:'links', n:'Both selected (PRD-00011, Process Standardisation) + persisted.' },
      { t:'Required', s:'Identity', e:'Product Sector (read-only auto-fetch)', ty:'text', w:'Required row', p:'Y', v:'N', fn:'N', sev:'minor', fe:'wireframe readonly auto-fetch', be:'derive from product', n:'Bug 108 (same defect on Required row): free-text editable, no auto-fetch.' },
      { t:'Required', s:'Detail', e:'Collaborating Partner, Assessment Remarks (textarea), Partner Assigned, Final SOP / Output Link', ty:'fields', w:'Required row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'free text + textarea + URL', be:'persist', n:'All persist on real keystrokes (collaborating_partner, assessment_remarks, partner_assigned, final_sop_link).' },
      { t:'Required', s:'Status', e:'Status dropdown (Implementation Status)', ty:'select', w:'Required row', p:'Y', v:'N', fn:'N', sev:'blocker', fe:'wireframe status select', be:'Standardization Entry.status Select', n:'Bug 105 (BLOCKER): UI offers "In-Progress"/"Completed"/"Dropped" but backend Select = ""/"Pending"/"In Progress"/"Completed"/"On Hold"/"Not Feasible". "In-Progress" (hyphen) & "Dropped" → 417 ValidationError, WHOLE save rejected, row lost. Only "Completed" saves. Confirmed via network trace + reload.' },
      { t:'Required', s:'Dates', e:'Date Started + Date Completed', ty:'date', w:'Required row', p:'Y', v:'?', fn:'?', sev:'minor', fe:'date inputs', be:'persist; chain order', n:'Inputs present. Date persistence + out-of-order validation not isolated (blocked behind Bug 105 save failure during run) — to re-verify once status fix lands.' },
      { t:'Required', s:'Approval', e:'Approved by Core Team (+ Completed/In Progress/Dropped indicators)', ty:'control', w:'Required row', p:'Y', v:'?', fn:'?', sev:'minor', fe:'core-team approval', be:'approval_by_core_team', n:'Label/indicators present; approval toggle persistence to verify.' },

      // ---- SUMMARY / RESOURCES / LOG BOOK ----
      { t:'Summary', s:'Aggregates', e:'Standard counts incl. "Being Followed (Yes)/(No)"', ty:'metrics', w:'Summary tab', p:'Y', v:'N', fn:'-', sev:'serious', fe:'aggregate counts', be:'derived', n:'Tab present but "Being Followed" counters are dead — depend on the missing control (Bug 107).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource (incl. File column)', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'rows + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify.' }
    ]
  },

  /* ============================================================
   * QUALITY CONTROL  (Product Development module)
   * Portal path: Diagnostics > Product Development > Quality Control  (doctype: DF Quality Control)
   * Wireframe: from-client/quality_control_module.html (807 lines, fully read)
   * ============================================================ */
  'quality_control_module.html': {
    framework: 'Quality Control',
    module: 'Product Development',
    portalPath: 'Diagnostics › Product Development › Quality Control  (DF Quality Control)',
    checkedOn: '20-Jun-2026 (CT-IT, QC-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (QC-EP-00026-00001). Tabs: Summary | Details | Existing | Post Implementation | Resources | Log Book — "Post Implementation" IS the wireframe\'s "Optimized"/target tab (renamed, NOT missing). HEADLINE — FW-QC-001 RE-CONFIRMED in a sharper form (Bug 109, BLOCKER): the Rating & Required-Target dropdowns are 4-level ("…4. Fully implemented") but the BACKEND Select is the correct 5-level ("…4. Mostly implemented","5. Fully implemented"); picking the UI top option "4. Fully implemented" → 417, whole save rejected, checklist row lost. So "Fully implemented" can never save and "Mostly implemented" can never be recorded; the on-screen 0/33/66/100 legend contradicts the backend 5-level scoring. GOOD: the score IS computed & PERSISTS server-side (rating 2 → existing_qc_score=40=2/5, category "Below Average") — NOT the Bug-86 class; Gap auto-derives ("+1"). Bug 110 (P3): canonical 23-practice checklist not seeded/enforced — master has only 8 reworded items, free-add → assessments not comparable across EPs.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Optimized | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Post Implementation | Resources | Log Book. "Post Implementation" = wireframe "Optimized" (target profile) — present & works (+ Add Item, Required Target). NOT a missing tab.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved as QC-EP-00026-00001.' },

      // ---- EXISTING TAB (assessment) ----
      { t:'Existing', s:'Assessment model', e:'Fixed 23 QC practices, each rated 1–5 (5-star scale); avg + distribution', ty:'rating-set', w:'Existing tab', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe = fixed 23 practices, tappable 5-star (1-5) per practice', be:'per-practice rating', n:'Build replaces fixed-23-star with FREE-ADD items + 4-level dropdown (no stars). See Bug 109 (scale) + Bug 110 (the 23 not seeded). UX regression: dropdown vs large tappable stars for low-literacy/touch field users.' },
      { t:'Existing', s:'List', e:'"+ Add Item" → adds a checklist row', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds row', be:'qc_checklist_internal_existing child', n:'Verified.' },
      { t:'Existing', s:'Checklist item', e:'Checklist item picker (canonical 23 practices)', ty:'picker', w:'Existing row', p:'Y', v:'N', fn:'Y', sev:'minor', fe:'should list the standardised 23 practices', be:'links checklist master', n:'Bug 110: master has only 8 reworded items (e.g. "Raw material quality check before use" vs wireframe "Raw material inspection before use"); most of the 23 absent; free-add not standardised. Picker works; search OK.' },
      { t:'Existing', s:'Rating', e:'Rating per practice (wireframe 5-star 1–5)', ty:'select', w:'Existing row', p:'Y', v:'N', fn:'N', sev:'blocker', fe:'5 levels (…Mostly impl.=4, Fully impl.=5)', be:'5-level Select (correct)', n:'Bug 109: UI is 4-level ("1.Not aware","2.Aware not impl","3.Partially","4.Fully implemented") — "Mostly implemented" dropped, "Fully implemented" mislabeled level 4. UI "4. Fully implemented" → 417 (backend wants "5. Fully implemented"), whole save lost. UI levels 1-3 save.' },
      { t:'Existing', s:'Required Target', e:'Required/target rating per practice', ty:'select', w:'Existing row', p:'Y', v:'N', fn:'N', sev:'blocker', fe:'5-level target', be:'5-level Select (correct)', n:'Bug 109 (same defect): UI 4-level vs backend 5-level; "4. Fully implemented" rejected → 417 (this is the exact value the toast flagged). Gap auto-derives correctly when both are valid levels (Rating 2 vs Target 3 → Gap "+1").' },
      { t:'Existing', s:'Score (server-side)', e:'QC compliance score + category', ty:'calc', w:'row + header', p:'Y', v:'N', fn:'Y', sev:'serious', fe:'wireframe star-sum (max 115 = 23×5)', be:'server-side compliance score', n:'Score COMPUTES & PERSISTS server-side (GOOD, unlike Bug 86): 1 item rated "2" → existing_qc_score=qc_compliance_score=40 (=2/5), score_category="Below Average". BUT on-screen legend uses 4-level 0/33/66/100 (Bug 109) which contradicts the 5-level backend; and wireframe model is /115 star-sum.' },
      { t:'Existing', s:'Row meta', e:'Category, Description, Priority, Status', ty:'fields', w:'Existing row', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'category/desc free text; priority Low/Med/High; status', be:'persist', n:'Persist on valid save (category, status="In Progress" stored). Status options match backend (Pending/In Progress/Completed/On Hold/Not Feasible).' },

      // ---- POST IMPLEMENTATION (Optimized / target) ----
      { t:'Post Impl', s:'Target profile', e:'"+ Add Item" + Required Target / optimized ratings', ty:'rating-set', w:'Post Implementation tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'set post-intervention target ratings', be:'table_qc_internal_optimized child', n:'Tab present with + Add Item + target concept (= wireframe Optimized). Same 4-vs-5 level dropdown defect (Bug 109) applies. Full drive deferred behind the rating fix.' },

      // ---- SUMMARY / RESOURCES / LOG BOOK ----
      { t:'Summary', s:'Aggregates', e:'Avg rating, target profile, interventions, rating distribution; gap-coloured table', ty:'metrics', w:'Summary tab', p:'Y', v:'?', fn:'-', sev:'minor', fe:'auto-rollup from Existing+target', be:'derived', n:'Tab present; rollups driven by the (blocked-at-level-4) ratings — re-verify after Bug 109 fix.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + SOP Word template + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'rows + template + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify.' }
    ]
  },

  /* ============================================================
   * PRODUCT PACKAGING  (Product Development module)
   * Portal path: Diagnostics > Product Development > Product Packaging  (doctype: DF Packaging)
   * Wireframe: from-client/product_packaging_module.html (1703 lines, fully read)
   * ============================================================ */
  'product_packaging_module.html': {
    framework: 'Product Packaging',
    module: 'Product Development',
    portalPath: 'Diagnostics › Product Development › Product Packaging  (DF Packaging)',
    checkedOn: '20-Jun-2026 (CT-IT, PKG-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (PKG-EP-00026-00001, product Bamboo Shoot Pickle PRD-00011, type Plastic Packaging). Tabs Summary/Details/Existing/Required/Requirement Tracker/Resources/Log Book all present (Task Log→Log Book rename). HEADLINE — Bug 85 RE-TESTED & REFRAMED (still valid, P2): "+ Add Month" is NOT a dead no-op — it adds a month row every click, but the row only RENDERS once a Product+Packaging Type are selected; with none selected (the PM screenshot state) rows are added INVISIBLY (table still says "No monthly orders yet"), no feedback, button not disabled → repeated clicks save phantom zero-cost rows (data pollution; 2 such rows persisted, I cleaned them). GOOD: with prereqs set, the month row renders; Qty 100 × Price 12 auto-computed Total ₹1,200 and PERSISTED server-side (total_order_cost=1200) — calc is fine, NOT the Bug-86 class. Bug 111 (P3): "Picture of Packaging" is an "Image URL" text field, not the wireframe Upload button (no file capture/CRUD — same class as Bug 106). Printing fields (Supports Printing / Pouch Printing Required) ARE present (avoided a false-miss). Note: packaging-type master is thin (1 item "Plastic Packaging").',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Requirement Tracker | Resources | Task Log | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Requirement Tracker | Resources | Log Book. All present; Task Log→Log Book rename.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved PKG-EP-00026-00001.' },

      // ---- EXISTING: packaging card ----
      { t:'Existing', s:'List', e:'"+ Add Packaging" → adds a packaging card', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds card', be:'packaging_info_existing child', n:'Verified; card added + persisted.' },
      { t:'Existing', s:'Card fields', e:'Product, Product SKU, Type of Packaging, Material, Dimensions, Capacity, Unit, Purchase Source, Price per Unit, Procurement Status', ty:'fields', w:'packaging card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'pickers + text + Yes/No', be:'persist', n:'Verified: product picker, Type (Plastic Packaging) + Price 12 persisted; SKU/Material/Dimensions/Capacity/Unit/Source present.' },
      { t:'Existing', s:'Printing fields', e:'Supports Printing? / Pouch Printing Required', ty:'control', w:'packaging card', p:'Y', v:'?', fn:'?', sev:'minor', fe:'printing flags', be:'packaging_supports_printing / pouch_printing_required', n:'Present in form (text confirmed) — avoided a false-miss. Exact control + persistence to spot-verify.' },
      { t:'Existing', s:'Picture upload', e:'Picture of Packaging — Upload (file capture/view/replace/delete)', ty:'upload', w:'packaging card', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe = Upload button (file)', be:'picture_of_packaging', n:'Bug 111: portal is an "Image URL" text field — 0 file inputs, no Upload, no CRUD. Same class as Bug 106.' },
      { t:'Existing', s:'Monthly schedule', e:'"+ Add Month" → month row (Month, Qty, Price/Unit, Total, Status)', ty:'button+table', w:'packaging card § Monthly', p:'Y', v:'Y', fn:'N', sev:'serious', fe:'append editable month row; Total auto = Qty×Price', be:'monthly_ordered_quantity_existing child', n:'Bug 85 (reframed): adds rows but only RENDER once Product+Type set; invisible phantom zero-rows + no feedback/disabled when not → data pollution (2 junk rows saved, cleaned). With prereqs: works.' },
      { t:'Existing', s:'Monthly Total (calc)', e:'Per-month Total = Qty × Price/Unit', ty:'calc', w:'month row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'auto Qty×Price', be:'total_order_cost; feeds annual cost → Unit Pricing', n:'VERIFIED computes & PERSISTS server-side: Qty 100 × Price 12 → Total ₹1,200, total_order_cost=1200 stored. NOT the Bug-86 class.' },

      // ---- REQUIRED / TRACKER / SUMMARY / RES / LOG ----
      { t:'Required', s:'Interventions', e:'"+ Add Packaging Intervention" / "+ Add New Packaging" (bridge from Existing flags) + monthly required', ty:'button+table', w:'Required tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'auto-populate from Existing intervention flags; new packaging; monthly required', be:'required child tables', n:'Tab present; intervention bridge + monthly-required drive deferred (after Bug 85 fix). To verify.' },
      { t:'Tracker', s:'Requirement Tracker', e:'Transposed monthly required overview', ty:'table', w:'Requirement Tracker tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'months × required types', be:'derived', n:'Tab present; to verify.' },
      { t:'Summary', s:'Aggregates', e:'Total products/items/annual cost + "Auto-fetches to Unit Pricing → Packaging"', ty:'metrics', w:'Summary tab', p:'Y', v:'?', fn:'-', sev:'minor', fe:'rollup + Unit Pricing feed', be:'derived', n:'Tab present; cross-feed to Unit Pricing to verify at Unit Pricing stage.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource (Upload column)', ty:'table', w:'Resources tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'rows + upload', be:'Resources child table', n:'Tab present; CRUD to verify.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'?', fn:'?', sev:'minor', fe:'task + date + notes', be:'log child table', n:'Tab present; to verify.' }
    ]
  }

};
