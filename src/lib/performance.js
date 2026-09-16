// Dual-index Impact Tier: results (what got done) x behavior (how it got
// done). Both indices are weighted evenly — the same "defensible, not just
// a single number" approach the roadmap calls for.
export const TIER_META = {
  S: { label: "Tier S — Exceptional", tone: "green", min: 90 },
  A: { label: "Tier A — Strong", tone: "cyan", min: 78 },
  B: { label: "Tier B — Solid", tone: "neutral", min: 62 },
  C: { label: "Tier C — Developing", tone: "amber", min: 45 },
  D: { label: "Tier D — Needs Improvement", tone: "red", min: 0 },
};

export function computeImpactIndex(resultsScore, behaviorScore) {
  return Math.round((resultsScore * 0.6 + behaviorScore * 0.4) * 10) / 10;
}

export function computeImpactTier(resultsScore, behaviorScore) {
  const index = computeImpactIndex(resultsScore, behaviorScore);
  const tierKey = Object.keys(TIER_META).find((k) => index >= TIER_META[k].min) ?? "D";
  return { index, tier: tierKey, ...TIER_META[tierKey] };
}

export function metricFor(db, employmentId) {
  return db.performanceMetrics.find((m) => m.employment_id === employmentId) ?? null;
}

/**
 * Buckets a set of employments' impact index into a 10-wide histogram
 * (0-9, 10-19 … 90-100) for the Calibration screen's bell-curve view.
 */
export function scoreDistribution(db, employmentIds) {
  const buckets = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}-${i * 10 + 9}`, count: 0 }));
  for (const id of employmentIds) {
    const m = metricFor(db, id);
    if (!m) continue;
    const { index } = computeImpactTier(m.results_score, m.behavior_score);
    const bucketIndex = Math.min(9, Math.floor(index / 10));
    buckets[bucketIndex].count += 1;
  }
  return buckets;
}

export const PIP_STAGE_META = {
  initiated: { label: "Initiated", tone: "amber" },
  manager_review: { label: "Manager Review", tone: "cyan" },
  hr_review: { label: "HR Review", tone: "violet" },
  closed: { label: "Closed", tone: "green" },
};
export const PIP_STAGE_ORDER = ["initiated", "manager_review", "hr_review", "closed"];

export const DISCIPLINE_STAGE_META = {
  nte_issued: { label: "NTE Issued", tone: "amber" },
  employee_response: { label: "Awaiting Response", tone: "cyan" },
  ntd_issued: { label: "NTD Issued", tone: "violet" },
  closed: { label: "Closed", tone: "green" },
};
export const DISCIPLINE_STAGE_ORDER = ["nte_issued", "employee_response", "ntd_issued", "closed"];

export const READINESS_META = {
  ready_now: { label: "Ready Now", tone: "green" },
  ready_1yr: { label: "Ready in ~1 Year", tone: "cyan" },
  ready_2yr: { label: "Ready in ~2 Years", tone: "amber" },
};
