export function getPerson(db, personId) {
  return db.people.find((p) => p.person_id === personId) ?? null;
}

export function getEmployment(db, employmentId) {
  return db.employments.find((e) => e.employment_id === employmentId) ?? null;
}

export function getPosition(db, positionId) {
  return db.positions.find((p) => p.position_id === positionId) ?? null;
}

export function getOrgUnit(db, orgUnitId) {
  return db.orgUnits.find((o) => o.org_unit_id === orgUnitId) ?? null;
}

export function personForEmployment(db, employmentId) {
  const e = getEmployment(db, employmentId);
  return e ? getPerson(db, e.person_id) : null;
}

export function employmentDisplayName(db, employmentId) {
  const person = personForEmployment(db, employmentId);
  return person ? `${person.first_name} ${person.last_name}` : "Unknown";
}

export function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function activeEmployments(db) {
  return db.employments.filter((e) => e.employment_status === "active" || e.employment_status === "on_leave" || e.employment_status === "notice");
}

export function allEmploymentsForPerson(db, personId) {
  return db.employments
    .filter((e) => e.person_id === personId)
    .slice()
    .sort((a, b) => (a.date_of_joining ?? "").localeCompare(b.date_of_joining ?? ""));
}

export function managerEmploymentOf(db, employmentId) {
  const e = getEmployment(db, employmentId);
  if (!e) return null;
  const pos = getPosition(db, e.position_id);
  if (!pos?.reports_to_position_id) return null;
  return db.employments.find(
    (other) => other.position_id === pos.reports_to_position_id && (other.employment_status === "active" || other.employment_status === "notice" || other.employment_status === "on_leave")
  ) ?? null;
}

export function directReportEmployments(db, managerEmploymentId) {
  const manager = getEmployment(db, managerEmploymentId);
  if (!manager) return [];
  const managerPosition = manager.position_id;
  const reportPositions = db.positions.filter((p) => p.reports_to_position_id === managerPosition).map((p) => p.position_id);
  return activeEmployments(db).filter((e) => reportPositions.includes(e.position_id));
}

export function isManagerOf(db, managerEmploymentId, employmentId) {
  return directReportEmployments(db, managerEmploymentId).some((e) => e.employment_id === employmentId);
}

export function orgUnitPath(db, orgUnitId) {
  const path = [];
  let current = getOrgUnit(db, orgUnitId);
  while (current) {
    path.unshift(current);
    current = current.parent_org_unit_id ? getOrgUnit(db, current.parent_org_unit_id) : null;
  }
  return path;
}

export function employmentTypeLabel(type) {
  return { employee: "Employee", vendor: "Vendor", contractor: "Contractor" }[type] ?? type;
}

export function statusLabel(status) {
  return {
    pre_onboarding: "Pre-onboarding",
    active: "Active",
    on_leave: "On Leave",
    notice: "Serving Notice",
    terminated: "Terminated",
    exited: "Exited",
  }[status] ?? status;
}
