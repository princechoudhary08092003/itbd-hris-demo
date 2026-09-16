import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { IconArrowRight, IconClock, IconFile, IconLayers, IconTarget, IconUsers } from "../../components/ui/Icons";
import bannerImage from "../../assets/images/hero-office.jpg";

const FEATURES = [
  {
    icon: IconClock,
    tone: "cyan",
    status: { label: "Available today", tone: "green" },
    title: "Live Attendance Capture",
    problem: "Manual attendance entry and slow biometric batch syncs mean \"present\" status always lags reality.",
    solution: "A badge tap at any reader — not biometric enrollment, just a card tap — records IN/OUT instantly, live, with no manual entry and no waiting for a sync job.",
    to: "/attendance/live-capture",
    cta: "Try the live capture kiosk",
  },
  {
    icon: IconLayers,
    tone: "green",
    status: { label: "Available today", tone: "green" },
    title: "Payroll-Ready Attendance & Leave Export",
    problem: "HR spends hours every cycle manually reconciling attendance and leave before handing off to the payroll vendor.",
    solution: "A locked, vendor-ready export for the 21st–20th cycle — attendance, leave, and comp-off in one clean file. This system stops at the export; salary and tax calculation stay with the payroll vendor.",
    to: "/attendance/export",
    cta: "See the export screen",
  },
  {
    icon: IconFile,
    tone: "cyan",
    status: { label: "Already available", tone: "green" },
    title: "Digital Forms & E-Signature",
    problem: "Policies live scattered across drives and email with no version control, no acknowledgment trail, and no way to prove who agreed to what.",
    solution: "Every policy gets a document ID and a single home in the Policy Hub. Formal documents carry a real fillable PDF you can review inline and sign digitally — captured, timestamped, and logged.",
    to: "/hris/policy-hub",
    cta: "Open the Policy Hub",
  },
  {
    icon: IconTarget,
    tone: "amber",
    status: { label: "Prototype", tone: "amber" },
    title: "AI SOP Assistant",
    problem: "Every new policy is drafted from scratch, with inconsistent structure and formatting across documents and authors.",
    solution: "Describe a policy topic and its key points; get back a standard-formatted draft (Purpose, Scope, Policy Statement, Procedure, Responsibilities) ready to save straight into the Policy Hub with its own document ID.",
    to: "/hris/policy-hub",
    cta: "Try the SOP Assistant",
  },
  {
    icon: IconUsers,
    tone: "green",
    status: { label: "Available today", tone: "green" },
    title: "One Person, Every Employment",
    problem: "Rehires, vendor conversions, and internal moves usually mean fragmented, disconnected records for the same human being.",
    solution: "A person and their employment are separate records. Every employee → vendor → employee round trip stays linked to one person, with full history visible in one place.",
    to: "/hris/directory",
    cta: "See it on Priya Nair's profile",
  },
];

export default function KeyFeatures() {
  return (
    <div>
      <PageBanner
        image={bannerImage}
        title="Key Features"
        subtitle="The problems this platform solves, and what makes it different from a generic HRIS."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card className="h-full">
              <div className="flex items-start justify-between gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.tone === "cyan" ? "bg-brand-cyan/12 text-brand-cyan-dark dark:text-brand-cyan" : f.tone === "green" ? "bg-brand-green/15 text-brand-green-dark dark:text-brand-green" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}>
                  <f.icon size={19} />
                </span>
                <Badge tone={f.status.tone}>{f.status.label}</Badge>
              </div>
              <p className="mt-3 text-base font-semibold text-[var(--text-primary)]">{f.title}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">The problem</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{f.problem}</p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">How this solves it</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{f.solution}</p>
              <Link to={f.to} className="mt-4 inline-block">
                <Button size="sm" variant="secondary">
                  {f.cta} <IconArrowRight size={13} />
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mt-4" padded={false}>
        <div className="p-4 sm:p-5">
          <CardHeader
            title="See a real document"
            subtitle="This is an actual generated PDF, not a mockup — view it here, or open the Policy Hub to sign it digitally."
            action={<Link to="/hris/policy-hub"><Button size="sm" variant="secondary">Open Policy Hub</Button></Link>}
          />
        </div>
        <div className="border-t border-[var(--surface-border)]">
          <iframe src="/documents/POL-ATT-014-remote-work-policy.pdf" title="Remote Work & Attendance Policy" className="h-[520px] w-full" />
        </div>
      </Card>
    </div>
  );
}
