# ITBD HRIS — Frontend Demo — Context & Setup

This is a **frontend-only click-through demo** of the ITBD HRIS, built from the
project's build brief. There is no backend and no real database — all data is
seeded in-memory in the browser and mutated live as you use the app (apply
leave, approve a transfer, etc.). Refreshing the page resets everything back
to the seed data.

## Prerequisites

- **Node.js 20+** and npm (comes with Node). Check with `node -v`.
- Any modern browser.

## Setup (on a new machine)

```bash
git clone https://github.com/princechoudhary08092003/itbd-hris-demo.git
cd itbd-hris-demo
npm install
npm run dev
```

Then open the URL Vite prints (default **http://localhost:5173**). Vite has
hot-reload, so any code edits show up instantly without restarting.

Other scripts:

```bash
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint
```

## How to use the demo

There's no real login — use the **role switcher** in the top-right corner of
the app (click the avatar/name) to sign in as one of four seeded people:

| Role | Person | What you'll see |
|---|---|---|
| Employee | Chloe Bennett | Self-service: profile, leave, attendance, org chart |
| Manager | Grace Oyelaran | + direct reports, approvals, "Awaiting My Action" |
| HR Admin | Ben Thompson | + onboarding, exits, transfers, admin screens |
| Super Admin | Fatima Al-Sayed | + system config, roles, audit log |

The selected role persists across navigation (stored in `sessionStorage`) but
resets if you close the tab or clear site data.

**Good things to try** (each one recomputes live, nothing is hardcoded):
- Apply for leave as Chloe → switch to Grace (her manager) → approve it in
  **Leave Approvals** → balance updates.
- **Attendance & Shift → Comp-Off**: apply for an auto-detected eligible day,
  then approve/redeem it as a manager or HR Admin.
- **HRIS Core → Transfers**: approve Miguel Torres's pending movement, then
  **Make Effective** — watch the **Org Chart** update live.
- **HRIS Core → Employee Directory → Priya Nair**: shows one person with
  three employment records (employee → resigned → rejoined as vendor →
  converted back to employee) — the multi-employment data model in action.
- **Onboarding**: convert Olivia Martinez from pre-onboarding (no company
  email yet) into a full employee.
- **Product Roadmap** (top of the sidebar): the full HR + performance
  platform roadmap — a visual delivery timeline plus 22 items across 5
  phases, each with live delivery status.
- **Performance → PIP Cases / Discipline Cases**: create a case, advance it
  through its stages, and auto-generate the letter.
- **Performance → Calibration & Normalization**: adjust a person's scores and
  watch the bell-curve distribution and their tier update live.
- **Recruitment → TA Management**: a real hiring pipeline kanban — move a
  candidate between stages.
- The floating chat bubble (bottom-right) is a prototype HR FAQ assistant —
  try asking about leave, comp-off, payslips, or holidays.
- Toggle dark/light mode (moon/sun icon, top right).

## Project structure

```
src/
  data/
    seed/          # hand-written seed data per entity (people, employments,
                    # positions, shifts, leave, comp-off, etc.) — this is the
                    # "would-be backend" dataset, structurally matching the
                    # real data model in the build brief
    index.js        # combines all seed files into one fresh, deep-cloned
                    # initial state (createInitialState())
  state/
    DataStore.jsx    # single React Context + useReducer holding the whole
                    # in-memory "database" and every mutation (APPLY_LEAVE,
                    # DECIDE_MOVEMENT, CONVERT_TO_EMPLOYEE, etc.)
    AuthContext.jsx  # the role switcher (which seeded login is "you")
    ThemeContext.jsx # dark/light mode
  lib/              # pure business-logic functions computed against the
                    # store — attendance status, leave balances, comp-off
                    # eligibility, org chart tree, etc. (Section 8 rules)
  components/
    layout/         # AppShell, Sidebar, TopBar, mobile nav, route guard
    ui/             # shared design-system pieces (Card, Button, Badge,
                    # Table, Modal, PageHeader/PageBanner, Logo, icons…)
  pages/            # one folder per module (dashboard, leave, attendance,
                    # hris, onboarding, exit, recruitment, admin, helpdesk,
                    # performance, roadmap) — performance/ is the performance
                    # roadmap build-out (Impact Tier Scoring, PIP,
                    # Discipline, Calibration, Succession, KPI Ingestion)
  assets/images/    # stock photography used in banners (downloaded locally,
                    # not hotlinked)
navConfig.js         # sidebar structure + per-route minimum role, used for
                    # both hiding nav items and the route guard
```

To add a new screen: create the page component under `src/pages/<module>/`,
add a `<Route>` in `src/App.jsx`, and add a nav entry (with `minRole`) in
`src/navConfig.js`.

## Tech stack

React 19 + Vite + React Router 7 + Tailwind CSS v4 + Framer Motion. No
backend, no database, no auth beyond the mocked role switcher — by design,
per the build brief (this demo precedes the real 6-month backend build).

## Known placeholders / things to swap later

- **Logo**: `src/components/ui/Logo.jsx` is a designed placeholder mark (no
  real ITBD logo file exists yet per the brief) — swap it in when available.
- **Recruitment module**: intentionally low-fidelity placeholder screens only
  (`src/pages/recruitment/`) — real ATS/scoring logic is Phase 2, after the
  6-month backend build, per the brief.
- Nothing persists across a browser refresh/new tab by design (no backend).

## Reference

The full build brief this demo was built from is `ITBD_HRIS_Demo_Build_Brief.md`
— Sections 6–11 in particular cover the data model, screens, business rules,
and seed data requirements this codebase implements.

A second brief, a 22-item HR + performance platform feature roadmap, was
layered on afterward — see the in-app **Product Roadmap** page (`/roadmap`,
source in `src/data/roadmapItems.js`) for the exact scope, the delivery
timeline, and what's delivered vs. placeholder. Items needing real
infrastructure (SSO/MFA,
AI-powered insights, ERP/GL integration) are honest placeholders, same
treatment as Recruitment.
