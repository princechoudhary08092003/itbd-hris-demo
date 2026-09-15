function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// category: benefits | payslip | id_card | policy_clarification | other
// status: open | in_progress | resolved | closed
export const helpdeskTickets = [
  { ticket_id: "HD-3001", employment_id: "EMY-P007-01", category: "id_card", subject: "Badge not working at the Chicago HQ turnstile", status: "open", raised_on: isoDaysAgo(2), assigned_to: "EMY-P017-01", messages: [{ from: "EMY-P007-01", text: "My badge stopped scanning at the front entrance since Monday.", at: isoDaysAgo(2) }] },
  { ticket_id: "HD-3002", employment_id: "EMY-P013-01", category: "payslip", subject: "August payslip shows wrong leave deduction", status: "in_progress", raised_on: isoDaysAgo(6), assigned_to: "EMY-P017-01", messages: [{ from: "EMY-P013-01", text: "I was on approved PTO for 1 day but 2 days were deducted.", at: isoDaysAgo(6) }, { from: "EMY-P017-01", text: "Looking into it with payroll, will update by end of week.", at: isoDaysAgo(4) }] },
  { ticket_id: "HD-3003", employment_id: "EMY-P011-01", category: "policy_clarification", subject: "Is remote work from another state allowed for 2 weeks?", status: "resolved", raised_on: isoDaysAgo(15), assigned_to: "EMY-P016-01", messages: [{ from: "EMY-P011-01", text: "Can I work remotely from my parents' place in another state for 2 weeks?", at: isoDaysAgo(15) }, { from: "EMY-P016-01", text: "Yes, up to 30 days/year is fine under the remote-work policy — just log it with your manager.", at: isoDaysAgo(13) }] },
];
