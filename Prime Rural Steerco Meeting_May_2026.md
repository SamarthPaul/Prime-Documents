# SLIDE 1: COVER

Steering Committee

**Name of Project:** Prime Rural WEB CRM and Mobile Application
**Date of Presentation:** [Insert Date — suggest last week of May 2026]
**Name of Client PM:** Dylan
**Name of Dhwani PM:** Samarth Paul

[PRIME Rural Logo] [MBMA Logo]

---

# SLIDE 2: AGENDA

- ☑ Action Taken from the last steerco decisions (8 Apr 2026)
- ☑ Project Charter Review
- ☑ Project Plan against Actuals
- ☑ Risk Register
- ☑ Support Needed from Steering Committee Members
- ☑ Decisions Made
- ☑ Next Steerco

---

# SLIDE 3: ACTION TAKEN ON DECISIONS FROM LAST STEERCO (8 Apr 2026)

| Sno | Decision | Action (if any) | Current Status |
|-----|----------|----------------|----------------|
| 1 | Implement Milestone Tracker Dashboard Feedback | Feedback implemented on staging web CRM. | Closed |
| 2 | Bulk Task Creation feature — revamp task and framework task population as discussed (no automated task population) | Feature built on staging web CRM. | Closed |
| 3 | Provide step-by-step demo from blank entrepreneur profile to help Dylan and team understand fellow user journey and task flow | Demo conducted in weekly check-in of 08/04/2026. | Closed |
| 4 | Share files related to district blanketing and bamboo value chain projects | Files shared on 09/04/2026. | Closed |
| 5 | Raplang to share dashboard link for incubation program specific KPIs | Link shared on 09/04/2026. | Closed |

---

# SLIDE 4: PROJECT MISSION

**Project Charter — Prime Rural Fellowship Platform**

The Prime Rural Fellowship Platform digitises MBMA Meghalaya's field-based program where ~80 fellows support rural entrepreneurs through structured diagnostic frameworks across 11 modules and 27 frameworks. The platform consists of:

1. **Frappe-based Web CRM** — program management, monitoring, dashboards, reporting
2. **Flutter offline-first Mobile App** — field data capture in low-connectivity rural areas

**Success Criteria:**
- All 27 diagnostic frameworks digitised across 11 modules
- ~80 field users onboarded
- Legacy Google Sheets data migrated
- Program team monitoring entrepreneur progress in real time

---

# SLIDE 5: PROJECT PLAN AGAINST ACTUALS

| Phase | Milestone | Description | Planned Date | Actual Date |
|-------|-----------|-------------|-------------|-------------|
| 1 | Requirements Gathering | Framework mapping, module structure, stakeholder alignment. 11 modules / 27 frameworks finalised. | Dec 2025 | Dec 2025 |
| 2 | Solution Document | Solution Document v1.0 drafted (PREF.20251210.CRM-and-MobileApp-Full-Platform). Living BRD (interactive HTML, 5749 lines) with 27 framework deep dives + 120 TDD test cases. | Jan 2026 | Ongoing — pending PM inputs (names, dates, project code) |
| 3 | Project Charter & Kickoff | Charter generated (11 sections, 6 KPIs, 9 milestones × 18 weeks, RACI). Kickoff deck built (12-slide HTML). | Jan 2026 | Jan 2026 |
| 4 | Web CRM Development | Entrepreneur Profile, Diagnostic Frameworks (27), Milestone Tracker Dashboard, Infrastructure Monitor Dashboard, Networking & Mentoring module, Sankey diagrams, MCP integration. | Feb–Apr 2026 | Ongoing — majority on staging |
| 5 | Mobile App Development | Flutter offline-first app. Frappe Mobile SDK compatibility evaluated (23/31 frameworks compatible). | Mar–May 2026 | SDK evaluation complete. Dev ongoing. |
| 6 | Internal QA | 22 bugs identified in Internal QA (Bug Tracker updated Apr 2026). Modules: EP Status Monitor, Entrepreneur Profile, Product Form, Mobile UUID, Pricing. | Apr 2026 | In Progress |
| 7 | Client UAT | End-to-end UAT by MBMA/Dylan team. | TBD | Not started — blocked by QA completion + go-live date |
| 8 | Training & Go-Live | Fellow onboarding, data migration, production deployment. | TBD | Not started |

---

# SLIDE 6: RISK REGISTER

| ID | Risk Type | Short Description | Long Description | Current Risk Status | Probability | Impact | Risk Score | Mitigation Relevant |
|----|-----------|-------------------|------------------|--------------------:|:-----------:|:------:|:----------:|:-------------------:|
| RR-01 | Resources | No QA assigned | Experienced QA needed to test web app and mobile app before shipping to client UAT. | Dormant | 8 | 9 | 72 | Yes |
| RR-02 | Resources | PM managing 4 projects | PM manages Prime Rural + 3 other active projects. Limits dedicated focus for stakeholder engagement. Mitigated via AI-assisted PM and living docs. | Active | 6 | 7 | 42 | Yes |
| RR-03 | Delivery Timeline | Requirement changes | Module structure changed multiple times (32→27 frameworks). Causes redevelopment and timeline slips. Stabilising now. | Active | 5 | 8 | 40 | Yes |
| RR-04 | Delivery Timeline | Go-live date undefined | No formal go-live date committed. No forcing function for UAT, training, or deployment. 13+ open questions unresolved. | Active | 7 | 8 | 56 | Yes |
| RR-05 | Delivery Quality | Client UAT delays | Client team not performing end-to-end UAT. Partial/delayed UAT means late bug discovery. | Active | 7 | 8 | 56 | Yes |
| RR-06 | Technical | Mobile offline sync | Flutter app must work in low-connectivity rural Meghalaya. Sync conflicts or data loss would cripple field adoption. | Active | 6 | 8 | 48 | Yes |
| RR-07 | Stakeholder Engagement | Client asset dependencies | 13+ items pending from client (BPC HTML, EPR spec, task lists, logo, module specs). Each blocks specific dev or doc work. | Active | 6 | 7 | 42 | Yes |
| RR-08 | Leadership | Steerco cadence at risk | First steerco conducted 8 Apr 2026. Monthly cadence needed but second not yet scheduled. | Active | 4 | 6 | 24 | Yes |

**Top 3 risks by score:** RR-01 (72), RR-04 (56), RR-05 (56)

---

# SLIDE 7: SUPPORT NEEDED FROM STEERCO

1. **Go-Live Date Commitment (RR-04, Score: 56):** Request MBMA leadership to commit a target go-live date so we can work backwards to set UAT, training, and deployment milestones. Without this, the project remains open-ended.

2. **Dedicated QA Resource (RR-01, Score: 72):** A QA resource must be assigned before UAT begins. Current risk score is the highest on the register. Request approval to either assign an existing Dhwani QA or budget for a new hire.

3. **Client Pending Items (RR-07, Score: 42):** 13 items have been pending from the client team for extended periods — BPC HTML, EPR spec, framework task lists, logo assets, Infrastructure and Funding module specs. Request Dylan's team to provide a timeline for each pending item.

4. **UAT Kickoff Plan (RR-05, Score: 56):** Request client to confirm UAT team composition, UAT window duration, and device/connectivity test plan (critical for mobile app in rural areas).

---

# SLIDE 8: DECISIONS MADE

- [ ] Go-live target date: _______________
- [ ] QA resource allocation: _______________
- [ ] Client pending items deadline: _______________
- [ ] UAT start date and duration: _______________
- [ ] Monthly steerco cadence confirmed: ☐ Yes ☐ No

- **Next Steerco Date:** [Suggest ~4 weeks from this steerco]
- **Venue:** [Virtual / In-person at MBMA office]

---

# SLIDE 9: CLOSE

THANK YOU
