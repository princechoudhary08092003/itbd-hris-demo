import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Select, FieldGroup } from "../../components/ui/Field";

const STATUS_TONE = { success: "green", partial: "amber", failed: "red" };
const SOURCES = ["QA Scorecard API", "Support Queue Metrics", "Sales CRM Pipeline"];

export default function KpiIngestion() {
  const { db, dispatch } = useDataStore();
  const [source, setSource] = useState(SOURCES[0]);
  const [running, setRunning] = useState(false);

  function runSync() {
    setRunning(true);
    setTimeout(() => {
      dispatch({ type: "RUN_KPI_INGESTION", payload: { source } });
      setRunning(false);
    }, 700);
  }

  const log = db.kpiIngestionLog.slice().sort((a, b) => b.ran_at.localeCompare(a.ran_at));

  return (
    <div>
      <PageHeader title="KPI Data Ingestion" subtitle="Pulls QA/agent performance data automatically into TeamGPS via existing pipelines — feeds the Impact Tier Scoring engine." />

      <Card className="mb-4">
        <CardHeader title="Run a Sync" />
        <div className="flex flex-wrap items-end gap-3">
          <FieldGroup label="Source system">
            <Select value={source} onChange={(e) => setSource(e.target.value)} className="w-64">
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FieldGroup>
          <Button onClick={runSync} disabled={running}>{running ? "Syncing…" : "Run Ingestion Now"}</Button>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Sync History</p></div>
        <Table>
          <THead>
            <TRow><TH>Run</TH><TH>Ran At</TH><TH>Source</TH><TH>Records Ingested</TH><TH>Status</TH></TRow>
          </THead>
          <tbody>
            {log.map((r) => (
              <TRow key={r.run_id}>
                <TD className="font-mono-data text-xs">{r.run_id}</TD>
                <TD className="font-mono-data">{r.ran_at}</TD>
                <TD>{r.source}</TD>
                <TD className="font-mono-data">{r.records_ingested}</TD>
                <TD><Badge tone={STATUS_TONE[r.status]}>{r.status}{r.note ? ` — ${r.note}` : ""}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
