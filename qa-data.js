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
  }

};
