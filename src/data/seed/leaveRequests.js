function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// status: pending_approval | approved | rejected | cancelled | withdrawn
export const leaveRequests = [
  { request_id: "LR-1001", employment_id: "EMY-P013-01", leave_type_id: "LT-PTO", start_date: isoDaysAgo(40), end_date: isoDaysAgo(38), days: 3, status: "approved", approver_id: "EMY-P012-01", applied_on: isoDaysAgo(46), reason: "Family trip" },
  { request_id: "LR-1002", employment_id: "EMY-P007-01", leave_type_id: "LT-SICK-US", start_date: isoDaysAgo(20), end_date: isoDaysAgo(20), days: 1, status: "approved", approver_id: "EMY-P005-03", applied_on: isoDaysAgo(20), reason: "Fever" },
  { request_id: "LR-1003", employment_id: "EMY-P006-01", leave_type_id: "LT-PTO", start_date: isoDaysAhead(3), end_date: isoDaysAhead(5), days: 3, status: "pending_approval", approver_id: "EMY-P003-01", applied_on: isoDaysAgo(2), reason: "Long weekend travel" },
  { request_id: "LR-1004", employment_id: "EMY-P014-01", leave_type_id: "LT-PTO", start_date: isoDaysAhead(7), end_date: isoDaysAhead(7), days: 1, status: "pending_approval", approver_id: "EMY-P012-01", applied_on: isoDaysAgo(1), reason: "Personal errand" },
  { request_id: "LR-1005", employment_id: "EMY-P013-01", leave_type_id: "LT-SICK-US", start_date: isoDaysAhead(2), end_date: isoDaysAhead(2), days: 1, status: "pending_approval", approver_id: "EMY-P012-01", applied_on: isoDaysAgo(1), reason: "Doctor's appointment" },
  { request_id: "LR-1006", employment_id: "EMY-P011-01", leave_type_id: "LT-PTO", start_date: isoDaysAgo(10), end_date: isoDaysAgo(9), days: 2, status: "rejected", approver_id: "EMY-P010-01", applied_on: isoDaysAgo(15), reason: "Overlaps release freeze", rejection_note: "Sprint freeze week — please re-apply for the week after." },
  { request_id: "LR-1007", employment_id: "EMY-P008-01", leave_type_id: "LT-AL-UK", start_date: isoDaysAgo(5), end_date: isoDaysAgo(5), days: 1, status: "cancelled", approver_id: "EMY-P004-01", applied_on: isoDaysAgo(9), reason: "Plans changed" },
  { request_id: "LR-1008", employment_id: "EMY-P022-01", leave_type_id: "LT-PTO", start_date: isoDaysAgo(60), end_date: isoDaysAgo(56), days: 5, status: "approved", approver_id: "EMY-P021-01", applied_on: isoDaysAgo(70), reason: "Annual vacation" },
  { request_id: "LR-1009", employment_id: "EMY-P018-01", leave_type_id: "LT-SICK-US", start_date: isoDaysAgo(1), end_date: isoDaysAgo(1), days: 1, status: "approved", approver_id: "EMY-P016-01", applied_on: isoDaysAgo(1), reason: "Migraine" },
];
