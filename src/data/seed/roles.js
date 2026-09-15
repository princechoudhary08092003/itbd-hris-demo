export const securityRoles = [
  { role_id: "ROLE-EMPLOYEE", name: "Employee", description: "Self-service: own profile, attendance, leave, and org visibility." },
  { role_id: "ROLE-MANAGER", name: "Manager", description: "Everything an Employee has, plus approvals and visibility into their reporting line." },
  { role_id: "ROLE-HR-ADMIN", name: "HR Admin", description: "Full HRIS operational access: onboarding, exits, movement, attendance/leave administration, case management." },
  { role_id: "ROLE-SUPER-ADMIN", name: "Super Admin", description: "HR Admin access plus system configuration, roles/permissions, and audit log." },
];

// Coarse field-level permission grants shown on the Admin > Roles screen.
export const permissionGrants = [
  { role_id: "ROLE-EMPLOYEE", resource: "person.personal_email", access: "read_own" },
  { role_id: "ROLE-EMPLOYEE", resource: "employment.compensation", access: "none" },
  { role_id: "ROLE-EMPLOYEE", resource: "leave_request", access: "create_own" },
  { role_id: "ROLE-MANAGER", resource: "leave_request", access: "approve_direct_reports" },
  { role_id: "ROLE-MANAGER", resource: "attendance_day", access: "read_direct_reports" },
  { role_id: "ROLE-HR-ADMIN", resource: "employment", access: "read_write_all" },
  { role_id: "ROLE-HR-ADMIN", resource: "movement_request", access: "read_write_all" },
  { role_id: "ROLE-SUPER-ADMIN", resource: "security_role", access: "read_write_all" },
  { role_id: "ROLE-SUPER-ADMIN", resource: "audit_log", access: "read_all" },
];

// Which employment is logged in as which role for the demo's role switcher.
export const demoLogins = [
  { login_id: "LOGIN-EMPLOYEE", employment_id: "EMY-P007-01", role_id: "ROLE-EMPLOYEE", label: "Chloe Bennett — Employee" },
  { login_id: "LOGIN-MANAGER", employment_id: "EMY-P012-01", role_id: "ROLE-MANAGER", label: "Grace Oyelaran — Manager" },
  { login_id: "LOGIN-HR-ADMIN", employment_id: "EMY-P017-01", role_id: "ROLE-HR-ADMIN", label: "Ben Thompson — HR Admin" },
  { login_id: "LOGIN-SUPER-ADMIN", employment_id: "EMY-P016-01", role_id: "ROLE-SUPER-ADMIN", label: "Fatima Al-Sayed — Super Admin" },
];
