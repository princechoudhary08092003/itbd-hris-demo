function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoDaysAhead(n) {
  return isoDaysAgo(-n);
}

// A declared holiday calendar. A couple are placed inside the rolling demo
// window (recent past / near future) so the comp-off and attendance rules
// have real dates to react to.
export const holidays = [
  { holiday_id: "HOL-2026-01", name: "New Year's Day", date: "2026-01-01", locations: ["Chicago HQ", "Austin", "New York"] },
  { holiday_id: "HOL-2026-02", name: "Memorial Day", date: "2026-05-25", locations: ["Chicago HQ", "Austin", "New York"] },
  { holiday_id: "HOL-2026-03", name: "Independence Day", date: "2026-07-04", locations: ["Chicago HQ", "Austin", "New York"] },
  { holiday_id: "HOL-2026-04", name: "Founders Day", date: isoDaysAgo(18), locations: ["Chicago HQ", "Austin", "New York"] },
  { holiday_id: "HOL-2026-05", name: "Labour Day (UK)", date: isoDaysAgo(12), locations: ["London"] },
  { holiday_id: "HOL-2026-06", name: "Thanksgiving Day", date: isoDaysAhead(60), locations: ["Chicago HQ", "Austin", "New York"] },
  { holiday_id: "HOL-2026-07", name: "Christmas Day", date: "2026-12-25", locations: ["Chicago HQ", "Austin", "New York", "London"] },
];
