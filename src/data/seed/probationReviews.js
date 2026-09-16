import { employments } from "./employments";

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

const PROBATION_DAYS = 90;
const today = toDateStr(new Date());

// A probation review is due 90 days after date_of_joining. We surface any
// employment whose review date falls within a wide window around "today" so
// the screen always has something live to show, regardless of when the demo
// is run, plus a couple of hand-placed historical examples for variety.
function generateWindowReviews() {
  const rows = [];
  let seq = 1;
  for (const e of employments) {
    if (!e.date_of_joining || e.employment_status === "exited") continue;
    const reviewDate = addDays(e.date_of_joining, PROBATION_DAYS);
    const withinWindow = reviewDate >= addDays(today, -120) && reviewDate <= addDays(today, 45);
    if (!withinWindow) continue;
    rows.push({
      review_id: `PROB-${String(seq++).padStart(3, "0")}`,
      employment_id: e.employment_id,
      review_date: reviewDate,
      status: reviewDate <= today ? "completed" : "scheduled",
      outcome: reviewDate <= today ? "confirmed" : null,
      reviewed_by: null,
      notes: "",
    });
  }
  return rows;
}

// Static historical examples, independent of "today" drift.
const staticReviews = [
  { review_id: "PROB-H01", employment_id: "EMY-P018-01", review_date: "2024-01-29", status: "completed", outcome: "confirmed", reviewed_by: "EMY-P016-01", notes: "Strong ramp on HR case intake; confirmed on schedule." },
  { review_id: "PROB-H02", employment_id: "EMY-P015-01", review_date: "2024-05-26", status: "completed", outcome: "extended", reviewed_by: "EMY-P012-01", notes: "Night-shift handover process still developing; extended 30 days." },
];

// Always-current "due soon" examples so the screen has something live to
// act on regardless of when the demo is run.
const dueSoonReviews = [
  { review_id: "PROB-D01", employment_id: "EMY-P025-01", review_date: addDays(today, 4), status: "scheduled", outcome: null, reviewed_by: null, notes: "" },
  { review_id: "PROB-D02", employment_id: "EMY-P014-01", review_date: addDays(today, 11), status: "scheduled", outcome: null, reviewed_by: null, notes: "" },
];

export const probationReviews = [...generateWindowReviews(), ...staticReviews, ...dueSoonReviews];
