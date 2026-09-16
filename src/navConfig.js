import {
  IconHome, IconCalendar, IconClock, IconBriefcase, IconUsers, IconUserPlus, IconUserMinus,
  IconShield, IconTicket, IconBuilding, IconTarget, IconMap,
} from "./components/ui/Icons";

// minRole: employee | manager | hr_admin | super_admin — lowest role that can see the item
export const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/", icon: IconHome, minRole: "employee" },
      { label: "Product Roadmap", path: "/roadmap", icon: IconMap, minRole: "employee" },
    ],
  },
  {
    title: "Leave",
    icon: IconCalendar,
    items: [
      { label: "Apply Leave", path: "/leave/apply", minRole: "employee" },
      { label: "My Leave Details", path: "/leave/details", minRole: "employee" },
      { label: "Leave Approvals", path: "/leave/approvals", minRole: "manager" },
      { label: "Leave Reports", path: "/leave/reports", minRole: "hr_admin" },
    ],
  },
  {
    title: "Attendance & Shift",
    icon: IconClock,
    items: [
      { label: "My / Team Attendance", path: "/attendance", minRole: "employee" },
      { label: "Live Attendance Capture", path: "/attendance/live-capture", minRole: "employee" },
      { label: "Comp-Off", path: "/attendance/comp-off", minRole: "employee" },
      { label: "Shift Swap", path: "/attendance/shift-swap", minRole: "employee" },
      { label: "Bulk Approvals", path: "/attendance/bulk-approvals", minRole: "manager" },
      { label: "Assign Roster", path: "/attendance/roster", minRole: "hr_admin" },
      { label: "Bulk Shift Upload", path: "/attendance/bulk-upload", minRole: "hr_admin" },
      { label: "Attendance Export", path: "/attendance/export", minRole: "hr_admin" },
    ],
  },
  {
    title: "Performance",
    icon: IconTarget,
    items: [
      { label: "Impact Tier Scoring", path: "/performance/scoring", minRole: "manager" },
      { label: "PIP Cases", path: "/performance/pip", minRole: "manager" },
      { label: "Discipline Cases", path: "/performance/discipline", minRole: "hr_admin" },
      { label: "Calibration & Normalization", path: "/performance/calibration", minRole: "hr_admin" },
      { label: "Succession Planning", path: "/performance/succession", minRole: "hr_admin" },
      { label: "KPI Data Ingestion", path: "/performance/kpi-ingestion", minRole: "super_admin" },
    ],
  },
  {
    title: "HRIS Core",
    icon: IconBriefcase,
    items: [
      { label: "Transfers", path: "/hris/transfers", minRole: "employee" },
      { label: "Org Chart", path: "/hris/org-chart", minRole: "employee" },
      { label: "Employee Directory", path: "/hris/directory", minRole: "employee" },
      { label: "Letters", path: "/hris/letters", minRole: "employee" },
      { label: "Policy Hub", path: "/hris/policy-hub", minRole: "employee" },
      { label: "Promotion", path: "/hris/promotion", minRole: "hr_admin" },
      { label: "HRIS Reports", path: "/hris/reports", minRole: "hr_admin" },
    ],
  },
  {
    title: "Onboarding",
    icon: IconUserPlus,
    items: [{ label: "Pre-Onboarding", path: "/onboarding", minRole: "hr_admin" }],
  },
  {
    title: "Exit",
    icon: IconUserMinus,
    items: [
      { label: "Resignation", path: "/exit/resignation", minRole: "employee" },
      { label: "Proxy Resignation", path: "/exit/proxy-resignation", minRole: "manager" },
      { label: "Exit Checklist", path: "/exit/checklist", minRole: "hr_admin" },
      { label: "Rehire", path: "/exit/rehire", minRole: "hr_admin" },
    ],
  },
  {
    title: "Recruitment",
    icon: IconUsers,
    items: [
      { label: "My Referrals", path: "/recruitment/referrals", minRole: "employee" },
      { label: "Open Positions", path: "/recruitment/open-positions", minRole: "employee" },
      { label: "TA Management", path: "/recruitment/ta", minRole: "hr_admin" },
    ],
  },
  {
    title: "Admin",
    icon: IconShield,
    items: [
      { label: "HR Case Management", path: "/admin/cases", minRole: "hr_admin" },
      { label: "Real-Time Analytics", path: "/admin/analytics", minRole: "hr_admin" },
      { label: "Bulk Operations", path: "/admin/bulk-ops", minRole: "hr_admin" },
      { label: "Asset Management", path: "/admin/assets", minRole: "hr_admin" },
      { label: "Document Expiry", path: "/admin/document-expiry", minRole: "hr_admin" },
      { label: "System Reports", path: "/admin/reports", minRole: "hr_admin" },
      { label: "Compliance & Data Privacy", path: "/admin/compliance", minRole: "hr_admin" },
      { label: "Company Setup", path: "/admin/company", minRole: "super_admin" },
      { label: "Policy Configuration", path: "/admin/policy-config", minRole: "super_admin" },
      { label: "User & Role Management", path: "/admin/roles", minRole: "super_admin" },
      { label: "Security (SSO / MFA)", path: "/admin/security", minRole: "super_admin" },
      { label: "Integrations (ERP / GL)", path: "/admin/integrations", minRole: "super_admin" },
      { label: "Audit Log", path: "/admin/audit-log", minRole: "super_admin" },
    ],
  },
  {
    title: "Support",
    items: [{ label: "HR Helpdesk", path: "/helpdesk", icon: IconTicket, minRole: "employee" }],
  },
];

const ROLE_RANK = { employee: 0, manager: 1, hr_admin: 2, super_admin: 3 };
export function roleKeyFor(roleId) {
  return { "ROLE-EMPLOYEE": "employee", "ROLE-MANAGER": "manager", "ROLE-HR-ADMIN": "hr_admin", "ROLE-SUPER-ADMIN": "super_admin" }[roleId] ?? "employee";
}
export function canSee(minRole, currentRoleId) {
  return ROLE_RANK[roleKeyFor(currentRoleId)] >= ROLE_RANK[minRole];
}

// Bottom mobile nav — a tight subset of the highest-value destinations.
export const mobilePrimaryNav = [
  { label: "Home", path: "/", icon: IconHome },
  { label: "Leave", path: "/leave/apply", icon: IconCalendar },
  { label: "Attendance", path: "/attendance", icon: IconClock },
  { label: "Org", path: "/hris/org-chart", icon: IconBuilding },
];
