import { useMemo } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import StatTile from "../../components/ui/StatTile";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/Misc";
import { activeEmployments, directReportEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { computeImpactTier, metricFor } from "../../lib/performance";

export default function ImpactScoring() {
  const { db } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();

  const scope = useMemo(() => {
    const pool = isHRAdmin ? activeEmployments(db).filter((e) => e.employment_type !== "vendor") : directReportEmployments(db, employmentId);
    return pool
      .map((e) => {
        const metric = metricFor(db, e.employment_id);
        if (!metric) return null;
        return { employment: e, metric, tier: computeImpactTier(metric.results_score, metric.behavior_score) };
      })
      .filter(Boolean)
      .sort((a, b) => b.tier.index - a.tier.index);
  }, [db, employmentId, isHRAdmin]);

  const avgIndex = scope.length ? Math.round((scope.reduce((s, r) => s + r.tier.index, 0) / scope.length) * 10) / 10 : 0;
  const topTierCount = scope.filter((r) => r.tier.tier === "S" || r.tier.tier === "A").length;
  const devCount = scope.filter((r) => r.tier.tier === "C" || r.tier.tier === "D").length;

  return (
    <div>
      <PageHeader title="Impact Tier Scoring" subtitle="Dual-index score (60% results, 40% behavior) computed from the latest KPI ingestion, live." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="People Scored" value={scope.length} tone="cyan" />
        <StatTile label="Average Impact Index" value={avgIndex} tone="green" />
        <StatTile label="Tier S / A" value={topTierCount} />
        <StatTile label="Tier C / D" value={devCount} />
      </div>

      <Card padded={false}>
        {scope.length === 0 ? (
          <div className="p-6"><EmptyState title="No scored employees in view" /></div>
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>Employee</TH>
                <TH>Seat</TH>
                <TH>Results</TH>
                <TH>Behavior</TH>
                <TH>Impact Index</TH>
                <TH>Tier</TH>
              </TRow>
            </THead>
            <tbody>
              {scope.map(({ employment, metric, tier }) => (
                <TRow key={employment.employment_id}>
                  <TD className="font-medium">{employmentDisplayName(db, employment.employment_id)}</TD>
                  <TD className="text-[var(--text-secondary)]">{getPosition(db, employment.position_id)?.seat_title}</TD>
                  <TD className="font-mono-data">{metric.results_score}</TD>
                  <TD className="font-mono-data">{metric.behavior_score}</TD>
                  <TD className="font-mono-data font-semibold">{tier.index}</TD>
                  <TD><Badge tone={tier.tone}>{tier.label}</Badge></TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
