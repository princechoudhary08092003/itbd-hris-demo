import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Select, Textarea } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/Misc";
import { managerEmploymentOf, employmentDisplayName, isManagerOf } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";

const STATUS_TONE = { pending_approval: "amber", approved: "green", rejected: "red" };

export default function ShiftSwap() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const manager = managerEmploymentOf(db, employmentId);

  const upcoming = db.shiftAssignments
    .filter((sa) => sa.employment_id === employmentId && sa.date >= toDateStr(new Date()) && sa.date <= addDays(toDateStr(new Date()), 14))
    .sort((a, b) => a.date.localeCompare(b.date));

  const [date, setDate] = useState(upcoming[0]?.date ?? "");
  const [toShift, setToShift] = useState("");
  const [reason, setReason] = useState("");

  const currentAssignment = upcoming.find((u) => u.date === date);

  const myRequests = db.shiftSwapRequests.filter((s) => s.employment_id === employmentId);
  const forApproval = db.shiftSwapRequests.filter((s) => s.status === "pending_approval" && (isHRAdmin || isManagerOf(db, employmentId, s.employment_id)));

  function submit(e) {
    e.preventDefault();
    if (!date || !toShift || !currentAssignment) return;
    dispatch({
      type: "REQUEST_SHIFT_SWAP",
      payload: { employment_id: employmentId, date, from_shift_id: currentAssignment.shift_id, to_shift_id: toShift, approver_id: manager?.employment_id ?? null, reason },
    });
    setReason("");
  }

  function decide(s, decision) {
    dispatch({ type: "DECIDE_SHIFT_SWAP", payload: { swap_id: s.swap_id, decision } });
  }

  function shiftName(id) {
    return db.shiftDefinitions.find((s) => s.shift_id === id)?.name ?? "—";
  }

  return (
    <div>
      <PageHeader title="Shift Swap / Change Request" subtitle="Requests carry a full approval trail before the roster updates." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Request a Shift Change" />
          <form onSubmit={submit} className="flex flex-col gap-4">
            <FieldGroup label="Upcoming shift date">
              <Select value={date} onChange={(e) => setDate(e.target.value)}>
                {upcoming.map((u) => (
                  <option key={u.date} value={u.date}>{u.date} — currently {shiftName(u.shift_id)}</option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup label="Requested shift">
              <Select value={toShift} onChange={(e) => setToShift(e.target.value)}>
                <option value="">Select a shift</option>
                {db.shiftDefinitions.filter((s) => s.shift_id !== currentAssignment?.shift_id).map((s) => (
                  <option key={s.shift_id} value={s.shift_id}>{s.name}</option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup label="Reason">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why you need the change" required />
            </FieldGroup>
            <div>
              <Button type="submit" disabled={!date || !toShift}>Submit Request</Button>
            </div>
          </form>
        </Card>

        <Card>
          <CardHeader title="My Requests" />
          {myRequests.length === 0 ? (
            <EmptyState title="No shift swap requests yet" />
          ) : (
            <div className="flex flex-col divide-y divide-[var(--surface-border)]">
              {myRequests.map((s) => (
                <div key={s.swap_id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-data text-sm text-[var(--text-primary)]">{s.date}</span>
                    <Badge tone={STATUS_TONE[s.status]}>{s.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">{shiftName(s.from_shift_id)} → {shiftName(s.to_shift_id)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {forApproval.length > 0 && (
        <Card className="mt-4">
          <CardHeader title="Approval Queue" />
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {forApproval.map((s) => (
              <div key={s.swap_id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, s.employment_id)} — {s.date}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{shiftName(s.from_shift_id)} → {shiftName(s.to_shift_id)} · "{s.reason}"</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="danger" onClick={() => decide(s, "rejected")}>Reject</Button>
                  <Button size="sm" variant="success" onClick={() => decide(s, "approved")}>Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
