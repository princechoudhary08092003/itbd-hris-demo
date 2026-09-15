import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { PlaceholderScreen } from "../../components/ui/Misc";

export default function OpenPositions() {
  const { db } = useDataStore();
  const open = db.positions.filter((p) => p.position_status === "open");

  return (
    <div>
      <PageHeader title="Open Positions" subtitle="Seats currently open across the org — sourced from position status, not a real ATS." />
      <Card className="mb-4">
        <div className="flex flex-col divide-y divide-[var(--surface-border)]">
          {open.map((p) => (
            <div key={p.position_id} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-[var(--text-primary)]">{p.seat_title}</span>
              <Badge tone="amber">Open</Badge>
            </div>
          ))}
        </div>
      </Card>
      <PlaceholderScreen title="Apply / Referral Flow" note="Resume upload, ATS scoring, and application flows are Phase 2 (post-6-month build). Stub only." />
    </div>
  );
}
