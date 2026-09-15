import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { employmentDisplayName } from "../../lib/selectors";
import { MOVEMENT_TYPE_LABEL } from "../../lib/movement";

export default function AuditLog() {
  const { db } = useDataStore();

  const events = [
    ...db.leaveRequests.filter((r) => r.status !== "pending_approval").map((r) => ({
      at: r.applied_on, actor: r.approver_id, action: `Leave ${r.status}`, subject: r.employment_id, detail: `${r.days}d`,
    })),
    ...db.movementRequests.map((m) => ({
      at: m.created_at, actor: m.approved_by ?? m.requested_by, action: `Movement ${m.status} — ${MOVEMENT_TYPE_LABEL[m.movement_type]}`, subject: m.employment_id, detail: m.reason,
    })),
    ...db.compOffs.filter((c) => c.status !== "pending_approval").map((c) => ({
      at: c.worked_date, actor: c.approved_by, action: `Comp-off ${c.status}`, subject: c.employment_id, detail: c.worked_date,
    })),
    ...db.employments.filter((e) => e.employment_status === "exited").map((e) => ({
      at: e.exit_date, actor: null, action: "Employment exited", subject: e.employment_id, detail: e.exit_reason,
    })),
  ]
    .filter((e) => e.at)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 40);

  return (
    <div>
      <PageHeader title="Audit Log" subtitle="Derived from record state changes across the demo dataset." />
      <Card padded={false}>
        <Table>
          <THead><TRow><TH>Date</TH><TH>Action</TH><TH>Subject</TH><TH>Actor</TH><TH>Detail</TH></TRow></THead>
          <tbody>
            {events.map((e, i) => (
              <TRow key={i}>
                <TD className="font-mono-data text-xs">{e.at}</TD>
                <TD>{e.action}</TD>
                <TD>{employmentDisplayName(db, e.subject)}</TD>
                <TD>{e.actor ? employmentDisplayName(db, e.actor) : <Badge tone="neutral">System</Badge>}</TD>
                <TD className="max-w-xs truncate text-xs text-[var(--text-secondary)]">{e.detail}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
