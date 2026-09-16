function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// stage: nte_issued -> employee_response -> ntd_issued -> closed
export const disciplineCases = [
  {
    case_id: "DISC-2026-01",
    employment_id: "EMY-P014-01", // Wei Zhang
    issued_by: "EMY-P012-01", // Grace Oyelaran
    hr_approver_id: "EMY-P017-01",
    stage: "employee_response",
    violation_type: "attendance_policy",
    description: "Three unapproved late punches beyond grace period within one payroll cycle.",
    nte_date: isoDaysAgo(6),
    response_due_date: isoDaysAhead(2),
    ntd_date: null,
    decision: null,
  },
  {
    case_id: "DISC-2025-011",
    employment_id: "EMY-P006-01", // Miguel Torres
    issued_by: "EMY-P003-01", // Daniel Osei
    hr_approver_id: "EMY-P016-01", // Fatima Al-Sayed
    stage: "closed",
    violation_type: "data_handling",
    description: "Shared client credentials over an unapproved channel.",
    nte_date: "2025-12-02",
    response_due_date: "2025-12-09",
    ntd_date: "2025-12-15",
    decision: "written_warning",
  },
];
