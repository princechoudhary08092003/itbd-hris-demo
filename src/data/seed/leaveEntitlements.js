import { employments } from "./employments";
import { leaveTypesForLocation } from "./leaveTypes";

const PERIOD = "2026";
const now = new Date();
const yearStart = new Date(`${PERIOD}-01-01T00:00:00`);

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function monthsElapsed(fromDate) {
  const start = fromDate > yearStart ? fromDate : yearStart;
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  return Math.max(0, Math.min(12, months));
}

function generate() {
  const rows = [];
  let seq = 1;
  for (const e of employments) {
    if (e.employment_status === "pre_onboarding" || e.employment_status === "exited") continue;
    const doj = new Date(`${e.date_of_joining}T00:00:00`);
    const applicableTypes = leaveTypesForLocation(e.work_location).filter((lt) => lt.accrual_method !== "none");

    for (const lt of applicableTypes) {
      let accrued = 0;
      let opening = 0;
      if (lt.accrual_method === "monthly_accrual") {
        accrued = Math.round(monthsElapsed(doj) * lt.monthly_accrual * 10) / 10;
        if (doj < yearStart) opening = Math.round(((hash(e.employment_id + lt.code) % 6) + 1) * 10) / 10;
      } else if (lt.accrual_method === "annual_grant") {
        const fullYear = doj < yearStart;
        accrued = fullYear ? lt.annual_grant : Math.round((lt.annual_grant * (12 - doj.getMonth()) / 12) * 10) / 10;
      }
      rows.push({
        entitlement_id: `ENT-${String(seq++).padStart(5, "0")}`,
        employment_id: e.employment_id,
        leave_type_id: lt.leave_type_id,
        period: PERIOD,
        opening,
        accrued,
      });
    }
  }
  return rows;
}

// opening/accrued only — used/closing are always derived live from leave_request state (see leaveService)
export const leaveEntitlements = generate();
