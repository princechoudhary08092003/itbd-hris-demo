import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { PlaceholderScreen } from "../../components/ui/Misc";
import { IconPlug } from "../../components/ui/Icons";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/employees", desc: "Employee master sync for Finance GL cost allocation" },
  { method: "GET", path: "/api/v1/attendance/export", desc: "Locked cycle attendance/leave export (same data as Attendance Export screen)" },
  { method: "POST", path: "/api/v1/movements/webhook", desc: "Push notification on movement_request becoming effective" },
];

export default function Integrations() {
  return (
    <div>
      <PageHeader title="Integrations — ERP / GL" subtitle="Connects HR cost and payroll data to Finance's GL system; opens a public REST API." />

      <Card className="mb-4">
        <CardHeader title="Planned API Surface" subtitle="Illustrative only — no live endpoint exists in this frontend demo" />
        <div className="flex flex-col divide-y divide-[var(--surface-border)]">
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} className="flex items-start gap-3 py-2.5">
              <IconPlug size={15} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
              <div className="min-w-0">
                <p className="font-mono-data text-sm text-[var(--text-primary)]"><Badge tone="cyan" dot={false}>{ep.method}</Badge> <span className="ml-1">{ep.path}</span></p>
                <p className="text-xs text-[var(--text-secondary)]">{ep.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <PlaceholderScreen
        title="ERP / GL Connection"
        note="A real ERP/GL integration (NetSuite, SAP, QuickBooks) needs the actual backend build — this is a frontend demo only. Phase 2, per the roadmap."
      />
    </div>
  );
}
