import { getEmployment } from "./selectors";

export function pad(n) {
  return String(n).padStart(2, "0");
}

export function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function weekdayOf(dateStr) {
  return new Date(`${dateStr}T00:00:00`).getDay();
}

// The finance cycle runs the 21st of one month through the 20th of the next.
export function getCycleForDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDate();
  let cycleStartMonth = d.getMonth();
  let cycleStartYear = d.getFullYear();
  if (day < 21) {
    cycleStartMonth -= 1;
    if (cycleStartMonth < 0) {
      cycleStartMonth = 11;
      cycleStartYear -= 1;
    }
  }
  const start = new Date(cycleStartYear, cycleStartMonth, 21);
  const end = new Date(cycleStartYear, cycleStartMonth + 1, 20);
  return {
    start: toDateStr(start),
    end: toDateStr(end),
    label: `${start.toLocaleString("en-US", { month: "short" })} 21 – ${end.toLocaleString("en-US", { month: "short" })} 20, ${end.getFullYear()}`,
  };
}

export function isLockedForPayroll(dateStr, today = toDateStr(new Date())) {
  const currentCycle = getCycleForDate(today);
  return dateStr < currentCycle.start;
}

// work_location strings often carry a suffix (" – Remote", " – Client A") that
// the holiday calendar's location list doesn't include — match on the base site.
export function baseLocation(workLocation) {
  return workLocation?.split(" – ")[0]?.trim() ?? workLocation;
}

export function isHoliday(db, dateStr, workLocation) {
  const base = baseLocation(workLocation);
  return db.holidays.find((h) => h.date === dateStr && h.locations.includes(base)) ?? null;
}

export function approvedLeaveCovering(db, employmentId, dateStr) {
  return db.leaveRequests.find(
    (lr) => lr.employment_id === employmentId && lr.status === "approved" && lr.start_date <= dateStr && lr.end_date >= dateStr
  ) ?? null;
}

function shiftById(db, shiftId) {
  return db.shiftDefinitions.find((s) => s.shift_id === shiftId);
}

function combine(dateStr, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Computes attendance_day for one employment on one date, purely from
 * shift_assignment + punch_event + leave_request + holiday data — nothing
 * about the outcome is pre-stored.
 */
export function computeAttendanceDay(db, employmentId, dateStr) {
  const employment = getEmployment(db, employmentId);
  const locked = isLockedForPayroll(dateStr);
  const assignment = db.shiftAssignments.find((sa) => sa.employment_id === employmentId && sa.date === dateStr);

  if (!assignment) {
    const holiday = employment ? isHoliday(db, dateStr, employment.work_location) : null;
    if (holiday) return { date: dateStr, status: "holiday", label: holiday.name, first_in: null, last_out: null, total_hours: 0, is_late: false, locked_for_payroll: locked, shift: null };
    const leave = approvedLeaveCovering(db, employmentId, dateStr);
    if (leave) return { date: dateStr, status: "leave", first_in: null, last_out: null, total_hours: 0, is_late: false, locked_for_payroll: locked, shift: null, leave_type_id: leave.leave_type_id };
    return { date: dateStr, status: "week_off", first_in: null, last_out: null, total_hours: 0, is_late: false, locked_for_payroll: locked, shift: null };
  }

  const shift = shiftById(db, assignment.shift_id);
  const shiftStart = combine(dateStr, shift.start_time);
  let shiftEnd = combine(dateStr, shift.end_time);
  if (shift.crosses_midnight) shiftEnd.setDate(shiftEnd.getDate() + 1);

  const windowStart = new Date(shiftStart.getTime() - 4 * 3600000);
  const windowEnd = new Date(shiftEnd.getTime() + 4 * 3600000);

  const punches = db.punchEvents
    .filter((p) => p.employment_id === employmentId)
    .map((p) => ({ ...p, ts: new Date(p.timestamp_utc) }))
    .filter((p) => p.ts >= windowStart && p.ts <= windowEnd)
    .sort((a, b) => a.ts - b.ts);

  const inPunches = punches.filter((p) => p.direction === "in");
  const outPunches = punches.filter((p) => p.direction === "out");
  const firstIn = inPunches[0] ?? null;
  const lastOut = outPunches[outPunches.length - 1] ?? null;

  if (!firstIn && !lastOut) {
    const leave = approvedLeaveCovering(db, employmentId, dateStr);
    if (leave) return { date: dateStr, status: "leave", first_in: null, last_out: null, total_hours: 0, is_late: false, locked_for_payroll: locked, shift, leave_type_id: leave.leave_type_id };
    return { date: dateStr, status: "absent", first_in: null, last_out: null, total_hours: 0, is_late: false, locked_for_payroll: locked, shift };
  }

  const graceInDeadline = new Date(shiftStart.getTime() + shift.grace_in_minutes * 60000);
  const isLate = firstIn ? firstIn.ts > graceInDeadline : false;

  let totalHours = 0;
  if (firstIn && lastOut && lastOut.ts > firstIn.ts) {
    const rawMinutes = (lastOut.ts - firstIn.ts) / 60000 - shift.break_minutes;
    totalHours = Math.max(0, Math.round((rawMinutes / 60) * 100) / 100);
  }

  const shiftDurationHours = (shiftEnd - shiftStart) / 3600000 - shift.break_minutes / 60;
  let status = "present";
  if (!firstIn || !lastOut) status = "half_day";
  else if (totalHours < shiftDurationHours * 0.5) status = "half_day";

  return {
    date: dateStr,
    status,
    first_in: firstIn?.timestamp_utc ?? null,
    last_out: lastOut?.timestamp_utc ?? null,
    total_hours: totalHours,
    is_late: isLate,
    locked_for_payroll: locked,
    shift,
    punch_sources: punches.map((p) => p.source),
  };
}

export function computeAttendanceRange(db, employmentId, startDate, endDate) {
  const days = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    days.push(computeAttendanceDay(db, employmentId, cursor));
    cursor = addDays(cursor, 1);
  }
  return days;
}

export function formatTime(isoTimestamp) {
  if (!isoTimestamp) return "—";
  return new Date(isoTimestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export const ATTENDANCE_STATUS_META = {
  present: { label: "Present", tone: "green" },
  half_day: { label: "Half Day", tone: "amber" },
  absent: { label: "Absent", tone: "red" },
  leave: { label: "On Leave", tone: "cyan" },
  holiday: { label: "Holiday", tone: "violet" },
  week_off: { label: "Week Off", tone: "neutral" },
};
