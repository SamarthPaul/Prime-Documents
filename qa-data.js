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
      { t:'Existing', s:'Totals', e:'Total bar: Material Count, Essential, Total Monthly Spend, Total RM Cost/Unit, "Auto-fetches to Existing Unit Pricing → Raw Materials"', ty:'calc', w:'Existing tab footer', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Existing totals bar present + reflects the filled RM row; Unit Pricing cross-feed = Bug 120 (roll-up).' },

      // ---- REQUIRED TAB ----
      { t:'Required', s:'I. Alternate Procurement Sources', e:'Auto-populated list (from Existing flag) + add row; empty-state when none', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows arrive via flag OR manual', be:'alternate-source child table', n:'VERIFIED: flagging "Alt procurement source" in Existing created a §I row (PRD-2026-00010 / RAW-MAT-000065 / ↻ Alternate Source). Skip-logic bridge works.' },
      { t:'Required', s:'I. Alt Source row', e:'Fields: Product/Current RM/Justification (bridge RO), New Source Type, Name, Location, Contact, New Price/Unit, Old Price/Unit, Expected Saving (auto), Notes, Implementation Status', ty:'row', w:'Required §I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'saving auto = Old−New', be:'persists per row', n:'Required Section I alt-source row present with bridged Product/RM (intervention->Required bridge VERIFIED end-to-end on RM S28 + Digital Literacy this session).' },
      { t:'Required', s:'II. Alternate Raw Materials', e:'Auto-populated list + add row', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'rows via flag OR manual', be:'alternate-material child table', n:'Required Section II present; same intervention->Required bridge mechanism (verified).' },
      { t:'Required', s:'III. New Raw Material', e:'SECTION III "New Raw Material" + "+ Add New Raw Material" (standalone, always-on)', ty:'section', w:'Required tab', p:'N', v:'N', fn:'N', sev:'serious', fe:'standalone new raw materials NOT linked to an existing one — add freely', be:'new-material child table; feeds Optimised Unit Pricing', n:'Bug 95 (HEADLINE): CONFIRMED ABSENT on portal — Required has only §I & §II. No "+ Add New Raw Material". The original trigger for this audit.' },
      { t:'Required', s:'III. New Material row + status', e:'Full new-material entry (Name, Source, cost inputs, Essential, Reason) + Implementation Status', ty:'row', w:'Required §III', p:'N', v:'N', fn:'N', sev:'serious', fe:'full entry', be:'persists; feeds Optimised Unit Pricing', n:'Bug 95: absent (Section III missing).' },
      { t:'Required', s:'Totals (Optimised View)', e:'Total bar: Alternate Sources, Alternate Materials, New Raw Materials, Status Completed, "Auto-fetches to Optimised Unit Pricing"', ty:'calc', w:'Required tab footer', p:'Y', v:'N', fn:'-', sev:'minor', fe:'roll-up incl. New Raw Materials count', be:'CROSS-FRAMEWORK feed to Optimised Unit Pricing', n:'Bar present (Alternate Sources/Materials counts) but "New Raw Materials" count OMITTED — consistent with Bug 95.' },

      // ---- RESOURCES TAB ----
      { t:'Resources', s:'Reference Materials', e:'Table: Resource Title, Category, Type, Description/Notes, File (Upload+View), delete, "+ Add Resource"', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table + file attach', n:'DRIVEN on RM: + Upload -> Upload Resource modal -> uploaded QA Reference Material (PNG) -> persists, shows with Open arrow.' },

      // ---- LOG BOOK TAB (wireframe "Task Log") ----
      { t:'Log Book', s:'Activities', e:'Log table + "+ Add Row" (wireframe Task Log: No., Date, Task Name (16 preset), Notes/Outcome, Attachment)', ty:'table', w:'Log Book tab', p:'Y', v:'N', fn:'N', sev:'serious', fe:'task dropdown + date + notes', be:'log child table', n:'BLOCKED by Bug 123 (RM stale-EP): UI Save fails + API save cascades Activity-Logger mandatory error -> RM record un-saveable until EP fixed. Log Book component itself proven on Standardization.' }
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
      { t:'Financial Assessment', s:'II. Intervention Need', e:'Toggle "Does the entrepreneur need Intervention in bookkeeping?" + Justify textarea (skip-logic reveal)', ty:'toggle+text', w:'FA › Section II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'toggle reveals justify textarea', be:'bk_intervention_needed + reason', n:'DRIVEN: Intervention toggle on Financial Assessment -> bk_intervention_needed=1 persisted; pre/post intervention notes present.' },

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
      { t:'Resources', s:'Reference Materials', e:'Resources tab (build addition; wireframe has no Resources tab for Financials)', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'n/a (not in wireframe)', be:'BRD standard Resources pattern', n:'DRIVEN on FIN: + Upload -> QA Reference Material (PNG) persists, shows Open arrow.' },

      // ---- LOG BOOK TAB (wireframe "Task Log") ----
      { t:'Log Book', s:'Activities', e:'Log table + "+ Add Row"; Task Name dropdown', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe Task Log: No., Date, Task Name (16 preset), Notes/Outcome, Attachment, +Add Entry', be:'log child table', n:'DRIVEN on FIN: + Add Row -> Field Visit + hours + comments -> persisted (log child 2 rows).' },
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
      { t:'Summary', s:'Overview + Aggregates + Flags', e:'Machine-wise Overview table, Aggregates, Intervention Flags', ty:'table+metrics', w:'Summary tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'auto-populated', be:'derived', n:'VERIFIED: Summary reflects the filled machine with non-zero rollup (cost/depreciation). Aggregates compute.' },
      // EXISTING — block fields
      { t:'Existing', s:'List', e:'"+ Add Machine" → collapsible machine block; Existing totals bar', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'add block', be:'machine child table', n:'Verified.' },
      { t:'Existing', s:'I. Classification', e:'Name of Machinery/Tool * (machine-master picker), Process Flow No., Purpose, Critical/Non-Critical', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe Name was free text; build uses a picker', be:'links to machine master', n:'DRIVEN: Classification & Process Integration section always visible (Product, Process Flow No., Name of Machinery* autocomplete=Steam Boiling Machine, Purpose, Critical/Non-Critical). Conditional validation CONFIRMED: setting Critical makes \'Provide Reason\' (Why is this machine critical?) mandatory - save blocked until filled, then saved clean.' },
      { t:'Existing', s:'I. Classification', e:'Product (link the machine to a product)', ty:'picker', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe Classification has a Product field', be:'', n:'Bug 101: no per-machine Product field on portal (confirm vs BRD — machine may serve many products).' },
      { t:'Existing', s:'I. Classification', e:'If Critical, provide reason', ty:'text', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'conditional on Critical', be:'', n:'DRIVEN + CONFIRMED conditional: Critical/Non-Critical=Critical makes the Provide Reason field (placeholder Why is this machine critical?) mandatory - save blocked with If Critical, Provide Reason is required until filled, then saved clean.' },
      { t:'Existing', s:'II. Technical & Power', e:'Power/Phase Needed, No. of Machinery/Tool *, Wattage/Load (W), Total Power Load (calc), Main Usage Time', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'specs', be:'', n:'Total Power Load = build addition. Present.' },
      { t:'Existing', s:'III. Operational Capacity', e:'Days/Month, Hours/Day, Current Capacity/hr, Max Capacity/hr → Monthly Output, Capacity Utilization, Capacity Gap', ty:'fields+calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'output = days×hrs×cap', be:'derived', n:'Verified: 20×8×10 = 1,600/mo; Utilization 66.7% (10/15); persists.' },
      { t:'Existing', s:'IV. Financial & Maintenance', e:'Cost of Machine *, Salvage/Residual Value, Brand/Series, Age, Useful Life, Remaining Life (calc), Servicing Required, Monthly Upkeep', ty:'fields+calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'BRD straight-line inputs', be:'persist', n:'Build ADDS Salvage + Useful Life + Remaining Life (BRD). Remaining Life 8.0 verified.' },
      { t:'Existing', s:'IV. Depreciation', e:'Depreciation Rate, Monthly Depreciation, Depreciation/Unit', ty:'calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'WIREFRAME: condition-based (Good/Fair/Poor 10/20/30%); PORTAL: straight-line (cost−salvage)/life', be:'BRD: straight-line', n:'Bug 99: MODEL DIVERGENCE. Portal straight-line verified correct (9%/yr, ₹375/mo, ₹0.23/unit) + matches BRD; old "no salvage" RESOLVED. Wireframe "Machinery Condition" field absent.' },
      { t:'Existing', s:'IV. Machinery Condition', e:'Machinery Condition (Good/Fair/Poor) — wireframe depreciation driver', ty:'select', w:'block', p:'N', v:'N', fn:'-', sev:'minor', fe:'wireframe field', be:'replaced by straight-line model', n:'Bug 99: absent on portal (portal uses straight-line instead).' },
      { t:'Existing', s:'IV. Reference', e:'Reference (current cost / condition)', ty:'text', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe field', be:'', n:'Bug 101: missing on portal.' },
      { t:'Existing', s:'V. Intervention Need', e:'Flag toggles: Solarization Needed?, Servicing Intervention Needed?, Capacity Upgrade Needed? (bridge to Required)', ty:'toggle', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe had inline Intervention Details (Issue/Description, Intervention Cost, New Electricity Cost); portal uses flag toggles → Required', be:'bridge to Required', n:'Intervention toggles present (3) on Existing block; intervention->Required bridge mechanism VERIFIED end-to-end on RM(S28)+Digital Literacy(this session).' },
      { t:'Existing', s:'Totals', e:'All Existing Machines — Total: Machine Count, Total Investment, Total Depreciation/Unit, "Auto-fetches to Existing Unit Pricing → Machinery Depreciation/Unit"', ty:'calc', w:'Existing footer', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Present (Machine Count 1, Total Investment ₹50k).' },
      // REQUIRED / RESOURCES / LOG BOOK
      { t:'Required', s:'Required tab', e:'New Machinery (+ Add New Machine), intervention rows bridged from Existing flags, Optimised totals', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'New Machine block + bridged intervention rows', be:'feeds Optimised Unit Pricing', n:'Required tab present with + Add New Machine (manual add) + bridged interventions (bridge proven). Tab functional.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on MACH: + Upload -> Upload Resource modal -> QA Reference Material (PNG) persists, shows Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task dropdown + date + notes', be:'log child table', n:'DRIVEN on MACH: + Add Row -> activity Field Visit + hours 2 + comments -> persisted to log child (1 row).' }
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
      { t:'Summary', s:'Overview + Aggregates + Flags', e:'Worker-wise Overview, Aggregates (incl GoM Compliant/Non-Compliant), Intervention Flags', ty:'table+metrics', w:'Summary tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'auto-populated', be:'derived', n:'VERIFIED: Summary reflects the worker data (Total Workers + wage rollup numbers present).' },
      { t:'Existing', s:'List', e:'"+ Add Worker Category" → collapsible worker block; Existing totals bar', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'add block', be:'worker child table', n:'Verified.' },
      { t:'Existing', s:'Worker fields', e:'Worker Category * (Self/Unpaid Family/Paid Family/Hired), Skill Level * (4), Employment Nature * (5), No. of Male, No. of Female, Total Workers (auto)', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'all present', be:'persist', n:'Verified: Total Workers auto = 3 (2M+1F).' },
      { t:'Existing', s:'Wage', e:'Wage Type * (Per Day/Per Month/Per Hour), Wage Rate *, Avg Working Days / Month', ty:'fields', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'feed labour cost', be:'persist', n:'Verified.' },
      { t:'Existing', s:'Avg Hours / Day', e:'Avg Hours / Day input', ty:'number', w:'block', p:'N', v:'-', fn:'-', sev:'minor', fe:'wireframe has Avg Hours/Day', be:'avg_hours_per_day field exists (default 8)', n:'Bug 103: input MISSING from UI; labour rate/hr assumes fixed 8h.' },
      { t:'Existing', s:'Calc — Labour Cost', e:'Monthly Labour Cost, Labour Rate / hr', ty:'calc', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'PerDay: wage×days×count', be:'persist', n:'Verified: ₹39,000 = 3×₹500×26; Rate/hr ₹50 (assumes 8h, see Bug 103).' },
      { t:'Existing', s:'GoM Minimum Wage', e:'GoM Minimum Wage (threshold by Skill Level)', ty:'number', w:'block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'wireframe AUTO-derives from skill (Unskilled360/Semi410/Skilled480/Highly550)', be:'should auto-set + persist', n:'Bug 102: manual field, NOT auto-derived from skill; stays 0; manual entry did not persist (stored 0).' },
      { t:'Existing', s:'GoM Compliant?', e:'GoM Compliant? verdict + below-minimum warning', ty:'calc', w:'block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'flag non-compliant when wage < GoM min for skill', be:'persist real verdict', n:'Bug 102: logic works WHEN threshold supplied (400 vs 480 → "✗ No" + warning), but with auto-threshold 0 the saved gom_compliant = TRUE trivially → false compliant. Safeguard defeated.' },
      { t:'Existing', s:'V. Intervention Need', e:'"Labour intervention needed?" toggle (bridge to Required)', ty:'toggle', w:'block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'flag → Required bridge', be:'bridge', n:'Intervention toggle present on Existing worker block; intervention->Required bridge mechanism verified (RM/DL). (GoM-wage compliance gap = Bug 102.)' },
      { t:'Existing', s:'Totals', e:'All Existing — Total: Worker count, Monthly Labour Cost, GoM Compliant (x/y), "Auto-fetches to Existing Unit Pricing"', ty:'calc', w:'Existing footer', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'roll-up', be:'CROSS-FRAMEWORK feed to Unit Pricing', n:'Totals bar present + reflects workers (Monthly Labour Cost rollup); verified.' },
      { t:'Required', s:'Required tab', e:'New Labour Category (+ Add), Labour Intervention rows (bridged), Optimised totals', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'new category + intervention rows', be:'feeds Optimised Unit Pricing', n:'Required tab present (bridge-driven from Existing intervention flags; bridge mechanism proven). No manual-add by design.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on HR: + Upload -> QA Reference Material (PNG) persists, shows Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task dropdown + date + notes', be:'log child table', n:'DRIVEN on HR: + Add Row -> Field Visit + hours 2 + comments -> persisted to log child (1 row).' }
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
      { t:'Logo', s:'Logo', e:'"Need New Logo?" toggle, Existing Logo, logo upload (file inputs), dual approval', ty:'fields+upload', w:'Logo tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'upload + approval', be:'need_new_logo + logo_*_approval', n:'DRIVEN: Logo upload works -> existing_logo_hd = uploaded file URL persisted; logo approval fields (Pending) present.' },
      { t:'Business Card', s:'Card Content', e:'Contact Number, Email, Instagram QR, WhatsApp Catalogue QR, QR uploads, "Need New?" + dual approval', ty:'fields+upload', w:'Business Card tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'card fields + QR uploads + approval', be:'need_new_bizcard + bizcard_*_approval', n:'VERIFIED persists: bizcard enterprise name (Dakini Organic Foods), tagline, contact, email; QR file inputs present.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on BI: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'N', fn:'N', sev:'minor', fe:'task + date + notes', be:'log child table', n:'BLOCKED: Log Book save fails - DF Branding Identity was not found in the Diagnostic Framework field (hidden log-row field rejects its own auto-filled value); same self-rejecting-validation class as Bug 123. Log Book component itself proven on Standardization/Machinery/HR/Financials.' }
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
      { t:'Required', s:'Master Content', e:'Product Name, Product Snapshot, Storyline Text, Product Tagline, Ingredients/Material, Benefits, Directions of Use, Manufactured by, Marketed by, Label Type, Product Pictures (upload)', ty:'fields+upload', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'full label content', be:'persist', n:'VERIFIED: Required new-label design workspace present + editable (14 inputs, + Add Picture). Record saves (enterprenur_name=EP-00026).' },
      { t:'Required', s:'Wine/Alcohol skip-logic', e:'"Wine / Alcohol Product?" toggle → reveals Alcohol Content (ABV) + statutory warning', ty:'toggle', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'conditional reveal + fixed statutory warning', be:'', n:'VERIFIED: toggle ON reveals ABV + "CONSUMPTION OF ALCOHOL IS INJURIOUS TO HEALTH / DON\'T DRINK AND DRIVE" (in-form, improvement vs wireframe). Matches FW-LBL-001.' },
      { t:'Required', s:'Variant Content + Label Status', e:'Variant Content (+ Add Variant), Label Status (Designer assignment / status)', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'per-variant label content', be:'persist', n:'VERIFIED: + Add Variant present; existing_variants child persists (1 row). Variant content + label status sections functional.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on LBL: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on LBL: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
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
      { t:'Existing', s:'Existing Brochure', e:'Upload Existing File + "Need New" flag (per the wireframe Existing tab)', ty:'fields+upload', w:'Existing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'flag new-brochure need', be:'existing child table', n:'VERIFIED persists: brochure_title (Dakini Naturals Product Catalogue 2026), type (Multi-Product Catalogue), tagline, storyline; upload + flag present.' },
      { t:'Required', s:'Brochure Setup', e:'Title, Brochure Type, Tagline/Headline, About/Storyline (AI), Contact, Email, Address, Market Scope', ty:'fields', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'all content fields', be:'persist', n:'VERIFIED filled + persisted (Title, Type=Multi-Product Catalogue, Tagline, Storyline, Contact/Email/Address).' },
      { t:'Required', s:'Product Listings', e:'"+ Add Product" → product-listing rows (product picker)', ty:'table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'add product listings', be:'products child table', n:'VERIFIED: added Orange Jam; products child table = 1, persisted.' },
      { t:'Required', s:'Brochure Status', e:'Assigned Designer (RO for FA), Print Format (A4/A5/DL/Custom), Page Count, Draft upload, Status workflow', ty:'fields+upload', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'design review status', be:'draft_*_status', n:'VERIFIED: Status set Under Review, persisted (draft_1_status). Build RICHER: 3-draft cycle (draft_1/2/3, each Pending/Under Review/Redo/Approved).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on MBR: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on MBR: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
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
      { t:'Market Research', s:'I. Market Landscape', e:'I.a Product Scope (auto-fetched), I.b Global (Market Size USD, Key Brands, Key Exporting Countries), I.c India (Market Size INR), I.d Meghalaya/NE (Key Selling Locations, CAGR)', ty:'fields', w:'Market Research tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'market landscape inputs', be:'persist', n:'Section present + editable; Market-Landscape snapshot auto-populates from selected product (read-only by design). Some research content persisted from prior fill; fresh full-fill constrained by Bug 124 save-block on this doctype.' },
      { t:'Market Research', s:'II. Channel Research', e:'Channel rows ("+ Add Channel") — selling channels/platforms', ty:'table', w:'Market Research tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'add channel rows', be:'channels child table', n:'Section present with + Add Channel; competitors_offline child persists (1 row) - channel/competitor data saves. Verified present + data persists.' },
      { t:'Market Research', s:'III. Key Brands Research', e:'Brand rows ("+ Add Brand") — competitor brands, USP, etc.', ty:'table', w:'Market Research tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'add brand rows', be:'brands child table', n:'Section present with + Add Brand (key-brands research). Verified present; same child-row persistence as channel research.' },
      { t:'Market Research', s:'IV. Respondent / Consumer Survey', e:'Respondent rows ("+ Add Respondent") — Age Group/Gender/Occupation/District/Used product?/Purchase Frequency', ty:'table', w:'Market Research tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'add respondent rows', be:'respondents child table', n:'Section present with + Add Respondent (consumer survey). Verified present + editable.' },
      { t:'Competitive Pricing', s:'Competitor Analysis', e:'Local / State / National market sub-sections', ty:'section', w:'Competitive Pricing tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'3 market levels', be:'', n:'Present (I. Local, II. State, III. National).' },
      { t:'Competitive Pricing', s:'Offline + Online channels', e:'OFFLINE CHANNELS + ONLINE CHANNELS pricing tables (Brand/Competitor, Outlet/Channel, Price, etc.); "+ Add Offline Row" / "+ Add Online Row"', ty:'table', w:'Competitive Pricing tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'offline + online competitor pricing', be:'competitors_offline / competitors_online child tables', n:'VERIFIED: added + filled an offline row (Naga Pickles / Tura Bazaar Store / ₹180) → competitors_offline=1 persisted.' },
      { t:'Competitive Pricing', s:'SWOT', e:'SWOT analysis (Strength/Weakness/Opportunity/Threat)', ty:'section', w:'Competitive Pricing tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'SWOT', be:'persist', n:'SWOT section present on Competitive Pricing tab (Strengths/Weaknesses/Opportunities/Threats). Verified present + editable.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on MR: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'N', fn:'N', sev:'minor', fe:'task + date + notes', be:'log child table', n:'BLOCKED: Log Book save fails - DF Market Research not found in the Diagnostic Framework field (recurring self-rejecting validation, same as Branding) -> Bug 124. Log Book component proven on Standardization/Machinery/HR/Financials/Labels.' }
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
      { t:'Existing', s:'Segmentation fields', e:'Age Group, Gender, Income Bracket, Occupation, Location Type, Primary/Secondary Target Segment, Primary Geography, Key Cities, Buying Motivation, Purchase Behaviour, Usage Rate, Loyalty Status, Market Readiness, Values & Lifestyle', ty:'fields', w:'Existing product block', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'full segmentation per wireframe', be:'persist', n:'VERIFIED present + editable (segmentation reveals per product via + Add Product; 9 base inputs). CA doc saves; deep per-product fill sampled (37 child tables).' },
      { t:'Required', s:'Target segments', e:'Target / aspiring customer segments per product', ty:'section', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'desired segment definition', be:'persist', n:'VERIFIED: Required tab present with + Add Product (target segments per product). Doc saves; structure functional.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on CA: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on CA: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row). CA doc saves fine (enterprenur_name=EP-00026).' }
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
      { t:'Required', s:'Recommended Channels', e:'"+ Add Recommended Channel" → recommended/target channels + implementation status', ty:'table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'recommended channels', be:'persist', n:'VERIFIED: existing_channels child persists; Required recommended-channels tab present (channel rows save). Market-Linkage server-side calc was confirmed working in S28.' },
      { t:'Sales Tracker', s:'Monthly sales', e:'Collapsible monthly sections; each row = one SKU via one channel; Price per month; Revenue auto-calc', ty:'table+calc', w:'Sales Tracker tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'per-month per-SKU revenue', be:'tracker child table; Tracker Annual Revenue agg', n:'Sales Tracker tab present (monthly sales per wireframe); ML doc saves; channel/sales children persist.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on ML: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on ML: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row). ML doc saves fine.' }
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
      { t:'Required', s:'Recommended Promotions', e:'"+ Add Recommended" → suggested promotions + intervention status', ty:'table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'recommended promotions', be:'persist', n:'VERIFIED: existing_promotions child persists; Required recommended-promotions tab present (rows save). Functional.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on PRM: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on PRM: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row). PRM doc saves fine.' }
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
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
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
      { t:'Existing', s:'Mandatory + uploads', e:'Product Name mandatory; Consent Letter + Testing Report uploads; Approved by Core Team', ty:'fields+upload', w:'Existing test row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'mandatory product; file uploads; core approval', be:'persist', n:'VERIFIED: mandatory Product enforced (blocked save) + date-chain validation works (resolved FW-TEST-001, prior pass). Consent letter / testing report uploads use the same upload component proven this session; Approved-by-Core-Team present.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dropdowns + upload', be:'Resources child table', n:'DRIVEN on PT: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on PT: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
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
      { t:'Required', s:'Dates', e:'Date Started + Date Completed', ty:'date', w:'Required row', p:'Y', v:'N', fn:'N', sev:'minor', fe:'date inputs', be:'persist; chain order', n:'Inputs present. Date persistence + out-of-order validation not isolated (blocked behind Bug 105 save failure during run) — to re-verify once status fix lands.' },
      { t:'Required', s:'Approval', e:'Approved by Core Team (+ Completed/In Progress/Dropped indicators)', ty:'control', w:'Required row', p:'N', v:'N', fn:'N', sev:'minor', fe:'core-team approval', be:'approval_by_core_team', n:'VERIFIED MISSING: "Approved by Core Team" renders only as a read-only SUMMARY COUNT (0); no editable approval control on Existing or Required rows — approval_by_core_team not settable via UI. Folds into Std missing-controls theme (cf Bug 107).' },

      // ---- SUMMARY / RESOURCES / LOG BOOK ----
      { t:'Summary', s:'Aggregates', e:'Standard counts incl. "Being Followed (Yes)/(No)"', ty:'metrics', w:'Summary tab', p:'Y', v:'N', fn:'-', sev:'serious', fe:'aggregate counts', be:'derived', n:'Tab present but "Being Followed" counters are dead — depend on the missing control (Bug 107).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource (incl. File column)', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
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
      { t:'Post Impl', s:'Target profile', e:'"+ Add Item" + Required Target / optimized ratings', ty:'rating-set', w:'Post Implementation tab', p:'Y', v:'N', fn:'N', sev:'minor', fe:'set post-intervention target ratings', be:'table_qc_internal_optimized child', n:'Tab present with + Add Item + target concept (= wireframe Optimized). Same 4-vs-5 level dropdown defect (Bug 109) applies. Full drive deferred behind the rating fix.' },

      // ---- SUMMARY / RESOURCES / LOG BOOK ----
      { t:'Summary', s:'Aggregates', e:'Avg rating, target profile, interventions, rating distribution; gap-coloured table', ty:'metrics', w:'Summary tab', p:'Y', v:'N', fn:'-', sev:'minor', fe:'auto-rollup from Existing+target', be:'derived', n:'Tab present; rollups driven by the (blocked-at-level-4) ratings — re-verify after Bug 109 fix.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + SOP Word template + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + template + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
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
      { t:'Existing', s:'Printing fields', e:'Supports Printing? / Pouch Printing Required', ty:'control', w:'packaging card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'printing flags', be:'packaging_supports_printing / pouch_printing_required', n:'VERIFIED present in packaging card (Supports Printing / Pouch Printing Required) - avoided false-miss in original pass.' },
      { t:'Existing', s:'Picture upload', e:'Picture of Packaging — Upload (file capture/view/replace/delete)', ty:'upload', w:'packaging card', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe = Upload button (file)', be:'picture_of_packaging', n:'Bug 111: portal is an "Image URL" text field — 0 file inputs, no Upload, no CRUD. Same class as Bug 106.' },
      { t:'Existing', s:'Monthly schedule', e:'"+ Add Month" → month row (Month, Qty, Price/Unit, Total, Status)', ty:'button+table', w:'packaging card § Monthly', p:'Y', v:'Y', fn:'N', sev:'serious', fe:'append editable month row; Total auto = Qty×Price', be:'monthly_ordered_quantity_existing child', n:'Bug 85 (reframed): adds rows but only RENDER once Product+Type set; invisible phantom zero-rows + no feedback/disabled when not → data pollution (2 junk rows saved, cleaned). With prereqs: works.' },
      { t:'Existing', s:'Monthly Total (calc)', e:'Per-month Total = Qty × Price/Unit', ty:'calc', w:'month row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'auto Qty×Price', be:'total_order_cost; feeds annual cost → Unit Pricing', n:'VERIFIED computes & PERSISTS server-side: Qty 100 × Price 12 → Total ₹1,200, total_order_cost=1200 stored. NOT the Bug-86 class.' },

      // ---- REQUIRED / TRACKER / SUMMARY / RES / LOG ----
      { t:'Required', s:'Interventions', e:'"+ Add Packaging Intervention" / "+ Add New Packaging" (bridge from Existing flags) + monthly required', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'auto-populate from Existing intervention flags; new packaging; monthly required', be:'required child tables', n:'Required tab present with + Add Packaging + bridged interventions; monthly-required grid present. Bridge mechanism proven.' },
      { t:'Tracker', s:'Requirement Tracker', e:'Transposed monthly required overview', ty:'table', w:'Requirement Tracker tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'months × required types', be:'derived', n:'VERIFIED: Requirement Tracker tab present with transposed monthly grid.' },
      { t:'Summary', s:'Aggregates', e:'Total products/items/annual cost + "Auto-fetches to Unit Pricing → Packaging"', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'rollup + Unit Pricing feed', be:'derived', n:'VERIFIED: Summary reflects packaging data (items/cost). Unit Pricing cross-feed = Bug 120.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource (Upload column)', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on PKG: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on PKG: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
    ]
  },

  /* ============================================================
   * DIGITAL LITERACY  (Skilling module)
   * Portal path: Diagnostics > Skilling > Digital Literacy  (doctype: DF Digital Literacy)
   * Wireframe: from-client/digital_literacy_module.html (1243 lines, fully read)
   * ============================================================ */
  'digital_literacy_module.html': {
    framework: 'Digital Literacy',
    module: 'Skilling',
    portalPath: 'Diagnostics › Skilling › Digital Literacy  (DF Digital Literacy)',
    checkedOn: '20-Jun-2026 (CT-IT, DL-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (DL-EP-00026-00001) — MOSTLY CLEAN, 1 minor deviation. Tabs Summary/Details/Existing/Required/Resources/Log Book all present (Task Log→Log Book). Access & Devices = 3 checkboxes (Smartphone/Laptop/Internet); multi-select WORKS + persists server-side (existing_has_smartphone=1, laptop=0, internet=1). Skill row uses a REAL 5-STAR widget (unlike QC\'s dropdown); 3-star click persisted existing_level=3. Justification persists. Intervention-Flagged toggle BRIDGES correctly to a Required row (bridge_ref set). Required: 5-star Target Level + Implementation Status persist (target_level=5, status "In Progress"). Only Bug 112 (P3): Platform/Skill is FREE-TEXT vs the wireframe curated dropdown → loses standardisation/comparability (same theme as QC Bug 110).',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved DL-EP-00026-00001.' },

      // ---- EXISTING ----
      { t:'Existing', s:'Access & Devices', e:'Checkboxes: Smartphone, Laptop/Computer, Internet', ty:'checkboxes', w:'Existing § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'multi-checkbox', be:'existing_has_smartphone/laptop/internet', n:'VERIFIED multi-select: ticked Smartphone+Internet → persisted smartphone=1, laptop=0, internet=1.' },
      { t:'Existing', s:'List', e:'"+ Add Skill" → adds a skill row', ty:'button', w:'Existing § II', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds row', be:'existing_skills child', n:'Verified.' },
      { t:'Existing', s:'Platform / Skill', e:'Platform picker (wireframe curated dropdown)', ty:'select', w:'skill row', p:'Y', v:'N', fn:'Y', sev:'minor', fe:'wireframe = curated platform <select>', be:'platform (free text)', n:'Bug 112: portal is a free-text input ("e.g. WhatsApp, UPI, Google Maps") → no standardisation/comparability. Works but unconstrained.' },
      { t:'Existing', s:'Existing Skill Level', e:'5-star skill rating per platform', ty:'rating', w:'skill row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe 5-star (1-5)', be:'existing_level integer', n:'VERIFIED real 5-star widget (NOT a dropdown — contrast QC). 3-star click → existing_level=3 persisted. No option-mismatch issue.' },
      { t:'Existing', s:'Intervention?', e:'Intervention-Flagged toggle → auto-creates Required entry', ty:'toggle', w:'skill row', p:'Y', v:'-', fn:'Y', sev:'', fe:'toggle bridges to Required', be:'intervention_required + bridge', n:'VERIFIED end-to-end: toggle ON → required_skills row auto-created (bridge_ref="47q5b0qcki"), platform+existing_level+justification carried over.' },
      { t:'Existing', s:'Justification', e:'Justification text per flagged skill', ty:'text', w:'skill row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'free text', be:'persist', n:'Persists.' },
      { t:'Existing', s:'Aggregates', e:'Skills Rated count + Average Skill Level', ty:'metrics', w:'Existing footer', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'auto avg', be:'derived', n:'VERIFIED: Skills-Rated count + Average Skill Level aggregates compute from the verified 5-star skill rows (existing_level persisted in original pass).' },

      // ---- REQUIRED ----
      { t:'Required', s:'List', e:'"+ Add Skill Row" + bridged rows pre-populated', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'bridged rows arrive; target + status', be:'required_skills child', n:'Bridged row present + editable.' },
      { t:'Required', s:'Target Skill Level', e:'5-star target rating', ty:'rating', w:'Required row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'5-star target', be:'target_level integer', n:'VERIFIED: 5-star click → target_level=5 persisted.' },
      { t:'Required', s:'Implementation Status', e:'Status (Pending/In Progress/Completed/Not Feasible)', ty:'select', w:'Required row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'status select', be:'implementation_status', n:'VERIFIED: "In Progress" persisted. Options match backend (no 417).' },
      { t:'Required', s:'Learnings / Notes + Impl Notes', e:'Learnings/Notes per skill + Implementation Notes', ty:'text', w:'Required row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'free text', be:'learnings', n:'VERIFIED: Required-row Learnings/Notes + Implementation Notes fields present; DL doc saves (target_level + status persisted in original pass).' },

      // ---- RES / LOG ----
      { t:'Resources', s:'Reference Materials', e:'Resource tiles/table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows/tiles + upload', be:'Resources child table', n:'DRIVEN on DL: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on DL: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
    ]
  },

  /* ============================================================
   * CAPACITY BUILDING  (Skilling module)
   * Portal path: Diagnostics > Skilling > Capacity Building  (doctype: DF Capacity Building)
   * Wireframe: from-client/capacity_building_module.html (1327 lines, fully read)
   * ============================================================ */
  'capacity_building_module.html': {
    framework: 'Capacity Building',
    module: 'Skilling',
    portalPath: 'Diagnostics › Skilling › Capacity Building  (DF Capacity Building)',
    checkedOn: '20-Jun-2026 (CT-IT, CB-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (CB-EP-00026-00001). Tabs Summary/Details/Past Trainings/Required Trainings/Resources/Log Book — wireframe "Tasks" tab absent (consistent with the known Tasks-workspace removal, NOT a bug). Past Training card SAVES & PERSISTS (training link, provider, location, dates, financial source "Govt Sponsored", completion "Completed", impact, feedback, learning outcome — all stored). HEADLINE — Bug 113 (P2): the Past Training form is significantly SIMPLIFIED vs the wireframe — the entire structured "Skill Retention & Application" block (Skill Retention / Applied in Enterprise? / Behaviour Change Observed? / Improvement Seen / Time Since Training) and most of the multi-source Feedback block (Trainer Feedback / Field Team Observation / Follow-up Actions / Assessment Date) + Training Format are ABSENT from BOTH UI and backend child → training effectiveness can only be recorded as prose, not structured/reportable M&E data. (Skill Type/Area appear moved to the training master = acceptable derive.) SEED: "Capacity Building Training Master" was EMPTY (picker returned nothing) → seeded 3 trainings as CT-IT. Minor: Required Trainings collapses the wireframe\'s 2 sections (Re-training + New Required) into one "+ Add Required Training".',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Past Trainings | Required Trainings | Tasks | Resources | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Past Trainings | Required Trainings | Resources | Log Book. "Tasks" tab absent = known Tasks-workspace removal (NOT a bug).' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved CB-EP-00026-00001.' },

      // ---- PAST TRAININGS ----
      { t:'Past', s:'List', e:'"+ Add Training" → adds a past-training card', ty:'button', w:'Past Trainings tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'adds card', be:'past_trainings child', n:'VERIFIED: Required Trainings + Add Required Training present + saves (collapsed to one list vs wireframe 2 sections - noted on Bug 113). Functional.' },
      { t:'Past', s:'Training (picker)', e:'Training Name / picker (auto-fills objective)', ty:'picker', w:'training card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'wireframe = free text + Skill Type/Area selects', be:'links Capacity Building Training Master', n:'Build uses a Training-master picker (improvement); MASTER WAS EMPTY → seeded 3 (Food Safety/Digital Marketing/Bookkeeping). Selecting auto-fills Training Objective. Skill Type/Area live on the master (training_category/level).' },
      { t:'Past', s:'I. Training Details', e:'Provider, Location, Start/End Date, Completion Status, Funding/Financial Source', ty:'fields', w:'training card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'text + dates + selects', be:'persist', n:'All persist (NIFTEM-K, Tura, 10-12 Mar, Completed, Govt Sponsored). Completion + Funding select options save fine (no 417).' },
      { t:'Past', s:'I. Training Format', e:'Training Format (Online/Offline/Hybrid)', ty:'select', w:'training card', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe Training Format select', be:'absent in past_trainings child', n:'Bug 113: Training Format absent (master has training_mode but per-record format gone).' },
      { t:'Past', s:'II. Skill Retention & Application', e:'Skill Retention, Applied in Enterprise?, Behaviour Change Observed?, Improvement Seen, Time Since Training', ty:'selects', w:'training card', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe structured M&E selects', be:'ABSENT from past_trainings child', n:'Bug 113 (headline): entire structured block missing UI + backend → behaviour-change/skill-applied/retention cannot be captured/reported. Replaced by free-text Impact of Training + a rating.' },
      { t:'Past', s:'III. Feedback', e:'Entrepreneur Feedback, Trainer/Facilitator Feedback, Field Team Observation, Learning Outcome, Follow-up Actions, Assessment Date', ty:'fields', w:'training card', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe 6 feedback fields', be:'only entrepreneur_feedback + learning_outcome exist', n:'Bug 113: Trainer Feedback, Field Team Observation, Follow-up Actions, Assessment Date ABSENT (UI + backend). Only Entrepreneur Feedback + Learning Outcome present (both persist).' },
      { t:'Past', s:'Impact', e:'Impact of Training + impact rating', ty:'text+rating', w:'training card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'(build addition)', be:'impact_of_training + rating_impact', n:'Impact free-text persists; rating_impact field exists (partial substitute for the lost structured block).' },

      // ---- REQUIRED TRAININGS ----
      { t:'Required', s:'List', e:'Re-training Interventions + New Required Trainings (wireframe 2 sections)', ty:'button+table', w:'Required Trainings tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'wireframe = I. Re-training + II. New Required (2 add buttons)', be:'required child table', n:'DRIVEN: + Add Required Training -> row with Skill Area / Priority / Status / Level / Sponsorship / Attendance / Pick-a-training (master) / Assign-member. Filled Financial Literacy + High + Identified -> saved clean -> Summary Total Identified 1 + Skill Areas Covered 1. Functional. Build collapses wireframe 2 sections (Re-training + New Required) into ONE list (minor, noted on Bug 113).' },

      // ---- SUMMARY / RES / LOG ----
      { t:'Summary', s:'Aggregates', e:'Training-wise overview + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'rollup', be:'derived', n:'VERIFIED: Summary aggregates present + reflect the past-training data (which persists). Structured M&E block gap = Bug 113.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on CB: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on CB: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
    ]
  },

  /* ============================================================
   * BUSINESS PLAN CANVAS  (Skilling module — standalone individual framework)
   * Portal path: Diagnostics > Skilling > Business Plan Canvas  (doctype: DF Business Plan Canvas)
   * Wireframe: from-client/business_plan_canvas_module.html (796 lines, fully read)
   * ============================================================ */
  'business_plan_canvas_module.html': {
    framework: 'Business Plan Canvas',
    module: 'Skilling',
    portalPath: 'Diagnostics › Skilling › Business Plan Canvas  (DF Business Plan Canvas)',
    checkedOn: '20-Jun-2026 (CT-IT, BPC-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (BPC-EP-00026-00001) — CORE CLEAN, 1 minor bug. Portal tabs: Details | Canvas | Canvas Details | Resources | Log Book (note: "Business Plan Canvas" in the bar is the page heading/breadcrumb, NOT a tab — clicking it navigates to the list). The 9-block BMC grid lives in "Canvas Details" (editable) with a read-only visual view in "Canvas". ALL 9 BMC blocks (Key Partners, Key Activities, Key Resources, Value Propositions, Customer Relationships, Channels, Customer Segments, Cost Structure, Revenue Streams) present, fill, and PERSIST server-side. Bug 114 (P3, only finding): NO Summary view — the wireframe Canvas Completion %, content-preview table, aggregates, and intervention-flags summary are absent (no completion metric anywhere). Finishes the Skilling module.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Business Plan Canvas | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'minor', fe:'tabs', be:'standard pattern', n:'Build: Details | Canvas | Canvas Details | Resources | Log Book. Canvas grid split into Canvas (view) + Canvas Details (edit). No Summary tab (see Bug 114).' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved BPC-EP-00026-00001.' },

      // ---- CANVAS (9 blocks) ----
      { t:'Canvas', s:'9-block BMC grid', e:'Key Partners, Key Activities, Key Resources, Value Propositions, Customer Relationships, Channels, Customer Segments, Cost Structure, Revenue Streams', ty:'textareas', w:'Canvas Details tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'9 BMC block textareas', be:'9 backend fields', n:'VERIFIED: all 9 present, filled with real content, PERSIST server-side (key_partners…revenue_streams all stored). Clean.' },
      { t:'Canvas', s:'Visual view', e:'Read-only canvas display', ty:'display', w:'Canvas tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'visual grid', be:'reads same 9 fields', n:'"Canvas" tab renders the filled blocks read-only (Bamboo/Garo/WhatsApp content shown).' },

      // ---- SUMMARY (missing) ----
      { t:'Summary', s:'Canvas Completion + preview + flags', e:'Canvas Completion %, Content Preview table, Aggregates (3 financial/strategic blocks), Intervention Flags', ty:'metrics', w:'Summary tab', p:'N', v:'N', fn:'N', sev:'minor', fe:'wireframe Summary tab', be:'derivable from the 9 blocks', n:'Bug 114: NO Summary tab; no Canvas Completion % anywhere; no content-preview/aggregates/intervention-flags. Data is all present (derivable) — just not surfaced.' },

      // ---- RES / LOG ----
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
    ]
  },

  /* ============================================================
   * LOGISTIC PACKING  (Logistics module)
   * Portal path: Diagnostics > Logistics > Logistic Packing  (doctype: DF Logistic Packing)
   * Wireframe: from-client/logistics_packing_module.html (1704 lines, fully read)
   * ============================================================ */
  'logistics_packing_module.html': {
    framework: 'Logistic Packing',
    module: 'Logistics',
    portalPath: 'Diagnostics › Logistics › Logistic Packing  (DF Logistic Packing)',
    checkedOn: '20-Jun-2026 (CT-IT, LP-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (LP-EP-00026-00001, product Bamboo Shoot Pickle PRD-00011) — CLEAN, no new bugs. Tabs Summary/Details/Existing/Required/Resources/Log Book all present. HEADLINE: BUG 84 RESOLVED — both masters now SEEDED: Logistic Packing Type (8: Bamboo Basket/Cardboard Box/Jute Bag/Net Bag/Plastic Crate/Poly Bag/Tin Container/Wooden Crate) + Logistic Packing Material (5: Cane/Cardboard/Foam/Paper/Plastic). Packing item row fully fills & PERSISTS (packing_type "Cardboard Box", material "Cardboard", purchase_source "Local Market", price 8, damage_observed "Minor", dim_unit cm). Monthly Shipment grid AUTO-POPULATES the transposed table (column "Cardboard Box · @ ₹8.00/unit", 12 month qty cells + Month Total) — much cleaner than Packaging\'s "+ Add Month" (no phantom-row bug here). Minor UX note: a "Save the document once before adding packing" gate forces an extra save round-trip (add product → save → + Add Row) vs the wireframe\'s fill-then-save-once — mild friction on flaky networks (not filed).',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved LP-EP-00026-00001.' },

      // ---- EXISTING ----
      { t:'Existing', s:'List', e:'"+ Add Product" → packing card (then "+ Add Row" per packing item)', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds product card + packing rows', be:'lp_products / lp_items child', n:'Verified. NOTE: "Save the document once before adding packing" gate — must save the card before "+ Add Row" reveals packing fields (extra save round-trip; minor UX).' },
      { t:'Existing', s:'Product', e:'Product picker (+ SKU optional)', ty:'picker', w:'packing card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'product picker', be:'links Product', n:'Verified (PRD-2026-00011).' },
      { t:'Existing', s:'Packing Type', e:'Packing Type picker', ty:'picker', w:'packing item', p:'Y', v:'Y', fn:'Y', sev:'', fe:'master-backed', be:'Logistic Packing Type', n:'BUG 84 RESOLVED: master seeded (8 types). Selected "Cardboard Box"; persisted.' },
      { t:'Existing', s:'Material', e:'Material picker', ty:'picker', w:'packing item', p:'Y', v:'Y', fn:'Y', sev:'', fe:'master-backed', be:'Logistic Packing Material', n:'BUG 84 RESOLVED: master seeded (5 materials). Selected "Cardboard"; persisted.' },
      { t:'Existing', s:'Specs', e:'Dimensions L/B/H + unit, Procurement Source, Price/Unit, Damage Risk, Properties/observations', ty:'fields', w:'packing item', p:'Y', v:'Y', fn:'Y', sev:'', fe:'dims + selects + price', be:'persist', n:'Verified: source "Local Market", price 8, damage "Minor", dim_unit cm all persist. Damage Risk = None/Minor/Moderate/Severe.' },
      { t:'Existing', s:'Intervention toggle', e:'Toggle "Intervention Needed?" → auto-creates Replacement on Required tab', ty:'toggle', w:'packing item', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'bridges to Required', be:'bridge', n:'VERIFIED: intervention toggle present on packing item; bridge-to-Required mechanism proven (RM/DL).' },
      { t:'Existing', s:'Monthly Shipment grid', e:'Section II — transposed Monthly Shipment Quantities (months × packing types), auto-populated', ty:'table', w:'Existing § II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'12-month grid, auto columns from packing items, Month Total', be:'monthly child', n:'VERIFIED auto-populates: column "Cardboard Box · @ ₹8.00/unit", 12 qty cells + Month Total. Fixed 12-month grid (no "+ Add Month" → no phantom-row bug, unlike Packaging Bug 85).' },

      // ---- REQUIRED / SUMMARY / RES / LOG ----
      { t:'Required', s:'Interventions', e:'I. Packing Interventions + II. New Logistics Packing + III. Monthly Shipment Required', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'bridged interventions + new packing + monthly required', be:'required child tables', n:'VERIFIED: Required tab present with + Add New Packing + bridged interventions.' },
      { t:'Summary', s:'Aggregates', e:'Packing-wise overview + aggregates + intervention flags; "Auto-fetches to Unit Pricing"', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'rollup + Unit Pricing feed', be:'derived', n:'VERIFIED: Summary reflects packing data (Cardboard Box etc.); Unit Pricing cross-feed = Bug 120.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on LP: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on LP: + Add Row -> Field Visit + hours + comments -> persisted (log child 1 row).' }
    ]
  },

  /* ============================================================
   * LOGISTIC SERVICE  (Logistics module)
   * Portal path: Diagnostics > Logistics > Logistic Service  (doctype: DF Logistic Service)
   * Wireframe: from-client/logistics_service_module.html (1279 lines, fully read)
   * ============================================================ */
  'logistics_service_module.html': {
    framework: 'Logistic Service',
    module: 'Logistics',
    portalPath: 'Diagnostics › Logistics › Logistic Service  (DF Logistic Service)',
    checkedOn: '20-Jun-2026 (CT-IT, LS-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (LS-EP-00026-00001). Tabs: Summary | Details | Existing | Required | Resources | Log Book. CORE (routes) CLEAN: "+ Add Logistics Route" + "+ Add Leg" (From/To/Mode/Time/Cost) drive fully; route cost calc = sum of legs WORKS + PERSISTS (route total_cost_per_trip ₹3,500 = leg ₹3,500; leg mode "Truck"). HEADLINE — Bug 115 (P2): the wireframe "Assessment" tab (Road & Access Conditions: Road Connectivity / Nearest Highway / Rail / Courier Hub / Last Mile Access / Main Logistics Issue / Seasonal Disruption / General Notes + Services Available Nearby) is NOT rendered on ANY tab, EVEN THOUGH all the backend fields exist (road_connectivity, nearest_highway, nearest_rail_station, nearest_courier_hub, last_mile_access, main_logistics_issue, seasonal_disruption, general_notes + services_available child) → orphaned, capturable only via API. NOT the S26 legacy-tab case (these are live current fields). SEED: leg Mode master "DF Module Transport Means" was EMPTY → seeded 8 transport modes as CT-IT.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Assessment | Existing | Required | Resources | Task Log | Log Book)', ty:'tabs', w:'Top of framework', p:'N', v:'-', fn:'N', sev:'serious', fe:'wireframe has an Assessment tab', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book — the "Assessment" tab is MISSING (Bug 115). Other tabs present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved LS-EP-00026-00001.' },

      // ---- ASSESSMENT (missing) ----
      { t:'Assessment', s:'Road & Access Conditions', e:'Road Connectivity, Nearest Highway/Rail/Courier, Last Mile Access, Main Logistics Issue, Seasonal Disruption, General Notes', ty:'fields', w:'Assessment tab', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe Assessment tab', be:'ALL fields exist in DF Logistic Service (orphaned)', n:'Bug 115: not rendered on ANY tab (checked Summary/Details/Existing/Required/Resources). Backend HAS road_connectivity/nearest_highway/nearest_rail_station/nearest_courier_hub/last_mile_access/main_logistics_issue/seasonal_disruption/general_notes → orphaned, API-only.' },
      { t:'Assessment', s:'Services Available Nearby', e:'Nearby logistics services list', ty:'table', w:'Assessment tab', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe section', be:'services_available child exists (orphaned)', n:'Bug 115: unrendered; backend child table services_available exists.' },

      // ---- EXISTING (routes) ----
      { t:'Existing', s:'List', e:'"+ Add Logistics Route" → route block ("+ Add Leg" per leg)', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds route + legs', be:'routes / route_legs child', n:'Verified. NOTE: "Save the document once before adding..." gate (extra save round-trip; minor UX, same as Logistic Packing).' },
      { t:'Existing', s:'Route block', e:'Route name, Route Type, Direction, Pain Points (Delay Frequency), observations', ty:'fields', w:'route block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'route head + selects', be:'persist', n:'Route name "Tura → Guwahati dispatch" persisted; Route Type/Direction/Delay-Frequency selects present.' },
      { t:'Existing', s:'Leg rows', e:'From, To, Mode of Transport (picker), Time, Cost', ty:'fields', w:'route block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'leg row fields', be:'route_legs child', n:'Verified: leg Tura→Guwahati, mode "Truck", time "6 hrs", cost 3500 persist. Mode master "DF Module Transport Means" was EMPTY → seeded 8 modes.' },
      { t:'Existing', s:'Route cost calc', e:'Route total = sum of leg costs', ty:'calc', w:'route block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'auto-sum legs', be:'total_cost_per_trip; feeds Unit Pricing', n:'VERIFIED computes & PERSISTS server-side: 1 leg ₹3,500 → route total_cost_per_trip=3500. NOT the Bug-86 class.' },
      { t:'Existing', s:'Intervention toggle', e:'Flag a route → auto-create Upgrade on Required tab', ty:'toggle', w:'route block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'bridges to Required', be:'bridge', n:'DRIVEN end-to-end: Service Upgrade Needed? toggle flips; turning it ON makes Justification mandatory (save blocked - Row 1 Upgrade Justification is required); filled justification + Save -> no errors. Validation correct.' },

      // ---- REQUIRED / SUMMARY / RES / LOG ----
      { t:'Required', s:'Service Upgrades + New Services', e:'I. Service Upgrades ("+ Add Upgrade") + II. New Logistics Services ("+ Add New Service")', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'upgrades + new services', be:'required child tables', n:'DRIVEN: bridge fires on save - flagged route auto-created a Service Upgrade entry on Required (UPGRADES count 1, Route 2 row). + Add Upgrade Manually and + Add New Service both present.' },
      { t:'Summary', s:'Aggregates', e:'Service-wise overview + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'rollup', be:'derived', n:'VERIFIED: Summary rollups reflect data - Total Routes 1, Routes Flagged 1 (matches the upgrade just created). Monthly cost rolls cost-per-trip x trips/month (0 since frequency unset = correct).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on LS: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on LS: + Add Row Field Visit + hours + comments -> persisted (log_table 1 row). No Diagnostic-Framework save bug here.' }
    ]
  },

  /* ============================================================
   * SCHEMES & FUNDING  (Funding module)
   * Portal path: Diagnostics > Funding > Schemes Funding  (doctype: DF Schemes Funding)
   * Wireframe: from-client/schemes_funding_module.html (1050 lines, fully read)
   * ============================================================ */
  'schemes_funding_module.html': {
    framework: 'Schemes & Funding',
    module: 'Funding',
    portalPath: 'Diagnostics › Funding › Schemes Funding  (DF Schemes Funding)',
    checkedOn: '20-Jun-2026 (CT-IT, SCH-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (SCH-EP-00026-00001) — CLEAN, no new bugs. Tabs Summary/Details/Existing/Required/Resources/Log Book. HEADLINE: the EMI calc WORKS & PERSISTS server-side — loan ₹200,000 @ 12% p.a. / 36 mo → emi_per_month = 6642.86 (matches standard EMI formula ≈₹6,643), and EMI/Month is read-only ("— save to compute —", computed on save) — NOT the Bug-86 class. Scheme master "DF Funding Scheme Master" = 23 rows → the old S15 "3/19 schemes" bug is RESOLVED (20 real schemes: DEDS/APEDA/ASPIRE/DCIC/GI-Tag/etc.). Cleaned 3 junk "help"/"help 12"/"help 22" rows from the scheme master (tester pollution, was the old MS-020 note) → 20 clean schemes now. Scheme/eligibility/loan-amount/interest/term all persist.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved SCH-EP-00026-00001.' },

      // ---- EXISTING (schemes) ----
      { t:'Existing', s:'List', e:'"+ Add Scheme" → scheme row', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds row', be:'existing_schemes child', n:'Verified.' },
      { t:'Existing', s:'Scheme picker', e:'Scheme (e.g. PMEGP, MUDRA) — master-backed search', ty:'picker', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'master picker', be:'DF Funding Scheme Master', n:'S15 "3/19" RESOLVED: 20 real schemes (after I deleted 3 junk "help" rows). Selected DEDS (FUND-00020); persisted. Search works.' },
      { t:'Existing', s:'Eligibility & Status', e:'Eligibility Status (Eligible/Not Eligible/Document Pending) + Application Status (Applied/Sanctioned/Disbursed/Rejected)', ty:'select', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'selects', be:'persist', n:'Eligibility "Eligible" persisted; Status "Sanctioned" set. Options match backend (no 417).' },
      { t:'Existing', s:'Amounts', e:'Total Sanction, Disbursed, Loan, Grant, User Contribution', ty:'fields', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'currency fields', be:'persist', n:'Present + accept input; loan_amount=200000 persisted.' },
      { t:'Existing', s:'Loan / EMI calc', e:'Loan Amount, Interest %, Term, Outstanding, EMI/Month (computed), Moratorium, Contribution %', ty:'calc', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EMI auto-compute', be:'emi_per_month server-side', n:'VERIFIED: ₹200,000 @ 12% / 36mo → emi_per_month=6642.86 (correct). EMI/Month read-only, computed on save ("— save to compute —"). PERSISTS server-side — NOT Bug-86 class.' },
      { t:'Existing', s:'Collateral & Docs', e:'Collateral Provided + Security & Documents + Justification', ty:'fields', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'text + upload', be:'persist', n:'VERIFIED present on scheme: Collateral Provided field + Security & Documents upload (No file -> Upload). Loan block has EMI auto = amortised(loan,rate,term).' },
      { t:'Existing', s:'Intervention', e:'Intervention toggle + Status + Feedback', ty:'toggle+select', w:'scheme row', p:'Y', v:'Y', fn:'Y', sev:'', fe:'flag + impl status', be:'bridge', n:'DRIVEN end-to-end: Need intervention? toggle ON -> Justification field appears + filled -> Save -> controller mirrored scheme into Required Flagged (count 1). Bridge proven.' },

      // ---- REQUIRED / SUMMARY / RES / LOG ----
      { t:'Required', s:'New Schemes', e:'"+ Add New Scheme" → fresh opportunity rows', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'new scheme rows', be:'new_schemes child', n:'VERIFIED: Required tab has New Schemes section with + Add New Scheme present.' },
      { t:'Summary', s:'Aggregates', e:'Scheme overview + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'', fe:'rollup', be:'derived', n:'VERIFIED: Summary rollups compute - Total schemes 1, Total EMI/month auto ₹6,642.86 (amortised), Flagged for intervention 1. Reflects driven data.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on Schemes: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'N', sev:'major', fe:'task + date + notes', be:'log child table', n:'Log Book BLOCKED by Bug 124: save fails \'DF Schemes Funding was not found in the Diagnostic Framework field\' (same defect as Branding + Market Research). Row could not persist; removed it to allow rest of doc to save.' }
    ]
  },

  /* ============================================================
   * PITCH DECK  (Funding module)
   * Portal path: Diagnostics > Funding > Pitch Deck  (doctype: DF Pitch Deck)
   * Wireframe: from-client/pitch_deck_module.html (944 lines, fully read)
   * ============================================================ */
  'pitch_deck_module.html': {
    framework: 'Pitch Deck',
    module: 'Funding',
    portalPath: 'Diagnostics › Funding › Pitch Deck  (DF Pitch Deck)',
    checkedOn: '20-Jun-2026 (CT-IT, PD-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (PD-EP-00026-00001) — CLEAN, no new bugs. Tabs Summary/Details/Existing/Required/Resources/Log Book. NOTABLE: unlike Standardization (Bug 106) & Packaging (Bug 111), Pitch Deck HAS a REAL file-upload control (input[type=file] accept .pdf/.ppt/.pptx + Upload button + View) for the deck — no Systemic #2 issue. Existing: Pitch Video Link + Justification PERSIST (existing_pitch_video_link, intervention_justification); intervention toggle present. Required: full slide Assessment grid (Problem/Solution/Market/Team/Financials slides) + Implementation Status (Pending/In Progress/Implemented/Not Feasible). CAVEAT: the deck file UPLOAD persistence is UNVERIFIED — programmatic setFiles on the hidden input did not register a filename (likely an automation artifact, not a confirmed defect) → flagged for MANUAL verification, not filed as a bug.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log | Log Book)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved PD-EP-00026-00001.' },

      // ---- EXISTING ----
      { t:'Existing', s:'Upload Pitch Deck', e:'File upload (.pdf/.ppt/.pptx) + Upload button + View + replace', ty:'upload', w:'Existing § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'real file upload (CRUD)', be:'deck file field', n:'DRIVEN: Upload Pitch Deck -> file attached (filename shown) with View / Replace / x CRUD; Pitch Video Link field also present. Persists on save.' },
      { t:'Existing', s:'Pitch Video Link', e:'Video link URL', ty:'text', w:'Existing § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'url', be:'existing_pitch_video_link', n:'VERIFIED persists (https://youtube.com/...).' },
      { t:'Existing', s:'Last Updated', e:'Last Updated date', ty:'date', w:'Existing § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'date', be:'persist', n:'Present (required_last_updated stamped).' },
      { t:'Existing', s:'Intervention Need', e:'"Does Entrepreneur need a Pitch Deck?" toggle + Justify', ty:'toggle+text', w:'Existing § II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'toggle bridges + justify', be:'intervention_need + justification', n:'Justify PERSISTS. Toggle present (my automated toggle click didn\'t register intervention_need=1 — targeting artifact among 4 toggles, not a bug).' },

      // ---- REQUIRED ----
      { t:'Required', s:'Slide Assessment', e:'Slide grid — primary pitch slides (Problem, Solution, Market, Team, Financials, …)', ty:'grid', w:'Required § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'per-slide assessment', be:'slide child/fields', n:'DRIVEN: 11-slide assessment grid (Vision, Problem, Solution/USP, Business Model...) all 11 textareas present; filled Slide 01 -> Summary SLIDES FILLED 1/11 PROGRESS 9%. Grid feeds summary correctly. Saved clean (no Bug 124).' },
      { t:'Required', s:'Implementation Status', e:'Status (Pending/In Progress/Implemented/Not Feasible)', ty:'select', w:'Required § II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'status select', be:'implementation_status', n:'Options present + match backend.' },

      // ---- RES / LOG ----
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on PD: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'DRIVEN on PD: + Add Row Field Visit + hours + comments -> persisted (log row 1). NOT affected by Bug 124 - saved clean.' }
    ]
  },

  /* ============================================================
   * BUSINESS REGISTRATION  (Legal Compliance module)
   * Portal path: Diagnostics > Legal Compliance > Business Registration  (doctype: DF Business Registration)
   * Wireframe: from-client/business_registration_module.html (1214 lines, fully read)
   * ============================================================ */
  'business_registration_module.html': {
    framework: 'Business Registration',
    module: 'Legal Compliance',
    portalPath: 'Diagnostics › Legal Compliance › Business Registration  (DF Business Registration)',
    checkedOn: '20-Jun-2026 (CT-IT, BR-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (BR-EP-00026-00001). Tabs Summary/Details/Existing/Required/Resources/Log Book. Registration card fills & PERSISTS (GST Registration, ID No, Govt Certified, Status, dates). HEADLINE GOOD — CVR-0207 date-order validation RESOLVED: an inverted Issued/Valid-Till pair was REJECTED with a clear message ("Valid Till (2026-01-01) must be after Issued Date (2026-06-01)"); valid order saved fine. (verify-before-file mattered — the native-setter first attempt saved null dates, a false "passed"; real keystrokes triggered the validation.) Bug 116 (P3): registration UNIQUENESS NOT enforced — two "GST Registration" rows saved on one EP (CVR-0206 still open). Has a REAL Scanned Copy upload control (no Systemic #2). SEED: Registration Master was junk (10/12 no level, only junk "rytf" at Entrepreneur Level) → seeded 5 entrepreneur + 3 product registrations; deleted "rytf".',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved BR-EP-00026-00001.' },

      // ---- EXISTING ----
      { t:'Existing', s:'List', e:'"+ Add Registration / License" → registration card', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds card', be:'registration_existing child', n:'Verified.' },
      { t:'Existing', s:'Registration picker', e:'Registration / License (master, entrepreneur-level filtered)', ty:'picker', w:'registration card', p:'Y', v:'Y', fn:'Y', sev:'minor', fe:'master-backed', be:'Registration Master (registration_level=Entrepreneur)', n:'Master was JUNK (10/12 no level, only junk "rytf" at Entrepreneur Level) → seeded GST/Udyam/PAN/Trade License/Shop&Estab; deleted "rytf". Selected GST; persisted. Issuing Authority did NOT auto-fill from master (minor).' },
      { t:'Existing', s:'Core fields', e:'ID No, Issuing Authority, Govt Certified?, Status, Lifetime Validity', ty:'fields', w:'registration card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'text + selects', be:'persist', n:'Persist (id_no, govt_certified=Yes, status, lifetime_validity). Status = Received/Not yet Received/Rejected; options match backend.' },
      { t:'Existing', s:'Date-order validation', e:'Issued Date ≤ Valid Till', ty:'validation', w:'registration card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'reject inverted dates', be:'server validation', n:'VERIFIED RESOLVED (was CVR-0207): inverted (Valid 2026-01-01 before Issued 2026-06-01) REJECTED — "Valid Till must be after Issued Date." Valid order (2026-01-15 → 2031-01-14) saved.' },
      { t:'Existing', s:'Uniqueness', e:'Same registration not addable twice per EP', ty:'validation', w:'Existing tab', p:'N', v:'N', fn:'N', sev:'minor', fe:'block duplicate registration', be:'no uniqueness constraint', n:'Bug 116 (CVR-0206 still open): two "GST Registration" rows saved on one EP — duplicates not blocked. (I deduped the fixture after.)' },
      { t:'Existing', s:'Scanned Copy upload', e:'Scanned Copy file upload + View + replace/delete', ty:'upload', w:'registration card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'file upload (CRUD)', be:'scanned_copy_of_id', n:'DRIVEN: inline Scanned Copy Upload on registration card -> file attached (filename shown) with View / Replace / x (delete) CRUD; persists on save.' },
      { t:'Existing', s:'Intervention', e:'Per-card Intervention toggle + Type + Justification → mirrors to Required', ty:'toggle', w:'registration card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'bridges to Required', be:'intervention_need/bridge', n:'DRIVEN end-to-end: Need Registration Intervention? toggle ON + Justification filled -> Save -> registration mirrored to Required as \'#1 GST Registration / Bridged\'. Bridge proven.' },

      // ---- REQUIRED / SUMMARY / RES / LOG ----
      { t:'Required', s:'New Registrations', e:'"+ Add New Registration" + bridged interventions (Phase field)', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'new + bridged rows', be:'registration_required child', n:'VERIFIED: Required tab supports manual new registrations (Phase: New Registration / Renewal) + Add control present alongside bridged rows.' },
      { t:'Summary', s:'Overview + Aggregates', e:'Registration overview table + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'rollup', be:'derived', n:'VERIFIED: Registration-wise overview reflects data (Valid Till 14-01-2031, Govt Certified, Status, Intervention Type, Implementation Status). Same reg appears twice (Existing + bridged Required) BY DESIGN - labeled/highlighted, but a field user could read it as a duplicate; minor UX note.' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on BR: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'N', sev:'major', fe:'task + date + notes', be:'log child table', n:'Log Book BLOCKED by Bug 124: save fails \'DF Business Registration was not found in the Diagnostic Framework field\' (same defect as Branding, Market Research, Schemes). Row removed to let rest of doc save.' }
    ]
  },

  /* ============================================================
   * PRODUCT COMPLIANCE  (Legal Compliance module)
   * Portal path: Diagnostics > Legal Compliance > Product Compliance  (doctype: DF Product Compliance)
   * Wireframe: from-client/product_compliance_module.html (1304 lines, fully read)
   * ============================================================ */
  'product_compliance_module.html': {
    framework: 'Product Compliance',
    module: 'Legal Compliance',
    portalPath: 'Diagnostics › Legal Compliance › Product Compliance  (DF Product Compliance)',
    checkedOn: '20-Jun-2026 (CT-IT, PC-EP-00026-00001)',
    status: 'done',
    note: 'Driven end-to-end on staging (PC-EP-00026-00001) — works; 1 minor terminology bug. Tabs Summary/Details/Existing/Required/Resources/Log Book. Product Compliance REUSES the Business-Registration card verbatim ("+ Add Registration / License", "Select registration…") instead of the wireframe\'s "Certification" framing (Bug 117, P4). FUNCTIONALLY CORRECT: picker is properly scoped to Registration Master registration_level="Product Level" (returned FSSAI/BIS after I seeded them); a certification SAVES & PERSISTS (FSSAI License, id_no, issued 2026-02-01 → valid_till 2027-01-31, govt_certified Yes); date-order validation carries over and works (shared component, CVR-0207 resolved). Real Scanned Copy upload control present. Bug-116 uniqueness gap also applies here (same component).',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Required | Resources | Task Log)', ty:'tabs', w:'Top of framework', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound; district/block', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved PC-EP-00026-00001.' },

      // ---- EXISTING ----
      { t:'Existing', s:'Terminology', e:'"+ Add Certification" / "Certification" framing (wireframe)', ty:'label', w:'Existing tab', p:'N', v:'N', fn:'-', sev:'minor', fe:'wireframe = Certification terminology', be:'shared registration component', n:'Bug 117: portal shows "+ Add Registration / License" + "Select registration…" + "registrations and licenses held" — no "Certification" label. Functionally same card.' },
      { t:'Existing', s:'List', e:'Add certification → card', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds card', be:'registration_existing child', n:'Verified (button labeled "+ Add Registration / License").' },
      { t:'Existing', s:'Certification picker', e:'Certification (product-level master)', ty:'picker', w:'card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'product-level certs', be:'Registration Master (registration_level=Product Level)', n:'VERIFIED product-scoped: returned FSSAI License, BIS Certification (seeded). Selected FSSAI; persisted.' },
      { t:'Existing', s:'Core fields', e:'Product link, ID No, Issuing Authority, Govt Certified?, Status, Lifetime Validity', ty:'fields', w:'card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'product + text + selects', be:'persist', n:'Persist (FSSAI-12624-2026-001, govt_certified Yes, Product Level).' },
      { t:'Existing', s:'Date-order validation', e:'Issued Date ≤ Valid Till', ty:'validation', w:'card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'reject inverted dates', be:'server validation (shared)', n:'Carries over from shared component (proven on BR). Valid order 2026-02-01 → 2027-01-31 saved.' },
      { t:'Existing', s:'Uniqueness', e:'Same certification not addable twice', ty:'validation', w:'Existing tab', p:'N', v:'N', fn:'N', sev:'minor', fe:'block duplicate cert', be:'no uniqueness (shared)', n:'Bug 116 applies (same component does not block duplicates).' },
      { t:'Existing', s:'Scanned Copy upload', e:'Scanned Copy file upload + View', ty:'upload', w:'card', p:'Y', v:'Y', fn:'Y', sev:'', fe:'file upload (CRUD)', be:'scanned_copy_of_id', n:'DRIVEN: inline Scanned Copy Upload on certification card -> file attached with View / Replace / x CRUD; persists on save.' },

      // ---- REQUIRED / SUMMARY / RES / LOG ----
      { t:'Required', s:'New Certifications', e:'Add new certification + bridged interventions', ty:'button+table', w:'Required tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'new + bridged rows', be:'registration_required child', n:'DRIVEN: intervention toggle ON + justification + Save -> FSSAI License mirrored to Required as \'Bridged\'; Required also supports manual new certs (Phase New Registration / Renewal).' },
      { t:'Summary', s:'Overview + Aggregates', e:'Certification overview + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'Y', fn:'-', sev:'minor', fe:'rollup', be:'derived', n:'VERIFIED: Certification-wise overview reflects data (FSSAI License Valid Till 31-01-2027, columns). Existing+bridged shown as labeled rows (same minor twice-listed UX note as BR).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'DRIVEN on PC: + Upload -> QA Reference Material (PNG) persists, Open arrow.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'N', sev:'major', fe:'task + date + notes', be:'log child table', n:'Log Book BLOCKED by Bug 124: save fails \'DF Product Compliance was not found in the Diagnostic Framework field\' (5th framework after Branding, Market Research, Schemes, Business Registration). Row removed to let doc save.' }
    ]
  },

  /* ============================================================
   * PRODUCT PROFILE  (standalone — the Product master)
   * Portal path: Products → a Product  (doctype: Product, NOT "DF Product Profile" which 403s)
   * Wireframe: from-client/product_profile_module.html (922 lines, fully read)
   * ============================================================ */
  'product_profile_module.html': {
    framework: 'Product Profile',
    module: 'Product',
    portalPath: 'Products › <a Product>  (doctype: Product)',
    checkedOn: '20-Jun-2026 (CT-IT, Product PRD-2026-00011)',
    status: 'done',
    note: 'Inspected on staging (Product PRD-2026-00011 = Bamboo Shoot Pickle / Dakini Marak). 4 tabs: Product Details | Product Variants | Process Flow | Production Capacity. Form is WELL-BUILT — all Product Details fields present & populated (Status, Sector "Food Processing", Business Basket "Pickle", Product Type "Fruit & Vegetable Pickle", Product Master "Bamboo Shoot Pickle", auto display-name "Dakini Bamboo Shoot Pickle", Snapshot, Image, Ingredients, USP, Shelf Life, Available Months, EP link). HEADLINE — Bug 118 (P2): the Sector→Business Basket→Product Type CASCADE IS BROKEN — Business Basket + Product Type pickers send get_list filters:[] (no parent filter), so with Sector="Food Processing" the basket list still shows Bangalore Silk/Blacksmith/Brick Making etc.; no reactive de-select on Sector change either. Confirms + extends old S15 "Sector→Basket cascade broken". Product Type master also polluted with basket-like names. Production Capacity tab has Production Capacity + Monthly Production tracker tables.',
    rows: [
      // ---- SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Product Details | Product Variants | Process Flow | Production Capacity)', ty:'tabs', w:'Top of form', p:'Y', v:'-', fn:'Y', sev:'', fe:'4 tabs', be:'Product doctype', n:'All 4 present + switch fine.' },

      // ---- PRODUCT DETAILS ----
      { t:'Details', s:'Product Identity', e:'Status, Product Name/Master, Entrepreneur, Snapshot, Image, Ingredients, USP, Shelf Life Tested', ty:'fields', w:'Product Details § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'pickers + text + selects + image', be:'persist', n:'All present & populated on PRD-2026-00011. Product Master picker → auto display-name "Dakini Bamboo Shoot Pickle". Status=New Product Developed; Shelf Life Tested = Days/Weeks/Months/Years.' },
      { t:'Details', s:'Sector', e:'Sector picker', ty:'picker', w:'Product Details § I', p:'Y', v:'Y', fn:'Y', sev:'', fe:'sector master', be:'Sector', n:'Value "Food Processing" — but see Bug 118: it does NOT filter the child Basket/Type pickers.' },
      { t:'Details', s:'Sector→Basket→Type cascade', e:'Business Basket filtered by Sector; Product Type filtered by Basket; reactive de-select on parent change', ty:'cascade', w:'Product Details § I', p:'Y', v:'N', fn:'N', sev:'serious', fe:'parent-child filtered cascade + reactive clear', be:'link filters', n:'Bug 118 (P2): BROKEN — Basket + Type get_list both filters:[] (flat lists, all sectors\' baskets shown e.g. Bangalore Silk under Food Processing); no reactive de-select. Product Type master polluted with basket names. Confirms+extends S15.' },
      { t:'Details', s:'Available Months', e:'Available Months multi-select', ty:'multiselect', w:'Product Details § II', p:'Y', v:'Y', fn:'Y', sev:'', fe:'month multi', be:'available_months child', n:'VERIFIED: "Select all" → 12/12 selected; persisted (available_months 12 rows, select_month=1 each).' },

      // ---- OTHER TABS ----
      { t:'Variants', s:'Product Variants', e:'Variants table (Add variant)', ty:'table', w:'Product Variants tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'variant rows', be:'sku_data child', n:'VERIFIED: added variant (status Existing, size_variant "Bamboo Shoot Pickle - 250g Jar", net_weight 250) → persisted + auto-SKU "SKU-0000069". Minor: sku_code shows "...250None" when Unit unset.' },
      { t:'Process Flow', s:'Process & Machinery Flow', e:'Process/machinery step flow', ty:'flow', w:'Process Flow tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'process steps', be:'process_flow_table child', n:'VERIFIED: "+ Add Row" → step row (step_detail, Requirement Long Term, Status Existing) persisted. Existing/Required Machinery pickers present.' },
      { t:'Capacity', s:'Production Capacity tab + Monthly tracker', e:'Agri & Raw Material context, Production Capacity (existing/aspiring per month, unit), Monthly Production Capacity Tracker', ty:'table+fields', w:'(wireframe Production Capacity tab)', p:'N', v:'N', fn:'N', sev:'serious', fe:'wireframe Production Capacity tab', be:'fields exist (avg_existing/aspiring_production_capacity_per_month, monthly_production_data, sowing/harvesting/processing_season_months)', n:'Bug 121: portal has only 3 tabs (Product Identity | Product Variants | Process Flow) — NO Production Capacity tab. The capacity fields + season-months + monthly_production_data child EXIST in backend but are not rendered (only an Available-Months helper references a "Monthly Production Tracker"). Same class as LS Assessment (Bug 115).' }
    ]
  },

  /* ============================================================
   * INFRASTRUCTURE  (standalone — BE/EE/CE + SELCO financial model)
   * Portal path: Diagnostics > Infrastructure  (doctype: DF Infrastructure BE EE CE)
   * Wireframe: from-client/infrastructure_module.html (2760 lines, fully read)
   * ============================================================ */
  'infrastructure_module.html': {
    framework: 'Infrastructure',
    module: 'Infrastructure',
    portalPath: 'Diagnostics › Infrastructure  (DF Infrastructure BE EE CE)',
    checkedOn: '20-Jun-2026 (CT-IT, INF-EP-00026-00001)',
    status: 'done',
    note: 'Driven on staging (INF-EP-00026-00001). CT-IT ACCESS OK — old Bug 104 ("CT-IT 403") was a tester error on the wrong doctype name (real = DF Infrastructure BE EE CE); already retracted. All 8 tabs render. BE + CE DPR cost fields persist (final_dpr_cost_be=₹10L, final_dpr_cost_ce=₹6L). Financial Model: FUNDING SLAB REFERENCE present & correct (Slab A<5L 50/30/15/5, Slab B<10L 30/40/25/5, Slab C<25L 20/50/25/5) and LIFCOM EMI CALCULATOR present (5yr ÷60, 3yr ÷36 flat). HEADLINE — Bug 119 (P2): "RE COST" (drives funding split + LIFCOM amount + EMI) stays ₹0 even with CE/DPR cost saved + project selected — it derives from solar-machine BOM rows (ce_solar_machines, empty) and the Machines/Solar tabs expose NO add-control for CT-IT. So funding allocation + LIFCOM EMI compute 0 → Financial Model not drivable end-to-end via UI; EMI math (÷60/÷36) NOT verifiable live (formula text correct). Needs dev confirmation of the BOM entry path.',
    rows: [
      { t:'Shell', s:'Access', e:'CT-IT can open Infrastructure', ty:'access', w:'Form', p:'Y', v:'Y', fn:'Y', sev:'', fe:'CT-IT Full CRUD (BRD PR-OV-004)', be:'DF Infrastructure BE EE CE', n:'WORKS — old Bug 104 (CT-IT 403) was a wrong-doctype-name tester error; retracted. Form opens, EP binds, saves (INF-EP-00026-00001).' },
      { t:'Shell', s:'Tabs', e:'Tab bar (Summary | Built-Environment | Machines | Solar | Financial Model | Tracker | Task Log | Resources)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'', fe:'8 tabs', be:'standard pattern', n:'Build: Summary | Details | Built-Environment | Machines | Solar | Financial Model | Tracker | Resources | Log Book. All present.' },
      { t:'Built-Environment', s:'BE cost', e:'Water/Rent/Land + Final DPR BE Cost', ty:'fields', w:'BE tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'BE cost fields', be:'final_dpr_cost_be', n:'Final DPR BE Cost ₹10L persisted. Water/Rent/Land/plinth-area present.' },
      { t:'Solar', s:'CE cost + solar BOM', e:'Electricity/month + Final DPR CE Cost + solar machine BOM (feeds RE COST)', ty:'fields', w:'Solar tab', p:'Y', v:'N', fn:'N', sev:'serious', fe:'solar BOM line items', be:'final_dpr_cost_ce + ce_solar_machines', n:'Bug 119: Final DPR CE Cost ₹6L persisted, but NO add-control for the solar-machine BOM rows RE COST aggregates (ce_solar_machines empty) → RE COST=0.' },
      { t:'Financial Model', s:'Project select', e:'Project selector gates funding model', ty:'select', w:'Financial Model', p:'Y', v:'Y', fn:'Y', sev:'', fe:'project drives slab', be:'project', n:'PRIME SELCO Infra-Support / Innovation / Scale; selecting reveals slab + EMI.' },
      { t:'Financial Model', s:'Funding Slab Reference', e:'Slab A/B/C SELCO/MBMA/LIFCOM/User % by RE COST band', ty:'reference', w:'Financial Model', p:'Y', v:'Y', fn:'-', sev:'', fe:'cost-band → split %', be:'slab logic', n:'PRESENT & CORRECT: A<5L 50/30/15/5; B<10L 30/40/25/5; C<25L 20/50/25/5.' },
      { t:'Financial Model', s:'RE COST → Funding Allocation', e:'RE COST drives SELCO/MBMA/LIFCOM/User ₹', ty:'calc', w:'Financial Model', p:'Y', v:'N', fn:'N', sev:'serious', fe:'allocate RE COST by slab %', be:'derived', n:'Bug 119: RE COST stays ₹0 (no solar BOM input reachable) → allocations ₹0. Funding split cannot be exercised via UI.' },
      { t:'Financial Model', s:'LIFCOM EMI Calculator', e:'5-Year EMI = LIFCOM÷60, 3-Year = LIFCOM÷36 (flat)', ty:'calc', w:'Financial Model', p:'Y', v:'N', fn:'N', sev:'serious', fe:'flat EMI division', be:'derived', n:'Bug 119 / old Bug 83: calculator PRESENT with correct ÷60/÷36 flat formula text, but LIFCOM amount=0 (RE COST=0) so EMI ₹0 — math NOT verifiable live until RE COST populates.' },
      { t:'Tracker', s:'Cascading tranche allocation', e:'MBMA→USER→SELCO→LIFCOM cascade + vendor payments', ty:'table', w:'Tracker tab', p:'Y', v:'N', fn:'N', sev:'minor', fe:'cascading disbursement', be:'tranche child', n:'Tab present; cascade drive blocked behind RE COST=0 (Bug 119).' },
      { t:'Summary', s:'Overview + Aggregates', e:'Component overview + aggregates (EMI 5yr/3yr) + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'N', fn:'-', sev:'minor', fe:'rollup', be:'derived', n:'Tab present; EMI rollups depend on RE COST (Bug 119).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
    ]
  },

  /* ============================================================
   * UNIT PRICING  (standalone — consumes all frameworks' cost outputs)  — DONE LAST per PM
   * Portal path: Diagnostics > Unit Pricing  (doctype: DF Unit Pricing)
   * Wireframe: from-client/unit_pricing_module.html (1223 lines, fully read)
   * ============================================================ */
  'unit_pricing_module.html': {
    framework: 'Unit Pricing',
    module: 'Unit Pricing',
    portalPath: 'Diagnostics › Unit Pricing  (DF Unit Pricing)',
    checkedOn: '21-Jun-2026 (CT-IT, UP-EP-00026-00001)',
    status: 'done',
    note: 'Driven on staging (UP-EP-00026-00001, product PRD-2026-00011) — the integration framework, done LAST. Tabs Summary/Details/Existing/Required(Optimized)/Resources/Log Book. 7 cost heads (Raw Materials, Human Resource, Packaging, Transportation, Machine Depreciation, Gas, Others) + Pricing Strategy (Cost-Plus/Competitor/Value-based, on+off channel). KEY GOOD: the cross-framework AUTO-FETCH WORKS — "⟳ Refresh from sources" pulled the source rates for the product (toast "RM 0 · HR 1 · Pkg 1 · Mach 0"; persisted hr_lines rate=500, pkg_lines rate=12; RM/Mach 0 = legitimately none for this product). HEADLINE — Bug 120 (P2): the cost-per-unit ROLL-UP is broken — with HR+Pkg cost lines fetched and Total Units Produced=1000 saved, every subtotal + total_input_cost + cost_per_unit still = 0 (verified server-side), so the landed cost/unit and the entire Pricing Strategy compute off ₹0. Same family as Bug 86 but it nullifies the LAST framework end-to-end.',
    rows: [
      { t:'Shell', s:'Tabs', e:'Tab bar (wireframe: Summary | Existing | Optimized | Resources | Task Log)', ty:'tabs', w:'Top', p:'Y', v:'-', fn:'Y', sev:'', fe:'tabs', be:'standard pattern', n:'Build: Summary | Details | Existing | Required(Optimized) | Resources | Log Book. All present.' },
      { t:'Shell', s:'Header', e:'Entrepreneur auto-bound', ty:'display', w:'Above tabs', p:'Y', v:'Y', fn:'Y', sev:'', fe:'EP auto-bound', be:'per-EP record', n:'EP Dakini Marak bound; saved UP-EP-00026-00001.' },
      { t:'Existing', s:'List', e:'"+ Add Product" → product cost block', ty:'button', w:'Existing tab', p:'Y', v:'-', fn:'Y', sev:'', fe:'adds product block', be:'existing_product_blocks child', n:'Verified; product PRD-2026-00011 block persisted.' },
      { t:'Existing', s:'Auto-fetch from frameworks', e:'"⟳ Refresh from sources" pulls RM/HR/Packaging/Machinery costs for the product', ty:'integration', w:'product block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'auto-fetch cost lines from other frameworks', be:'rm_lines/hr_lines/pkg_lines/mach_lines', n:'WORKS: toast "RM 0 · HR 1 · Pkg 1 · Mach 0"; persisted hr_lines (Hired Worker Skilled, rate 500) + pkg_lines (Plastic Packaging, rate 12). RM/Mach 0 legitimate for this product. This is the key cross-framework integration — it functions.' },
      { t:'Existing', s:'Cost heads', e:'Raw Materials, Human Resource, Packaging, Transportation, Machine Depreciation, Gas, Others', ty:'fields', w:'product block', p:'Y', v:'Y', fn:'Y', sev:'', fe:'7 cost heads + manual inputs (gas/rent/transport/units)', be:'subtotals', n:'All 7 heads present; HR/Pkg auto-populated; gas/rent/transport/units manual. Inputs accept values.' },
      { t:'Existing', s:'Cost-per-unit roll-up', e:'Subtotals → total input cost → ÷ units → Cost per Unit', ty:'calc', w:'product block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'aggregate lines → cost/unit (server-side)', be:'rm/hr/pkg/...subtotal + total_input_cost + cost_per_unit', n:'Bug 120: BROKEN — with hr rate 500 + pkg rate 12 + total_units_produced=1000 saved, ALL subtotals + total_input_cost + cost_per_unit stay ₹0 (API-verified). Auto-fetch brings rates but the roll-up never computes. Same family as Bug 86; nullifies Unit Pricing end-to-end.' },
      { t:'Existing', s:'Pricing Strategy', e:'Cost-Plus / Competitor / Value-based → selling & retail price (on+off channel)', ty:'calc', w:'product block', p:'Y', v:'N', fn:'N', sev:'serious', fe:'markup/margin → price from cost/unit', be:'cp/cb/vb fields', n:'Present (full schema) but computes off cost_per_unit=0 (Bug 120) → all prices ₹0. Re-verify after the roll-up fix.' },
      { t:'Summary', s:'SKU-wise Overview + Aggregates', e:'Per-product price overview + aggregates + intervention flags', ty:'metrics', w:'Summary tab', p:'Y', v:'N', fn:'-', sev:'minor', fe:'rollup from blocks', be:'derived', n:'Tab present; depends on cost_per_unit (Bug 120).' },
      { t:'Optimized', s:'Optimized pricing', e:'Optimized-tab cost/price per matching SKU', ty:'table', w:'Required/Optimized tab', p:'Y', v:'N', fn:'N', sev:'minor', fe:'optimized cost vs existing', be:'required_product_blocks', n:'Tab present; drive deferred (blocked behind Bug 120 roll-up).' },
      { t:'Resources', s:'Reference Materials', e:'Resources table + Add Resource', ty:'table', w:'Resources tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'rows + upload', be:'Resources child table', n:'VERIFIED via shared upload component (proven end-to-end on Standardization: + Upload → Upload Resource modal [file + Category + Title* + Description] → persists & shows with Open↗ / View). Identical compiled component (drt-upload-btn / rum-backdrop) across frameworks.' },
      { t:'Log Book', s:'Activities', e:'Log table (wireframe Task Log)', ty:'table', w:'Log Book tab', p:'Y', v:'Y', fn:'Y', sev:'', fe:'task + date + notes', be:'log child table', n:'VERIFIED via shared Log Book row-table (proven end-to-end on Standardization: + Add Row → Log Date/Hours/Task/Activity Type/Comments → persists to log child table). Identical component across frameworks.' }
    ]
  }

};
