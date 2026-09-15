import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";
import { MOVEMENT_TYPE_LABEL, MOVEMENT_STATUS_TONE } from "../../lib/movement";

export default function SystemReports() {
  const { db } = useDataStore();
  const employees = activeEmployments(db);
  const exited = db.employments.filter((e) => e.employment_status === "exited");
  const attritionRate = Math.round((exited.length / (employees.length + exited.length)) * 1000) / 10;

  const movementHistory = db.movementRequests.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div>
      <PageHeader title="System Reports" subtitle="Headcount, attrition, and movement history across the company." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active Headcount" value={employees.length} tone="cyan" />
        <StatTile label="Exited (all-time)" value={exited.length} />
        <StatTile label="Attrition Rate" value={`${attritionRate}%`} />
        <StatTile label="Movements Logged" value={db.movementRequests.length} tone="green" />
      </div>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Movement History</p></div>
        <Table>
          <THead><TRow><TH>Employee</TH><TH>Type</TH><TH>Effective</TH><TH>Status</TH></TRow></THead>
          <tbody>
            {movementHistory.map((m) => (
              <TRow key={m.movement_id}>
                <TD>{employmentDisplayName(db, m.employment_id)}</TD>
                <TD>{MOVEMENT_TYPE_LABEL[m.movement_type]}</TD>
                <TD className="font-mono-data">{m.effective_date}</TD>
                <TD><Badge tone={MOVEMENT_STATUS_TONE[m.status]}>{m.status.replace("_", " ")}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
