import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Field";
import { EmptyState, Avatar } from "../../components/ui/Misc";
import { employmentDisplayName, isManagerOf } from "../../lib/selectors";
import { computeLeaveBalance, LEAVE_STATUS_META } from "../../lib/leave";

export default function LeaveApprovals() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const [rejecting, setRejecting] = useState(null);
  const [note, setNote] = useState("");

  const pending = db.leaveRequests
    .filter((lr) => lr.status === "pending_approval")
    .filter((lr) => isHRAdmin || lr.approver_id === employmentId || isManagerOf(db, employmentId, lr.employment_id))
    .sort((a, b) => a.applied_on.localeCompare(b.applied_on));

  const decided = db.leaveRequests
    .filter((lr) => lr.status !== "pending_approval")
    .filter((lr) => isHRAdmin || lr.approver_id === employmentId)
    .slice(0, 8);

  function approve(lr) {
    dispatch({ type: "DECIDE_LEAVE", payload: { request_id: lr.request_id, decision: "approved" } });
  }

  function reject() {
    dispatch({ type: "DECIDE_LEAVE", payload: { request_id: rejecting.request_id, decision: "rejected", note } });
    setRejecting(null);
    setNote("");
  }

  return (
    <div>
      <PageHeader title="Leave Approvals" subtitle="Requests from your reporting line awaiting a decision." />

      <Card className="mb-4">
        {pending.length === 0 ? (
          <EmptyState title="Nothing pending" subtitle="All caught up." />
        ) : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {pending.map((lr) => {
              const lt = db.leaveTypes.find((t) => t.leave_type_id === lr.leave_type_id);
              const balance = computeLeaveBalance(db, lr.employment_id, lr.leave_type_id);
              const name = employmentDisplayName(db, lr.employment_id);
              return (
                <div key={lr.request_id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} size={34} />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{name} — {lt?.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {lr.start_date} → {lr.end_date} ({lr.days}d) · "{lr.reason}"
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Balance available: {balance.available} (before this request)</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="danger" onClick={() => setRejecting(lr)}>Reject</Button>
                    <Button size="sm" variant="success" onClick={() => approve(lr)}>Approve</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Recently decided</p>
        {decided.length === 0 ? (
          <EmptyState title="No history yet" />
        ) : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {decided.map((lr) => {
              const meta = LEAVE_STATUS_META[lr.status];
              return (
                <div key={lr.request_id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-[var(--text-primary)]">{employmentDisplayName(db, lr.employment_id)} — {lr.days}d</span>
                  <Badge tone={meta.tone}>{meta.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title="Reject Leave Request" footer={<Button variant="danger" onClick={reject}>Confirm Reject</Button>}>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for rejection (visible to the employee)" />
      </Modal>
    </div>
  );
}
