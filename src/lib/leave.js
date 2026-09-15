import { leaveTypesForLocation } from "../data/seed/leaveTypes";
import { getEmployment } from "./selectors";

export function leaveTypesFor(db, employmentId) {
  const employment = getEmployment(db, employmentId);
  if (!employment) return [];
  return leaveTypesForLocation(employment.work_location);
}

/**
 * Live balance = opening + accrued − used (approved) − pending (submitted, not yet decided).
 * `used` and `pending` are never stored — they're derived from leave_requests every render.
 */
export function computeLeaveBalance(db, employmentId, leaveTypeId) {
  const entitlement = db.leaveEntitlements.find((e) => e.employment_id === employmentId && e.leave_type_id === leaveTypeId);
  const opening = entitlement?.opening ?? 0;
  const accrued = entitlement?.accrued ?? 0;

  const requests = db.leaveRequests.filter((lr) => lr.employment_id === employmentId && lr.leave_type_id === leaveTypeId);
  const used = requests.filter((lr) => lr.status === "approved").reduce((sum, lr) => sum + lr.days, 0);
  const pending = requests.filter((lr) => lr.status === "pending_approval").reduce((sum, lr) => sum + lr.days, 0);

  const closing = Math.round((opening + accrued - used) * 100) / 100;
  const available = Math.round((closing - pending) * 100) / 100;

  return { opening, accrued, used, pending, closing, available };
}

export function allBalancesFor(db, employmentId) {
  return leaveTypesFor(db, employmentId).map((lt) => ({ leaveType: lt, balance: computeLeaveBalance(db, employmentId, lt.leave_type_id) }));
}

export function countBusinessDays(startDate, endDate) {
  let count = 0;
  let cursor = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  while (cursor <= end) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

export const LEAVE_STATUS_META = {
  pending_approval: { label: "Pending Approval", tone: "amber" },
  approved: { label: "Approved", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
  cancelled: { label: "Cancelled", tone: "neutral" },
  withdrawn: { label: "Withdrawn", tone: "neutral" },
};
