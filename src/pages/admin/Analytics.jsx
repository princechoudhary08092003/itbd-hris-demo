import { useMemo, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import Badge from "../../components/ui/Badge";
import { Select } from "../../components/ui/Field";
import { activeEmployments, getOrgUnit, topLevelOrgUnit } from "../../lib/selectors";
import { computeImpactTier, metricFor } from "../../lib/performance";

export default function Analytics() {
  const { db } = useDataStore();
  const [location, setLocation] = useState("all");
  const locations = [...new Set(db.employments.map((e) => e.work_location).filter(Boolean))];

  const employees = useMemo(() => activeEmployments(db).filter((e) => location === "all" || e.work_location === location), [db, location]);
  const exited = db.employments.filter((e) => e.employment_status === "exited");
  const attritionRate = Math.round((exited.length / (employees.length + exited.length)) * 1000) / 10;

  const avgImpactIndex = useMemo(() => {
    const scores = employees.map((e) => metricFor(db, e.employment_id)).filter(Boolean).map((m) => computeImpactTier(m.results_score, m.behavior_score).index);
    return scores.length ? Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10 : 0;
  }, [db, employees]);

  const byOrgUnit = {};
  for (const e of employees) {
    const pos = db.positions.find((p) => p.position_id === e.position_id);
    const unit = getOrgUnit(db, pos?.org_unit_id);
    const top = topLevelOrgUnit(db, unit);
    byOrgUnit[top?.name ?? "Unassigned"] = (byOrgUnit[top?.name ?? "Unassigned"] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(byOrgUnit), 1);

  return (
    <div>
      <PageHeader
        title="Real-Time Dashboards & Analytics"
        subtitle="Self-serve headcount, attrition, and performance metrics — no HR pull required."
        action={
          <Select value={location} onChange={(e) => setLocation(e.target.value)} className="w-52">
            <option value="all">All locations</option>
            {locations.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Active Headcount" value={employees.length} tone="cyan" />
        <StatTile label="Attrition Rate (all-time)" value={`${attritionRate}%`} />
        <StatTile label="Avg. Impact Index" value={avgImpactIndex} tone="green" />
        <StatTile label="Open Movements" value={db.movementRequests.filter((m) => m.status === "pending_approval").length} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Headcount by Department" />
          <div className="flex flex-col gap-3">
            {Object.entries(byOrgUnit).map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]"><span>{name}</span><span className="font-mono-data">{count}</span></div>
                <div className="h-2 rounded-full bg-[var(--surface-2)]">
                  <div className="h-2 rounded-full bg-gradient-to-r from-brand-cyan to-brand-green" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)]/90 px-4 py-3 text-center shadow-lg">
              <Badge tone="amber">Coming Soon</Badge>
              <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">AI-Powered Insights</p>
              <p className="mt-1 max-w-xs text-xs text-[var(--text-secondary)]">Attrition prediction and workforce planning need ~12 months of live data before this can train — Phase 3.</p>
            </div>
          </div>
          <CardHeader title="Attrition Prediction" subtitle="AI-powered forecast" />
          <div className="h-40 rounded-lg bg-[var(--surface-2)]" />
        </Card>
      </div>
    </div>
  );
}
