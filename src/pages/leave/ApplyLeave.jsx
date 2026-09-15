import { useMemo, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Input, Select, Textarea } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { leaveTypesFor, computeLeaveBalance, countBusinessDays, LEAVE_STATUS_META } from "../../lib/leave";
import { managerEmploymentOf, employmentDisplayName } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";
import { EmptyState } from "../../components/ui/Misc";

export default function ApplyLeave() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const leaveTypes = leaveTypesFor(db, employmentId);
  const manager = managerEmploymentOf(db, employmentId);

  const defaultDate = addDays(toDateStr(new Date()), 7);
  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.leave_type_id ?? "");
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");

  const days = useMemo(() => (startDate && endDate && endDate >= startDate ? countBusinessDays(startDate, endDate) : 0), [startDate, endDate]);
  const balance = leaveTypeId ? computeLeaveBalance(db, employmentId, leaveTypeId) : null;

  const myRequests = db.leaveRequests
    .filter((lr) => lr.employment_id === employmentId)
    .slice()
    .sort((a, b) => b.applied_on.localeCompare(a.applied_on));

  function submit(e) {
    e.preventDefault();
    if (!leaveTypeId || days <= 0) return;
    dispatch({
      type: "APPLY_LEAVE",
      payload: { employment_id: employmentId, leave_type_id: leaveTypeId, start_date: startDate, end_date: endDate, days, reason, approver_id: manager?.employment_id ?? null },
    });
    setReason("");
    setToast(`Leave request submitted for ${days} day(s), pending approval${manager ? ` from ${employmentDisplayName(db, manager.employment_id)}` : ""}.`);
    setTimeout(() => setToast(""), 4000);
  }

  function cancel(requestId) {
    dispatch({ type: "CANCEL_LEAVE", payload: { request_id: requestId } });
  }

  return (
    <div>
      <PageHeader title="Apply Leave" subtitle="Balances update live as requests are applied and approved." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="New Leave Request" />
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldGroup label="Leave Type">
                <Select value={leaveTypeId} onChange={(e) => setLeaveTypeId(e.target.value)}>
                  {leaveTypes.map((lt) => (
                    <option key={lt.leave_type_id} value={lt.leave_type_id}>{lt.name} ({lt.code})</option>
                  ))}
                </Select>
              </FieldGroup>
              <FieldGroup label="Approver">
                <Input value={manager ? employmentDisplayName(db, manager.employment_id) : "No manager on file"} disabled />
              </FieldGroup>
              <FieldGroup label="Start Date">
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </FieldGroup>
              <FieldGroup label="End Date">
                <Input type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} />
              </FieldGroup>
            </div>
            <FieldGroup label="Reason">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason for the request" required />
            </FieldGroup>

            {balance && (
              <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[var(--surface-2)] px-3 py-2.5 text-sm">
                <span>Requesting: <strong className="font-mono-data">{days}</strong> day(s)</span>
                <span>Available before this request: <strong className="font-mono-data">{balance.available}</strong></span>
                <span className={days > balance.available ? "font-medium text-red-500" : "font-medium text-brand-green-dark dark:text-brand-green"}>
                  Balance after approval: {Math.round((balance.available - days) * 100) / 100}
                </span>
              </div>
            )}

            {toast && <p className="text-sm text-brand-green-dark dark:text-brand-green">{toast}</p>}

            <div>
              <Button type="submit" disabled={days <= 0 || (balance && days > balance.available)}>Submit Request</Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader title="Leave Balance" />
          <div className="flex flex-col gap-3">
            {leaveTypesFor(db, employmentId).map((lt) => {
              const b = computeLeaveBalance(db, employmentId, lt.leave_type_id);
              return (
                <div key={lt.leave_type_id} className="rounded-lg border border-[var(--surface-border)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{lt.name}</span>
                    <span className="font-mono-data text-sm font-semibold text-brand-cyan-dark dark:text-brand-cyan">{b.available}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">opening {b.opening} + accrued {b.accrued} − used {b.used} − pending {b.pending}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="My Leave Requests" />
        {myRequests.length === 0 ? (
          <EmptyState title="No leave requests yet" />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>Type</TH>
                <TH>Dates</TH>
                <TH>Days</TH>
                <TH>Status</TH>
                <TH>Applied On</TH>
                <TH></TH>
              </TRow>
            </THead>
            <tbody>
              {myRequests.map((lr) => {
                const lt = db.leaveTypes.find((t) => t.leave_type_id === lr.leave_type_id);
                const meta = LEAVE_STATUS_META[lr.status];
                return (
                  <TRow key={lr.request_id}>
                    <TD>{lt?.name}</TD>
                    <TD className="font-mono-data">{lr.start_date} → {lr.end_date}</TD>
                    <TD className="font-mono-data">{lr.days}</TD>
                    <TD><Badge tone={meta.tone}>{meta.label}</Badge></TD>
                    <TD className="font-mono-data text-xs">{lr.applied_on}</TD>
                    <TD>
                      {lr.status === "pending_approval" && (
                        <Button size="sm" variant="danger" onClick={() => cancel(lr.request_id)}>Withdraw</Button>
                      )}
                    </TD>
                  </TRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
