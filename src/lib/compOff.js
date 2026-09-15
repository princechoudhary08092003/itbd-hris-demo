import { isHoliday } from "./attendance";
import { getEmployment } from "./selectors";

// A worked day is comp-off eligible if the employee punched in on a date that
// was either a declared holiday for their location, or not part of their
// assigned roster (a week-off) — and no comp_off record already covers it.
export function eligibleCompOffDays(db, employmentId) {
  const employment = getEmployment(db, employmentId);
  if (!employment) return [];
  const punchDates = [...new Set(db.punchEvents.filter((p) => p.employment_id === employmentId).map((p) => p.timestamp_utc.slice(0, 10)))];
  const alreadyLogged = new Set(db.compOffs.filter((c) => c.employment_id === employmentId).map((c) => c.worked_date));

  const results = [];
  for (const date of punchDates) {
    if (alreadyLogged.has(date)) continue;
    const holiday = isHoliday(db, date, employment.work_location);
    const hasRoster = db.shiftAssignments.some((sa) => sa.employment_id === employmentId && sa.date === date);
    if (holiday) results.push({ date, reason: `Worked on holiday — ${holiday.name}` });
    else if (!hasRoster) results.push({ date, reason: "Worked on a scheduled week-off day" });
  }
  return results.sort((a, b) => b.date.localeCompare(a.date));
}
