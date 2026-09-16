import { Link } from "react-router-dom";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import PageHeader from "../../components/ui/PageHeader";
import { IconArrowRight } from "../../components/ui/Icons";

const REGIMES = [
  {
    name: "DPDP Act",
    region: "India",
    status: "on_track",
    items: [
      "Consent capture on personal-data collection forms (pre-onboarding documents)",
      "Data subject access & erasure request handling process defined",
      "Cross-border transfer safeguards for India-based employee records",
    ],
  },
  {
    name: "RA 10173 (Data Privacy Act)",
    region: "Philippines",
    status: "on_track",
    items: [
      "NTE/NTD discipline records retained per BIR/labor code minimums",
      "Data Protection Officer designated for Philippines operations",
      "Breach notification process documented (72-hour window)",
    ],
  },
  {
    name: "CCPA",
    region: "United States",
    status: "needs_review",
    items: [
      "Employee data sale/sharing disclosure — pending legal review",
      "Right-to-know request workflow not yet wired to this system",
      "Retention schedule for exited-employee records",
    ],
  },
];

const STATUS_META = { on_track: { label: "On Track", tone: "green" }, needs_review: { label: "Needs Review", tone: "amber" } };

export default function Compliance() {
  return (
    <div>
      <PageHeader title="Compliance & Data Privacy" subtitle="DPDP (India), RA 10173 (Philippines), and CCPA (US) compliance posture and audit trail." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {REGIMES.map((r) => (
          <Card key={r.name}>
            <CardHeader title={r.name} subtitle={r.region} action={<Badge tone={STATUS_META[r.status].tone}>{STATUS_META[r.status].label}</Badge>} />
            <ul className="flex flex-col gap-2">
              {r.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Full Audit Trail</p>
            <p className="text-xs text-[var(--text-secondary)]">Every status change, approval, and case decision is logged for compliance review.</p>
          </div>
          <Link to="/admin/audit-log" className="flex items-center gap-1 text-sm font-medium text-brand-cyan-dark dark:text-brand-cyan hover:underline">
            Open Audit Log <IconArrowRight size={14} />
          </Link>
        </div>
      </Card>
    </div>
  );
}
