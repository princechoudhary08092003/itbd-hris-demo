import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Select } from "../../components/ui/Field";
import { Avatar } from "../../components/ui/Misc";
import { employmentDisplayName, getPosition } from "../../lib/selectors";
import { computeImpactTier, metricFor, READINESS_META } from "../../lib/performance";

export default function Succession() {
  const { db, dispatch } = useDataStore();

  function updateReadiness(planId, readiness) {
    dispatch({ type: "UPDATE_SUCCESSION_READINESS", payload: { plan_id: planId, readiness } });
  }

  return (
    <div>
      <PageHeader title="Succession Planning" subtitle="Key seats mapped to their next-in-line candidate, informed by calibrated Impact Tier scores." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {db.successionPlans.map((plan) => {
          const position = getPosition(db, plan.position_id);
          const candidateName = employmentDisplayName(db, plan.candidate_employment_id);
          const metric = metricFor(db, plan.candidate_employment_id);
          const tier = metric ? computeImpactTier(metric.results_score, metric.behavior_score) : null;
          const readiness = READINESS_META[plan.readiness];

          return (
            <Card key={plan.plan_id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Key Seat</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{position?.seat_title}</p>
                </div>
                <Badge tone={readiness.tone}>{readiness.label}</Badge>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--surface-border)] p-3">
                <Avatar name={candidateName} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{candidateName}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{getPosition(db, db.employments.find((e) => e.employment_id === plan.candidate_employment_id)?.position_id)?.seat_title}</p>
                </div>
                {tier && <Badge tone={tier.tone}>{tier.tier}</Badge>}
              </div>

              <p className="mt-3 text-sm text-[var(--text-secondary)]">{plan.notes}</p>

              <div className="mt-3">
                <Select value={plan.readiness} onChange={(e) => updateReadiness(plan.plan_id, e.target.value)} className="w-full sm:w-56">
                  {Object.entries(READINESS_META).map(([v, meta]) => <option key={v} value={v}>{meta.label}</option>)}
                </Select>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
