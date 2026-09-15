import { shiftDefinitions } from "./shiftDefinitions";

// Base roster: which shift each employment normally works (assigned via monthly bulk upload)
const baseShiftMap = {
  "EMY-P001-01": "SHIFT-9TO5",
  "EMY-P002-01": "SHIFT-9TO5",
  "EMY-P003-01": "SHIFT-9TO5",
  "EMY-P004-01": "SHIFT-8TO5-ET",
  "EMY-P005-03": "SHIFT-9TO5",
  "EMY-P006-01": "SHIFT-9TO5",
  "EMY-P007-01": "SHIFT-9TO5",
  "EMY-P008-01": "SHIFT-8TO5-ET",
  "EMY-P009-01": "SHIFT-9HR",
  "EMY-P010-01": "SHIFT-9HR",
  "EMY-P011-01": "SHIFT-9HR",
  "EMY-P012-01": "SHIFT-9HR",
  "EMY-P013-01": "SHIFT-9TO5",
  "EMY-P014-01": "SHIFT-12HR",
  "EMY-P015-01": "SHIFT-NIGHT",
  "EMY-P016-01": "SHIFT-9TO5",
  "EMY-P017-01": "SHIFT-9TO5",
  "EMY-P018-01": "SHIFT-9TO5",
  "EMY-P019-01": "SHIFT-9TO5",
  "EMY-P020-01": "SHIFT-9TO5",
  "EMY-P021-01": "SHIFT-9TO5",
  "EMY-P022-01": "SHIFT-9TO5",
  "EMY-P023-01": "SHIFT-6DAY",
  "EMY-P025-01": "SHIFT-9TO5",
};

// One-off overrides: { employment_id, date: 'YYYY-MM-DD', shift_id, source }
// Used to demo an approved shift swap for Jamal Carter.
const overrides = [
  { employment_id: "EMY-P013-01", date: isoDaysAgo(-2), shift_id: "SHIFT-12HR", source: "swap" },
];

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function shiftById(id) {
  return shiftDefinitions.find((s) => s.shift_id === id);
}

function generateAssignments() {
  const rows = [];
  let seq = 1;
  const start = new Date();
  start.setDate(start.getDate() - 50);
  const end = new Date();
  end.setDate(end.getDate() + 10);

  for (const [employment_id, shift_id] of Object.entries(baseShiftMap)) {
    const shift = shiftById(shift_id);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (!shift.work_days.includes(dow)) continue;
      const dateStr = d.toISOString().slice(0, 10);
      const override = overrides.find((o) => o.employment_id === employment_id && o.date === dateStr);
      rows.push({
        assignment_id: `SA-${String(seq++).padStart(5, "0")}`,
        employment_id,
        shift_id: override ? override.shift_id : shift_id,
        date: dateStr,
        source: override ? override.source : "monthly_bulk",
      });
    }
  }
  return rows;
}

export const shiftAssignments = generateAssignments();
