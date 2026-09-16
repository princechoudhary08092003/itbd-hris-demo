function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// stage: initiated -> manager_review -> hr_review -> closed
export const pipCases = [
  {
    pip_id: "PIP-2026-01",
    employment_id: "EMY-P011-01", // Noah Becker
    manager_id: "EMY-P010-01", // Ravi Shankar
    hr_approver_id: "EMY-P017-01", // Ben Thompson
    stage: "manager_review",
    reason: "Missed two consecutive sprint commitments; results index trending below team baseline.",
    start_date: isoDaysAgo(21),
    target_end_date: isoDaysAhead(39),
    letter_generated: true,
  },
  {
    pip_id: "PIP-2026-02",
    employment_id: "EMY-P022-01", // Tara Singh
    manager_id: "EMY-P021-01", // Marcus Reyes
    hr_approver_id: "EMY-P017-01",
    stage: "initiated",
    reason: "Pipeline conversion rate below target for two consecutive quarters.",
    start_date: isoDaysAgo(3),
    target_end_date: isoDaysAhead(57),
    letter_generated: false,
  },
  {
    pip_id: "PIP-2025-014",
    employment_id: "EMY-P007-01", // Chloe Bennett
    manager_id: "EMY-P005-03", // Priya Nair
    hr_approver_id: "EMY-P017-01",
    stage: "closed",
    reason: "Client escalation response time consistently missed SLA.",
    start_date: "2025-11-10",
    target_end_date: "2026-01-09",
    outcome: "improved",
    letter_generated: true,
  },
];
