import { employments } from "./employments";

const PERIOD = "2026-Q3";

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// Dual-index performance metrics — what the KPI Data Ingestion pipeline
// would pull in from TeamGPS scorecards. Deterministic per employment so
// the demo is stable across reloads, but varied enough to produce a real
// spread for the Impact Tier / Calibration screens.
function generate() {
  const rows = [];
  let seq = 1;
  for (const e of employments) {
    if (e.employment_type === "vendor" || e.employment_status !== "active") continue;
    const resultsSeed = hash(e.employment_id + "results");
    const behaviorSeed = hash(e.employment_id + "behavior");
    rows.push({
      metric_id: `PM-${String(seq++).padStart(4, "0")}`,
      employment_id: e.employment_id,
      period: PERIOD,
      results_score: 40 + (resultsSeed % 61), // 40-100
      behavior_score: 45 + (behaviorSeed % 56), // 45-100
      source: "kpi_ingestion",
    });
  }
  return rows;
}

export const performanceMetrics = generate();
