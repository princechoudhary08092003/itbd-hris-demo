import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/Misc";
import { isManagerOf, employmentDisplayName } from "../../lib/selectors";

export default function BulkApprovals() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const [selected, setSelected] = useState(new Set());

  const canAct = (empId) => isHRAdmin || isManagerOf(db, employmentId, empId);

  const items = [
    ...db.leaveRequests.filter((r) => r.status === "pending_approval" && canAct(r.employment_id)).map((r) => ({ key: `leave-${r.request_id}`, kind: "Leave", ref: r, label: `${employmentDisplayName(db, r.employment_id)} — ${r.days}d leave`, detail: `${r.start_date} → ${r.end_date}` })),
    ...db.compOffs.filter((c) => c.status === "pending_approval" && canAct(c.employment_id)).map((c) => ({ key: `comp-${c.comp_off_id}`, kind: "Comp-Off", ref: c, label: `${employmentDisplayName(db, c.employment_id)} — comp-off`, detail: c.worked_date })),
    ...db.shiftSwapRequests.filter((s) => s.status === "pending_approval" && canAct(s.employment_id)).map((s) => ({ key: `swap-${s.swap_id}`, kind: "Shift Swap", ref: s, label: `${employmentDisplayName(db, s.employment_id)} — shift swap`, detail: s.date })),
  ];

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function decideOne(item, decision) {
    if (item.kind === "Leave") dispatch({ type: "DECIDE_LEAVE", payload: { request_id: item.ref.request_id, decision } });
    if (item.kind === "Comp-Off") dispatch({ type: "DECIDE_COMP_OFF", payload: { comp_off_id: item.ref.comp_off_id, decision, approved_by: employmentId } });
    if (item.kind === "Shift Swap") dispatch({ type: "DECIDE_SHIFT_SWAP", payload: { swap_id: item.ref.swap_id, decision } });
  }

  function bulkApprove() {
    items.filter((i) => selected.has(i.key)).forEach((i) => decideOne(i, "approved"));
    setSelected(new Set());
  }

  return (
    <div>
      <PageHeader
        title="Bulk Task Approval"
        subtitle="Leave, comp-off, and shift swap requests from your team in one queue."
        action={<Button disabled={selected.size === 0} onClick={bulkApprove}>Approve Selected ({selected.size})</Button>}
      />

      <Card>
        {items.length === 0 ? (
          <EmptyState title="Nothing awaiting approval" />
        ) : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {items.map((item) => (
              <div key={item.key} className="flex items-center gap-3 py-2.5">
                <input type="checkbox" className="h-4 w-4 accent-[var(--color-brand-cyan)]" checked={selected.has(item.key)} onChange={() => toggle(item.key)} />
                <Badge tone="cyan">{item.kind}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                  <p className="truncate text-xs text-[var(--text-secondary)]">{item.detail}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="danger" onClick={() => decideOne(item, "rejected")}>Reject</Button>
                  <Button size="sm" variant="success" onClick={() => decideOne(item, "approved")}>Approve</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
