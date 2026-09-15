function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// initiated_by: self | proxy · status: submitted | acknowledged | withdrawn | completed
export const resignations = [
  { resignation_id: "RES-2022-004", employment_id: "EMY-P005-01", initiated_by: "self", resignation_date: "2022-05-15", last_working_day: "2022-06-28", status: "completed", reason: "Relocating for graduate studies" },
  { resignation_id: "RES-2026-011", employment_id: "EMY-P022-01", initiated_by: "proxy", initiated_by_employment_id: "EMY-P021-01", resignation_date: isoDaysAgo(10), last_working_day: isoDaysAhead(20), status: "acknowledged", reason: "Unresponsive beyond policy threshold — proxy resignation raised by manager with HR sign-off" },
];

// exit_checklist item: asset_return | access_revocation | final_documents | knowledge_transfer
// status: pending | in_progress | completed
export const exitChecklists = [
  { checklist_id: "EXC-01", employment_id: "EMY-P005-01", item: "asset_return", status: "completed", completed_by: "EMY-P017-01", completed_at: "2022-06-27" },
  { checklist_id: "EXC-02", employment_id: "EMY-P005-01", item: "access_revocation", status: "completed", completed_by: "EMY-P017-01", completed_at: "2022-06-28" },
  { checklist_id: "EXC-03", employment_id: "EMY-P005-01", item: "final_documents", status: "completed", completed_by: "EMY-P020-01", completed_at: "2022-06-30" },
  { checklist_id: "EXC-04", employment_id: "EMY-P005-01", item: "knowledge_transfer", status: "completed", completed_by: "EMY-P005-01", completed_at: "2022-06-24" },

  { checklist_id: "EXC-05", employment_id: "EMY-P022-01", item: "knowledge_transfer", status: "in_progress", completed_by: null, completed_at: null },
  { checklist_id: "EXC-06", employment_id: "EMY-P022-01", item: "asset_return", status: "pending", completed_by: null, completed_at: null },
  { checklist_id: "EXC-07", employment_id: "EMY-P022-01", item: "access_revocation", status: "pending", completed_by: null, completed_at: null },
  { checklist_id: "EXC-08", employment_id: "EMY-P022-01", item: "final_documents", status: "pending", completed_by: null, completed_at: null },
];
