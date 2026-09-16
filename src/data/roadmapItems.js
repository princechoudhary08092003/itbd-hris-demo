// Static reference content for the Product Roadmap screen — mirrors the
// HRMS_TeamGPS_Feature_Roadmap brief exactly (phases, weeks, descriptions),
// annotated with what this demo actually delivers for each item.
// status: "delivered" | "new" | "placeholder"
export const ROADMAP_PHASES = [
  {
    key: "must-have",
    title: "Must Have",
    phase: "Phase 1A · Weeks 5–20",
    subtitle: "Core foundation",
    tone: "red",
    items: [
      { n: 1, title: "Centralized Employee Database", description: "Single source of truth replacing PeopleStrong — foundation every other module depends on.", status: "delivered", to: "/hris/directory" },
      { n: 2, title: "Role-Based Access Control", description: "Locks salary and HR data to the right people; enforces country-level data isolation.", status: "delivered", to: "/admin/roles" },
      { n: 3, title: "Org Structure & Reporting Lines", description: "Real-time org chart with restructure modeling and cost-centre mapping.", status: "delivered", to: "/hris/org-chart" },
      { n: 4, title: "Shift Scheduling & Management", description: "Automates shift assignment and OT compliance across India, Philippines, US.", status: "delivered", to: "/attendance/roster" },
      { n: 5, title: "Leave & Attendance", description: "Country-specific leave rules, biometric sync, geo-fenced check-in; feeds payroll on time.", status: "delivered", to: "/attendance" },
      { n: 6, title: "Impact Tier Scoring Engine", description: "Core of the new performance system — dual-index scoring drives promotions and PIPs.", status: "new", to: "/performance/scoring" },
      { n: 7, title: "PIP Workflow", description: "Structured, auditable performance-improvement process with auto letter generation.", status: "new", to: "/performance/pip" },
      { n: 8, title: "Calibration & Normalization", description: "Bell-curve calibration for fair, defensible performance and promotion decisions.", status: "new", to: "/performance/calibration" },
    ],
  },
  {
    key: "high",
    title: "High",
    phase: "Phase 1B · Weeks 21–32",
    subtitle: "Self-service & integrations",
    tone: "amber",
    items: [
      { n: 9, title: "SSO / AD / MFA", description: "Secure single sign-on and MFA for sensitive HR actions, across all geographies.", status: "placeholder", to: "/admin/security" },
      { n: 10, title: "Employee Self-Service", description: "Employees handle leave, payslips, and personal data — cuts routine HR tickets.", status: "delivered", to: "/" },
      { n: 11, title: "Manager Self-Service", description: "Managers approve requests and issue formal letters directly from their dashboard.", status: "delivered", to: "/leave/approvals" },
      { n: 12, title: "KPI Data Ingestion", description: "Pulls QA/agent performance data automatically into TeamGPS via existing pipelines.", status: "new", to: "/performance/kpi-ingestion" },
      { n: 13, title: "Payroll Vendor Integration", description: "Feeds attendance/leave to outsourced payroll; consolidated workforce cost view.", status: "delivered", to: "/attendance/export" },
      { n: 14, title: "Onboarding & Offboarding", description: "Automates hire-to-exit lifecycle: probation reviews, transfers, full & final settlement.", status: "delivered", to: "/onboarding" },
    ],
  },
  {
    key: "medium",
    title: "Medium",
    phase: "Phase 2 · Weeks 33–42",
    subtitle: "Analytics, compliance & talent",
    tone: "cyan",
    items: [
      { n: 15, title: "Real-Time Dashboards & Analytics", description: "Self-serve headcount, attrition, and cost metrics — no HR pull required.", status: "new", to: "/admin/analytics" },
      { n: 16, title: "Compliance & Data Privacy", description: "DPDP (India), RA 10173 (Philippines), CCPA (US) compliance and audit trails.", status: "new", to: "/admin/compliance" },
      { n: 17, title: "Succession Planning", description: "Identifies and tracks high-potential talent using calibrated performance scores.", status: "new", to: "/performance/succession" },
      { n: 18, title: "Discipline Management", description: "Formal NTE/NTD issuance and retention agreements for Philippines operations.", status: "new", to: "/performance/discipline" },
      { n: 19, title: "Talent Acquisition / ATS", description: "End-to-end hiring pipeline with job board integrations and digital offer letters.", status: "new", to: "/recruitment/ta" },
    ],
  },
  {
    key: "low-future",
    title: "Low / Future",
    phase: "Phase 3 · Weeks 43–50",
    subtitle: "AI & innovation",
    tone: "neutral",
    items: [
      { n: 20, title: "AI-Powered Insights", description: "Attrition prediction and workforce planning — needs 12 months of live data first.", status: "placeholder", to: "/admin/analytics" },
      { n: 21, title: "HR Chatbot", description: "WhatsApp-based self-service for routine HR questions across India and Philippines.", status: "placeholder", to: null },
      { n: 22, title: "ERP / GL Integration", description: "Connects HR cost and payroll data to Finance's GL system; opens a public REST API.", status: "placeholder", to: "/admin/integrations" },
    ],
  },
];

export const ROADMAP_STATUS_META = {
  delivered: { label: "Delivered", tone: "green" },
  new: { label: "New in this build", tone: "cyan" },
  placeholder: { label: "Placeholder — needs real infra", tone: "amber" },
};

export const ROADMAP_SUMMARY = {
  title: "Replaces PeopleStrong and closes ITBD's performance-management gap with a single platform built natively on TeamGPS.",
  detail: "All 22 requirements (from Rita, CLO) are sequenced into five phases with clear pre-requisites and owners. Estimated full delivery: 50 weeks (~11.5 months) from kickoff.",
};
