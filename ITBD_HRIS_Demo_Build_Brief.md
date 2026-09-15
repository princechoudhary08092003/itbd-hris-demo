# ITBD HRIS — Frontend Demo Build Brief (v1)

**Purpose of this document:** hand this directly to Claude Code as the instruction set for building a **frontend demo** of the ITBD HRIS. This is not the production build — it's a fully working, seeded, click-through demo that shows the real screens, real business logic (calculated in-memory against seed data), and real UX, with no real database and no payroll/tax calculation.

---

## 1. Project Context

ITBD is an MSP (managed service provider) building its own HRIS in-house, independent of its existing performance-management platform (TeamGPS). The performance module (scorecards, goals, calibration, PIP scoring triggers) is explicitly **out of scope** — this HRIS owns people, positions, attendance, shift, leave, movement, exit, and onboarding only.

**Team building this:** 1 experienced developer, 2 junior UI/UX designers, limited QA capacity. **Timeline:** 6 months for the real build. This demo is the first deliverable — a working prototype to align stakeholders before backend development starts.

---

## 2. What This Demo Actually Is

A **React frontend**, fully responsive (mobile + tablet + desktop), with:
- Every screen listed in Section 7 marked "Demo" built and clickable
- Realistic seeded demo data (Section 13) driving every screen
- Real business logic computed client-side against that seed data (leave balances, shift-based attendance status, movement approval states, comp-off accrual) — **not hardcoded display values**
- No real backend, no real database, no auth beyond a mocked login/role switcher
- Dark mode and light mode, both fully styled
- ITBD branding throughout (Section 5)

The point is that this "should be working" in the sense that clicking "apply leave" recalculates a balance, changing a shift reassigns attendance rules, a movement request changes an org chart preview — using the seeded data as the dataset, in memory, in the browser. Nothing persists after a refresh unless you choose to add local state persistence for the demo session.

---

## 3. Explicitly Out of Scope (Now, and for the 6-month build)

- Payroll calculation, tax calculation, CTC computation — this system exports attendance/leave data; a separate system (ADP or similar) does the math
- Performance module: scorecards, measurables, rocks, behavior anchors, calibration, review cycles — owned by TeamGPS
- Recruitment/ATS — confirmed **in scope for Phase 2, after the 6-month build**, not now. Build the Recruitment screens as low-fidelity placeholders only if time allows; do not build real logic for them yet.

---

## 4. Tech Stack & Non-Negotiables

- **React** (this demo, and the eventual production app)
- **Fully responsive** — every screen must work cleanly on mobile phone widths, tablet, and desktop/laptop. Test against common breakpoints (375px, 768px, 1024px, 1440px). This is not optional polish — it's a stated requirement.
- **Dark mode and light mode**, both complete, with a visible toggle
- Component-based structure that a real backend can later be wired into without a rewrite — build the mock data layer as a clean, swappable service layer (e.g. a `/data` or `/mock-api` folder), not scattered inline fixtures

---

## 5. Design System / Brand Guidelines (ITBD)

**Colors:**
- Primary cyan: `#00AFDD`
- Accent green: `#BED62F` (also referenced as `#B7D532`)
- Dark background: `#03111D`

Use the cyan and green as primary/accent across both light and dark themes — cyan for primary actions and active states, green for success/positive states (approved, on-track, present). `#03111D` is the base dark-mode background; build a light-mode palette that mirrors the same brand feel (light neutral background, same cyan/green for accents and actions) rather than inventing an unrelated light palette.

**Typography:**
- **IBM Plex Sans** for UI text — this is the established convention for prototypes and technical interfaces at ITBD, and this demo is exactly that use case. Use it as the primary interface font throughout.
- **IBM Plex Mono** for any tabular/numeric data, IDs, timestamps, or code-like values (employee IDs, punch timestamps) where alignment matters.
- Poppins is used for slide decks, not relevant here — do not use it for this UI.

**Logo:** No ITBD logo file has been provided yet. Build the header/nav with a placeholder wordmark ("ITBD" in the brand cyan, IBM Plex Sans, bold) sized and positioned where a real logo asset will drop in later — do not delay the demo waiting on the asset. Flag this as a swap-in item once the real logo file is available.

---

## 6. Data Model (mocked, but structurally real)

Build the mock data layer to reflect these entities and relationships — this is what the real backend will look like, so getting the shape right now saves rework later.

### Core identity split
- **`person`** — the human. `person_id` (PK), legal name, personal email, personal phone, date of birth, national ID. **Persists across every employment this person ever has at ITBD**, including gaps, exits, and rehires.
- **`employment`** — one period of being employed (or engaged as vendor). `employment_id` (PK), `person_id` (FK), `employee_id` (the company-issued ID for this specific employment period — never reused), `company_email` (issued at onboarding, deactivated on exit, reissued fresh on rehire), `employment_type` (employee / vendor / contractor), `employment_status` (pre_onboarding / active / on_leave / notice / terminated / exited), `position_id`, `date_of_joining`, `exit_date`, `exit_type`, `exit_reason`, effective-dated.

**The lifecycle rule to encode:** one `person` — many `employment` rows over time. Each `employment` row gets its own `employee_id` and `company_email`. A rehire is a brand-new `employment` row linked to the same `person_id` — the system should be able to show "this person's full history" by querying all employments for one `person_id`, even across an employee → vendor → employee round trip.

### Pre-onboarding state (new — not in earlier drafts)
Before someone has a company email, they still need to exist in the system to collect documents. Model this as an `employment` row with `employment_status = pre_onboarding`: `company_email` is null until onboarding completes and IT provisions it, at which point status flips to `active` and `company_email` is populated. Documents (see below) can attach to this employment row even while `company_email` is still null.

### Position & Org
- **`position`** — a seat. `position_id`, `seat_title`, `org_unit_id`, `reports_to_position_id` (nullable — some seats are deliberately line-neutral), `position_status` (open / filled / frozen / abolished / bench)
- **`org_unit`** — department/team, tree structure via `parent_org_unit_id`

### Movement (new object, per your last request)
- **`movement_request`** — `movement_id`, `employment_id`, `movement_type` (location_transfer / manager_change / position_change / entity_transfer / bench_release / client_reassignment), from/to work_location, from/to position, from/to reports_to, `requested_by`, `approved_by`, `status` (draft / pending_approval / approved / rejected / effective / cancelled), `effective_date`, `reason`

### Time & Attendance
- **`shift_definition`** — name, start/end time, `crosses_midnight`, break minutes, grace-in/out minutes. Build seed shifts covering the real MSP variety mentioned: 5-day, 6-day, 9–5, 8–5 ET, 9-hour, 12-hour.
- **`shift_assignment`** — employment_id, shift_definition_id, date, `source` (monthly_bulk / individual / swap)
- **`punch_event`** — employment_id, timestamp_utc, direction (in/out), **`source`** (biometric / mobile_geofence / manual / middleware_import / **access_control** — the card-tap addition), device_id
- **`attendance_day`** — calculated from punches against the assigned shift: first_in, last_out, total_hours, status (present/absent/half_day/leave/holiday/week_off), `locked_for_payroll` (true once the 21st–20th cycle closes)

### Leave
- **`leave_type`** — code (EL/SL/CL/PTO etc.), accrual method, max balance, carry-forward rules, encashment rules — per country/location
- **`leave_entitlement`** — employment_id, leave_type_id, period, opening/accrued/used/closing balance
- **`leave_request`** — employment_id, leave_type_id, dates, status, approver
- **`comp_off`** — new object for your compensatory-off flow: `comp_off_id`, `employment_id`, `worked_date` (the day they worked that earned it), `status` (pending_approval / approved / redeemed / expired), `redeemed_on_date` (nullable — the holiday they used it as), `approved_by`

### Discipline / Exit
- **`pip_case`** — manually triggered (no automatic scorecard link, since performance lives in TeamGPS) — employment_id, stage, manager_id, hr_approver_id, documents
- **`resignation`** — employment_id, `initiated_by` (self / proxy — covers your "proxy resignation" case), resignation_date, last_working_day, status
- **`exit_checklist`** — employment_id, item (asset_return / access_revocation / final_documents / knowledge_transfer), status, completed_by, completed_at

### Documents & Access
- **`document`** — polymorphic owner (person / employment / movement_request / pip_case), document_type, file, is_immutable once issued
- **`asset`** — new object: `asset_id`, `employment_id`, `asset_type` (laptop / badge / SIM / etc.), `issued_date`, `returned_date`, `status`
- **`security_role`** / **`permission_grant`** — role-based + field-level access (needed even in the demo to justify role-based screen visibility: Employee / Manager / HR Admin / Super Admin views)

---

## 7. Screens / Modules

Mark each screen **[DEMO]** = build fully now, or **[PLACEHOLDER]** = low-fidelity stub only.

### Employee Dashboard [DEMO]
- My Profile, My Team, My Attendance, Team Attendance
- Birthdays, Upcoming Holidays
- Notifications/Alerts, My Tasks
- Company announcements feed
- Quick links: Policy Hub, Org Chart
- "Awaiting my action" widget (for managers — pending approvals surfaced here)

### HRIS Core [DEMO]
- Transfers — Initiate Transfer (movement_request form)
- HRIS Reports (headcount, org distribution — basic)
- Promotion module
- Letters (list + generate — offer/promotion/increment/relieving templates, seeded examples)
- Employee Directory
- Policy Hub
- Org Chart (interactive, seat-driven, showing vacant/bench positions distinctly)
- **Manager-initiated resource move** (release to bench / move internally / move to another client — this is `movement_request` with `movement_type = bench_release` or `client_reassignment`)

### Onboarding [DEMO — new]
- Pre-onboarding checklist and document collection screen (works before company email exists)
- Candidate → Employee conversion trigger (issues company email + employee_id, flips status to active)

### Exit [DEMO]
- Resignation (self)
- Proxy Resignation (HR/manager-initiated on someone's behalf)
- Exit checklist/clearance tracker
- Rehire flow — search by personal ID/name across past employments, start a new employment record linked to the same person

### Leave [DEMO]
- Apply Leave, Leave Balance widget, Employee Leave Details, Leave Reports
- Leave approval queue (manager view)
- Cancel/withdraw a pending request

### Attendance & Shift [DEMO]
- Assign Roster, Bulk Shift Upload
- Bulk Task Approval
- Time entry adjustments (leave corrections)
- Comp-off: apply → approve → redeem flow
- Shift swap/change request with approval trail
- Attendance export screen (shows the locked 21st–20th cycle export, downloadable — **display only, no calculation beyond the export format**)

### Recruitment [PLACEHOLDER only]
- My Referrals, Open Positions (employee view)
- TA open-positions management
- Resume upload / ATS score — **stub UI only, no real scoring logic.** Full build is Phase 2, post-6-month.

### Admin / Super Admin / HR Team [DEMO]
- User & role management (assign roles, view field-level permission grants)
- Company/entity setup (legal entities, cost centers, org units, work locations)
- Policy configuration (leave types, holiday calendars, shift definitions per country/location)
- Approval workflow configuration
- Bulk operations (bulk employee import/update — demo as a mock file-upload flow)
- HR case management view (a single screen surfacing open exits, transfers, PIPs, probation reviews across the company)
- System reports/exports (headcount, attrition, movement history)
- Asset management (issue/track/return)
- Document expiry tracking (visa, work permit, certifications)
- Audit log viewer

### HR Helpdesk [DEMO — new, simple]
- Employee raises a general HR query (not leave, not attendance)
- HR-side queue to respond/close

---

## 8. Business Rules the Demo Must Actually Compute (not hardcode)

- **Leave balance** = opening + accrued − used − pending, shown live as requests are applied/approved in the demo session
- **Shift-aware attendance status** — a punch at 10:05pm against a 10pm shift with a 10-minute grace period should NOT show as "late"; one at 10:15pm should
- **Midnight-crossing shifts** — a punch-out after midnight must still attribute to the correct shift/attendance day, not split awkwardly
- **Comp-off eligibility** — working on a declared holiday or week-off should be flagged as comp-off eligible in the demo data, and the approve → redeem flow should actually move it through states
- **Movement request** — approving a transfer should visibly update the org chart preview and the employee's position/reporting line in the demo dataset
- **Attendance lock** — attendance_day records dated before the 20th of the cycle should show `locked_for_payroll = true` and be visually distinct (non-editable) from the current, still-open cycle

---

## 9. Attendance — Finance Export

The HRIS's payroll-adjacent responsibility ends here: **produce a locked, exportable attendance + leave dataset for the 21st–20th cycle, in a clean tabular format, for finance/ADP to pick up.** No tax, no CTC, no salary calculation happens inside this system. Build the export screen to show what this file would contain (employee_id, date range, attendance summary, leave taken, comp-off used) — the exact field list finance/ADP needs is still an open question to confirm before the real backend build, so keep this configurable/obvious to edit rather than hardcoded.

---

## 10. Responsiveness

Every screen in Section 7 marked [DEMO] must be tested and functional at:
- Mobile (375px–428px width)
- Tablet (768px–1024px)
- Laptop/desktop (1280px+)

Navigation should collapse to a mobile-appropriate pattern (bottom nav or hamburger) below tablet width — do not just shrink the desktop layout.

---

## 11. Seed Demo Data — what to include

Build enough seed data to demonstrate every rule in Section 8, including:
- At least one person with **multiple employment records** (e.g., employee → resigned → rejoined as vendor → converted back to employee) to demonstrate the person/employment split working correctly
- At least one **pre-onboarding** record with no company email yet
- Multiple shift types (5-day, 6-day, 9–5, 8–5 ET, 9hr, 12hr) assigned across different seeded employees
- A night shift example crossing midnight, with punches, to demonstrate correct attendance-day attribution
- A comp-off example moving through pending → approved → redeemed
- A movement_request example moving through pending → approved → effective, visibly changing the org chart
- Locked (past-cycle) vs. open (current-cycle) attendance days
- At least 3 roles represented in the login/role switcher: Employee, Manager, HR Admin (Super Admin optional for demo)

---

## 12. Open Items to Confirm Before the Real Backend Build (not blockers for this demo)

- Exact field list ADP/finance needs in the attendance export
- Whether movement_request needs one approver or two (old manager + new manager)
- Full list of exit_reason / exit_type values (the "drops and rejoins" and "converts to vendor" cases should already work structurally per Section 6, but the exact enum values need HR sign-off)
- Real ITBD logo asset
