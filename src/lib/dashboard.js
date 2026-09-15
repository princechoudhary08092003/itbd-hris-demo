import { activeEmployments, getEmployment, personForEmployment } from "./selectors";
import { toDateStr, addDays, baseLocation } from "./attendance";

export function upcomingBirthdays(db, withinDays = 30) {
  const today = new Date();
  return activeEmployments(db)
    .map((e) => {
      const person = personForEmployment(db, e.employment_id);
      if (!person?.dob) return null;
      const dob = new Date(`${person.dob}T00:00:00`);
      const next = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < new Date(today.toDateString())) next.setFullYear(today.getFullYear() + 1);
      const days = Math.round((next - new Date(today.toDateString())) / 86400000);
      return days <= withinDays ? { employment_id: e.employment_id, person, date: next, days } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.days - b.days);
}

export function upcomingHolidays(db, workLocation, withinDays = 45) {
  const today = toDateStr(new Date());
  const cutoff = addDays(today, withinDays);
  const base = baseLocation(workLocation);
  return db.holidays
    .filter((h) => h.locations.includes(base) && h.date >= today && h.date <= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function awaitingMyAction(db, employmentId, isHRAdmin = false) {
  const actions = [];

  for (const lr of db.leaveRequests) {
    if (lr.status === "pending_approval" && lr.approver_id === employmentId) {
      actions.push({ type: "leave", id: lr.request_id, label: "Leave request", detail: `${lr.days} day(s)`, employmentId: lr.employment_id, date: lr.applied_on });
    }
  }
  for (const c of db.compOffs) {
    if (c.status === "pending_approval") {
      const manager = ownerManagerId(db, c.employment_id);
      if (manager === employmentId) actions.push({ type: "comp_off", id: c.comp_off_id, label: "Comp-off request", detail: c.worked_date, employmentId: c.employment_id, date: c.worked_date });
    }
  }
  // Movement requests are decided by HR Admin only (see Transfers screen).
  if (isHRAdmin) {
    for (const m of db.movementRequests) {
      if (m.status === "pending_approval") {
        actions.push({ type: "movement", id: m.movement_id, label: "Movement request", detail: m.movement_type.replace(/_/g, " "), employmentId: m.employment_id, date: m.created_at });
      }
    }
  }
  for (const t of db.helpdeskTickets) {
    if ((t.status === "open" || t.status === "in_progress") && t.assigned_to === employmentId) {
      actions.push({ type: "helpdesk", id: t.ticket_id, label: "Helpdesk ticket", detail: t.subject, employmentId: t.employment_id, date: t.raised_on });
    }
  }
  return actions.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));
}

function ownerManagerId(db, employmentId) {
  const e = getEmployment(db, employmentId);
  if (!e) return null;
  const pos = db.positions.find((p) => p.position_id === e.position_id);
  if (!pos?.reports_to_position_id) return null;
  const manager = db.employments.find((m) => m.position_id === pos.reports_to_position_id && m.employment_status !== "exited");
  return manager?.employment_id ?? null;
}
