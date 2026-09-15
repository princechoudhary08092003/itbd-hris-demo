function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// status: pending_approval | approved | redeemed | expired
export const compOffs = [
  { comp_off_id: "CO-101", employment_id: "EMY-P012-01", worked_date: isoDaysAgo(18), status: "approved", redeemed_on_date: null, approved_by: "EMY-P009-01", reason: "Covered client incident on Founders Day holiday" },
  { comp_off_id: "CO-102", employment_id: "EMY-P011-01", worked_date: isoDaysAgo(9), status: "pending_approval", redeemed_on_date: null, approved_by: null, reason: "Deployed platform hotfix on a scheduled week-off day" },
  { comp_off_id: "CO-103", employment_id: "EMY-P014-01", worked_date: isoDaysAgo(33), status: "redeemed", redeemed_on_date: isoDaysAgo(5), approved_by: "EMY-P012-01", reason: "Covered on-call rotation on a week-off day" },
];
