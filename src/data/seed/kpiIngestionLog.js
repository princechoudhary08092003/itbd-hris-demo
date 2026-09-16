function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Simulated history of the automated pipeline that pulls QA/agent
// performance data into the platform (roadmap item #12 — KPI Data Ingestion).
export const kpiIngestionLog = [
  { run_id: "KPI-RUN-041", ran_at: isoDaysAgo(1), source: "QA Scorecard API", records_ingested: 24, status: "success" },
  { run_id: "KPI-RUN-040", ran_at: isoDaysAgo(8), source: "QA Scorecard API", records_ingested: 24, status: "success" },
  { run_id: "KPI-RUN-039", ran_at: isoDaysAgo(15), source: "Support Queue Metrics", records_ingested: 18, status: "success" },
  { run_id: "KPI-RUN-038", ran_at: isoDaysAgo(22), source: "QA Scorecard API", records_ingested: 24, status: "partial", note: "3 records skipped — missing employee_id mapping." },
];
