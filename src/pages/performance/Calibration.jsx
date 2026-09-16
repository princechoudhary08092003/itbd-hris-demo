import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Input } from "../../components/ui/Field";
import Badge from "../../components/ui/Badge";
import { activeEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { computeImpactTier, metricFor, scoreDistribution } from "../../lib/performance";

export default function Calibration() {
  const { db, dispatch } = useDataStore();
  const scored = activeEmployments(db).filter((e) => metricFor(db, e.employment_id));
  const ids = scored.map((e) => e.employment_id);
  const distribution = scoreDistribution(db, ids);
  const maxCount = Math.max(...distribution.map((b) => b.count), 1);

  function update(employmentId, field, value) {
    const metric = metricFor(db, employmentId);
    const clamped = Math.max(0, Math.min(100, Number(value) || 0));
    dispatch({
      type: "ADJUST_CALIBRATION",
      payload: {
        employment_id: employmentId,
        results_score: field === "results" ? clamped : metric.results_score,
        behavior_score: field === "behavior" ? clamped : metric.behavior_score,
      },
    });
  }

  return (
    <div>
      <PageHeader title="Calibration & Normalization" subtitle="Bell-curve view of the current scoring pass — adjust scores here to keep ratings defensible across teams." />

      <Card className="mb-4">
        <CardHeader title="Impact Index Distribution" subtitle={`${scored.length} people scored this period`} />
        <div className="flex h-48 items-end gap-2">
          {distribution.map((b) => (
            <div key={b.range} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="font-mono-data text-[11px] text-[var(--text-muted)]">{b.count || ""}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-brand-cyan to-brand-cyan-light transition-all"
                style={{ height: `${Math.max(4, (b.count / maxCount) * 100)}%` }}
              />
              <span className="font-mono-data text-[10px] text-[var(--text-muted)]">{b.range}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Adjust Scores</p></div>
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
            {scored.map((e) => {
              const metric = metricFor(db, e.employment_id);
              const tier = computeImpactTier(metric.results_score, metric.behavior_score);
              return (
                <TRow key={e.employment_id}>
                  <TD className="font-medium">{employmentDisplayName(db, e.employment_id)}</TD>
                  <TD className="text-[var(--text-secondary)]">{getPosition(db, e.position_id)?.seat_title}</TD>
                  <TD>
                    <Input type="number" min={0} max={100} value={metric.results_score} onChange={(ev) => update(e.employment_id, "results", ev.target.value)} className="w-20" />
                  </TD>
                  <TD>
                    <Input type="number" min={0} max={100} value={metric.behavior_score} onChange={(ev) => update(e.employment_id, "behavior", ev.target.value)} className="w-20" />
                  </TD>
                  <TD className="font-mono-data font-semibold">{tier.index}</TD>
                  <TD><Badge tone={tier.tone}>{tier.tier}</Badge></TD>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
