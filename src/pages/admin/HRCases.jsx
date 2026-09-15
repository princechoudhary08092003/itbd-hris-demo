import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/Misc";
import { employmentDisplayName } from "../../lib/selectors";
import { MOVEMENT_TYPE_LABEL, MOVEMENT_STATUS_TONE } from "../../lib/movement";

export default function HRCases() {
  const { db } = useDataStore();

  const openExits = db.resignations.filter((r) => r.status !== "completed" && r.status !== "withdrawn");
  const openMovements = db.movementRequests.filter((m) => m.status === "pending_approval" || m.status === "approved");
  const openChecklists = [...new Set(db.exitChecklists.filter((c) => c.status !== "completed").map((c) => c.employment_id))];

  return (
    <div>
      <PageHeader title="HR Case Management" subtitle="Open exits, transfers, and clearance items across the company in one view." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Open Exits" subtitle={`${openExits.length} in progress`} />
          {openExits.length === 0 ? <EmptyState title="No open exits" /> : (
            <div className="flex flex-col divide-y divide-[var(--surface-border)]">
              {openExits.map((r) => (
                <div key={r.resignation_id} className="py-2.5">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, r.employment_id)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">LWD {r.last_working_day} · {r.initiated_by === "proxy" ? "Proxy resignation" : "Self resignation"}</p>
                  <Badge tone="amber" className="mt-1">{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Open Movements" subtitle={`${openMovements.length} in flight`} />
          {openMovements.length === 0 ? <EmptyState title="No open movements" /> : (
            <div className="flex flex-col divide-y divide-[var(--surface-border)]">
              {openMovements.map((m) => (
                <div key={m.movement_id} className="py-2.5">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, m.employment_id)}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{MOVEMENT_TYPE_LABEL[m.movement_type]}</p>
                  <Badge tone={MOVEMENT_STATUS_TONE[m.status]} className="mt-1">{m.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Pending Clearance" subtitle={`${openChecklists.length} employee(s)`} />
          {openChecklists.length === 0 ? <EmptyState title="No pending clearances" /> : (
            <div className="flex flex-col divide-y divide-[var(--surface-border)]">
              {openChecklists.map((eid) => {
                const items = db.exitChecklists.filter((c) => c.employment_id === eid);
                const remaining = items.filter((c) => c.status !== "completed").length;
                return (
                  <div key={eid} className="py-2.5">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, eid)}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{remaining} of {items.length} items remaining</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
