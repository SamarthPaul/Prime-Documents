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
    portalPath: 'Diagnostics › Raw Materials  (DF Raw Material)',
    checkedOn: '',                 // stamped after staging verification
    status: 'inventory-only',      // inventory-only | verifying | done
    note: 'Inventory complete from the wireframe. Staging verification pending — every "?" below is a checkpoint still to be driven on staging as Core Team IT.',
    rows: [
      // ---- FRAMEWORK SHELL ----
      { t:'Shell', s:'Tabs', e:'Tab bar: Summary | Existing | Required | Resources | Task Log', ty:'tabs', w:'Top of framework', p:'?', v:'-', fn:'?', sev:'serious',
        fe:'HTML shows 5 tabs in this order', be:'BRD standard pattern: Summary › Data tabs › (Log Book) › Resources; Task tab removed (Activity Logger handles tasks). NB wireframe has "Task Log" tab — reconcile vs BRD "Task tab removed".', n:'' },
      { t:'Shell', s:'Header', e:'Entrepreneur chip "Auto-fetched from profile"', ty:'display', w:'Above tabs', p:'?', v:'?', fn:'-', sev:'minor',
        fe:'HTML: chip shows EP name auto-fetched', be:'BRD: framework is filled per-entrepreneur; EP context auto-bound', n:'' },

      // ---- SUMMARY TAB ----
      { t:'Summary', s:'Material-wise Overview', e:'Overview table — 10 cols (Product, Raw Material, Source, Availability, Essential, Price/Unit, Intervention Type, Implementation Status, New Price/Unit, Saving)', ty:'table', w:'Summary tab', p:'?', v:'?', fn:'?', sev:'serious',
        fe:'HTML: auto-populated from Existing + Required; one row per material; New Price/Unit + Saving populate only when an intervention is in progress', be:'BRD: each row feeds Unit Pricing individually', n:'' },
      { t:'Summary', s:'Aggregates', e:'Card "Materials": Total Logged, Essential, Difficult Availability, New Added', ty:'metrics', w:'Summary tab', p:'?', v:'?', fn:'-', sev:'minor', fe:'HTML: 4 auto-computed counts', be:'BRD: derived from Existing/Required rows', n:'' },
      { t:'Summary', s:'Aggregates', e:'Card "Cost": Monthly Spend, Price/Unit Before, Price/Unit After, Saving/Unit', ty:'metrics', w:'Summary tab', p:'?', v:'?', fn:'-', sev:'serious', fe:'HTML: Before = existing avg; After = Completed interventions only', be:'BRD: cost roll-up; After reflects only Completed interventions', n:'' },
      { t:'Summary', s:'Aggregates', e:'Card "Interventions": Alt Source Flagged, Alt Material Flagged, New Material Needed, Total', ty:'metrics', w:'Summary tab', p:'?', v:'?', fn:'-', sev:'minor', fe:'HTML: counts of flagged interventions', be:'BRD: derived', n:'' },
      { t:'Summary', s:'Aggregates', e:'Card "Status": Completed, In Progress, Pending, Not Feasible', ty:'metrics', w:'Summary tab', p:'?', v:'?', fn:'-', sev:'minor', fe:'HTML: intervention status roll-up', be:'BRD: derived from implementation status', n:'' },
      { t:'Summary', s:'Intervention Flags', e:'4 flag cards: Alt Source Needed, Alt Material Needed, Difficult Availability, Essential Materials', ty:'metrics', w:'Summary tab', p:'?', v:'?', fn:'-', sev:'minor', fe:'HTML: count tiles', be:'BRD: derived', n:'' },

      // ---- EXISTING TAB ----
      { t:'Existing', s:'List', e:'"+ Add Raw Material" button → adds collapsible material block', ty:'button', w:'Existing tab', p:'?', v:'-', fn:'?', sev:'serious', fe:'HTML: adds a new Existing material block (child row)', be:'BRD: Existing raw materials child table', n:'' },
      { t:'Existing', s:'Material block', e:'Collapsible block w/ header inputs (Product, Raw Material), collapse chevron, Remove button', ty:'control', w:'Existing tab', p:'?', v:'-', fn:'?', sev:'minor', fe:'HTML: collapse/expand + remove with confirm', be:'BRD: per-material grouping', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Product Name *', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory', be:'BRD: required', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Product SKU', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'optional', be:'', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Current Status of Use * (Yes/No)', ty:'select', w:'block', p:'?', v:'?', fn:'?', sev:'serious', fe:'mandatory; options Yes/No', be:'BRD: required', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Name of Raw Material *', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory', be:'BRD: required', n:'' },
      { t:'Existing', s:'I. Material Identity', e:'Is It Essential? * (Yes/No)', ty:'select', w:'block', p:'?', v:'?', fn:'?', sev:'serious', fe:'mandatory; Yes shows "Essential" tag', be:'BRD: required; drives Essential count', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Availability (Easy/Moderate/Difficult)', ty:'select', w:'block', p:'?', v:'?', fn:'?', sev:'serious', fe:'3 options; "Difficult" flags Difficult-Availability count', be:'BRD: drives difficult-availability flag', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procurement Frequency (Daily/Weekly/Monthly/Seasonal)', ty:'select', w:'block', p:'?', v:'?', fn:'?', sev:'minor', fe:'4 options', be:'', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procured Season Time', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'free text', be:'', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Procurement Source (Market/Wholesaler/Middleman/Farm/Forest/Online/Others)', ty:'select', w:'block', p:'?', v:'?', fn:'?', sev:'serious', fe:'7 options; selection shows a source tag (Middleman highlighted)', be:'BRD: source classification', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Source Name', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'free text', be:'', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Source Location', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'free text', be:'', n:'' },
      { t:'Existing', s:'I. Supply & Procurement', e:'Source Contact', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'phone/email', be:'BRD: validate contact format (per project mobile rule)?', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Unit *', ty:'text', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory; drives calc unit labels', be:'BRD: required', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Monthly Requirement', ty:'number', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'number', be:'', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Quantity Required Per Batch *', ty:'number', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory; feeds calc', be:'BRD: required', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Price Per Unit *', ty:'number', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory; feeds calc', be:'BRD: required', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Batch Size *', ty:'number', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'mandatory; divisor in calc', be:'BRD: required; guard divide-by-zero', n:'' },
      { t:'Existing', s:'II. Cost Inputs', e:'Delivery / Transport Cost Per Trip', ty:'number', w:'block', p:'?', v:'-', fn:'?', sev:'minor', fe:'number; feeds transport/unit', be:'', n:'' },
      { t:'Existing', s:'II. Calculated', e:'Auto-calc: Amount/Batch, RM Qty/Unit, RM Cost/Unit, Transport/Unit + Calculation Summary + TOTAL LANDED COST/UNIT', ty:'calc', w:'block (read-only)', p:'?', v:'?', fn:'?', sev:'serious', fe:'Amount/Batch = qty×price; RM Qty/Unit = qtyBatch/batchSize; RM Cost/Unit = amtBatch/batchSize; Transport/Unit = trip/batchSize; Total = RMcost+transport', be:'BRD: landed cost/unit formula; feeds Unit Pricing', n:'' },
      { t:'Existing', s:'III. Intervention Need', e:'Toggle "Alternate procurement source needed?" + Justify textarea', ty:'toggle+text', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'SKIP-LOGIC: ON → auto-creates a row in Required §I carrying Product/Material/Justification', be:'BRD: bridge to Required tab; justification persists', n:'KEY skip-logic to verify end-to-end' },
      { t:'Existing', s:'III. Intervention Need', e:'Toggle "Alternate raw material needed?" + Justify textarea', ty:'toggle+text', w:'block', p:'?', v:'-', fn:'?', sev:'serious', fe:'SKIP-LOGIC: ON → auto-creates a row in Required §II', be:'BRD: bridge to Required tab', n:'KEY skip-logic to verify end-to-end' },
      { t:'Existing', s:'Totals', e:'Total bar: Material Count, Essential, Total Monthly Spend, Total RM Cost/Unit, "Auto-fetches to Existing Unit Pricing → Raw Materials"', ty:'calc', w:'Existing tab footer', p:'?', v:'?', fn:'-', sev:'serious', fe:'roll-up of all blocks', be:'BRD: CROSS-FRAMEWORK feed to Unit Pricing (Existing)', n:'verify the Unit Pricing bridge exists' },

      // ---- REQUIRED TAB ----
      { t:'Required', s:'I. Alternate Procurement Sources', e:'Auto-populated list + "+ Add Alternate Source Row" button', ty:'section', w:'Required tab', p:'?', v:'?', fn:'?', sev:'serious', fe:'rows arrive via flag in Existing OR added manually; empty-state message when none', be:'BRD: alternate-source child table', n:'' },
      { t:'Required', s:'I. Alt Source row', e:'Fields: Product (bridge RO), Current Raw Material (bridge RO), Justification (bridge), New Source Type (dropdown 8), New Source Name, Location, Contact, New Price/Unit, Old Price/Unit, Expected Saving/Unit (auto), Notes', ty:'row', w:'Required §I', p:'?', v:'?', fn:'?', sev:'serious', fe:'Expected Saving = Old−New auto; bridged fields read-only from Existing', be:'BRD: saving calc; persists per row', n:'' },
      { t:'Required', s:'I. Alt Source row', e:'Implementation Status (Pending/In Progress/Completed/Not Feasible) + Implementation Notes', ty:'select+text', w:'Required §I', p:'?', v:'?', fn:'?', sev:'serious', fe:'4 options; Completed feeds "after" cost', be:'BRD: status drives Summary roll-up', n:'' },
      { t:'Required', s:'II. Alternate Raw Materials', e:'Auto-populated list + "+ Add Alternate Material Row" button', ty:'section', w:'Required tab', p:'?', v:'?', fn:'?', sev:'serious', fe:'rows via flag OR manual; empty-state message', be:'BRD: alternate-material child table', n:'' },
      { t:'Required', s:'II. Alt Material row', e:'Fields: Product/Current RM/Justification (bridges), Proposed Alternate Material, Reason for Change (dropdown 6), New Price/Unit, Quality Trade-off (dropdown 4), Trial Status (dropdown 5), Notes', ty:'row', w:'Required §II', p:'?', v:'?', fn:'?', sev:'serious', fe:'multiple dropdowns must populate', be:'BRD: persists per row', n:'' },
      { t:'Required', s:'II. Alt Material row', e:'Implementation Status (Pending/In Progress/Completed/Not Feasible) + Notes', ty:'select+text', w:'Required §II', p:'?', v:'?', fn:'?', sev:'serious', fe:'4 options', be:'BRD: status roll-up', n:'' },
      { t:'Required', s:'III. New Raw Material', e:'SECTION III "New Raw Material" + "+ Add New Raw Material" button (standalone, always-on)', ty:'section', w:'Required tab', p:'N', v:'-', fn:'N', sev:'serious', fe:'HTML: standalone new raw materials NOT linked to any existing material — add freely (not flag-gated)', be:'BRD: new-material child table; feeds Optimised Unit Pricing', n:'PM-CONFIRMED MISSING ON PORTAL. No path to log a standalone new raw material. The original example for this whole exercise. Confirm on staging + file bug.' },
      { t:'Required', s:'III. New Material row', e:'Fields: Product/Purpose, SKU/Ref, Name of RM *, Procurement Source (8), Source Name/Location/Contact, Availability (3), Unit, Qty/Batch, Price/Unit, Batch Size, Transport/Trip, Is It Essential? (Y/N), Reason for Adding', ty:'row', w:'Required §III', p:'N', v:'N', fn:'N', sev:'serious', fe:'full new-material entry incl. cost inputs', be:'BRD: persists; feeds Optimised Unit Pricing', n:'Blocked-absent: cannot exist if Section III is missing.' },
      { t:'Required', s:'III. New Material row', e:'Implementation Status (Pending/In Progress/Completed/On Hold — note: "On Hold" not "Not Feasible") + Notes', ty:'select+text', w:'Required §III', p:'N', v:'N', fn:'N', sev:'minor', fe:'options differ from §I/§II (On Hold vs Not Feasible)', be:'BRD', n:'' },
      { t:'Required', s:'Totals', e:'Total bar: Alternate Sources, Alternate Materials, New Raw Materials, Status Completed, "Auto-fetches to Optimised Unit Pricing → Raw Materials"', ty:'calc', w:'Required tab footer', p:'?', v:'?', fn:'-', sev:'serious', fe:'roll-up incl. New Raw Materials count', be:'BRD: CROSS-FRAMEWORK feed to Optimised Unit Pricing', n:'"New Raw Materials" count depends on missing Section III' },

      // ---- RESOURCES TAB ----
      { t:'Resources', s:'Reference Materials', e:'Table: Resource Title, Category (dropdown 6), Type (dropdown 5), Description/Notes, File (Upload + View), delete, "+ Add Resource"', ty:'table', w:'Resources tab', p:'?', v:'?', fn:'?', sev:'minor', fe:'Category & Type dropdowns must populate; Upload/View functional', be:'BRD: Resources child table + file attach', n:'' },

      // ---- TASK LOG TAB ----
      { t:'Task Log', s:'Activities', e:'Table: No., Date, Task Name (dropdown — 16 preset RM tasks + "If other"), Notes/Outcome, Attachment (Upload), delete, "+ Add Entry"', ty:'table', w:'Task Log tab', p:'?', v:'?', fn:'?', sev:'serious', fe:'Task Name dropdown must list the 16 RM tasks; date picker; attachment', be:'BRD: NB Task tab said removed in favour of Activity Logger — reconcile whether a per-framework Task Log persists', n:'confirm presence vs BRD "Task tab removed" decision' }
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
