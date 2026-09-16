import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import { activeEmployments, getOrgUnit, topLevelOrgUnit } from "../../lib/selectors";

export default function HrisReports() {
  const { db } = useDataStore();
  const employees = activeEmployments(db);
  const vendors = employees.filter((e) => e.employment_type === "vendor");
  const openSeats = db.positions.filter((p) => p.position_status === "open").length;
  const benchSeats = db.positions.filter((p) => p.position_status === "bench").length;

  const byOrgUnit = {};
  for (const e of employees) {
    const pos = db.positions.find((p) => p.position_id === e.position_id);
    const unit = getOrgUnit(db, pos?.org_unit_id);
    const top = topLevelOrgUnit(db, unit);
    byOrgUnit[top?.name ?? "Unassigned"] = (byOrgUnit[top?.name ?? "Unassigned"] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(byOrgUnit), 1);

  const byLocation = {};
  for (const e of employees) byLocation[e.work_location] = (byLocation[e.work_location] || 0) + 1;

  return (
    <div>
      <PageHeader title="HRIS Reports" subtitle="Headcount and org distribution, computed live from current employment data." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total Headcount" value={employees.length} tone="cyan" />
        <StatTile label="Vendors" value={vendors.length} />
        <StatTile label="Open Seats" value={openSeats} tone="green" />
        <StatTile label="Bench Seats" value={benchSeats} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Headcount by Department" />
          <div className="flex flex-col gap-3">
            {Object.entries(byOrgUnit).map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]"><span>{name}</span><span className="font-mono-data">{count}</span></div>
                <div className="h-2 rounded-full bg-[var(--surface-2)]">
                  <div className="h-2 rounded-full bg-brand-cyan" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Headcount by Location" />
          <div className="flex flex-col gap-3">
            {Object.entries(byLocation).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] px-3 py-2 text-sm">
                <span className="text-[var(--text-primary)]">{name}</span>
                <span className="font-mono-data font-semibold text-brand-green-dark dark:text-brand-green">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
