import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ROADMAP_PHASES, ROADMAP_STATUS_META, ROADMAP_SUMMARY } from "../../data/roadmapItems";
import { IconArrowRight } from "../../components/ui/Icons";

const PHASE_HEADER_TONE = {
  red: "bg-red-600 text-white",
  amber: "bg-amber-500 text-white",
  cyan: "bg-brand-cyan text-white",
  neutral: "bg-[var(--surface-3)] text-[var(--text-primary)]",
};

export default function Roadmap() {
  const total = ROADMAP_PHASES.reduce((s, p) => s + p.items.length, 0);
  const delivered = ROADMAP_PHASES.flatMap((p) => p.items).filter((i) => i.status === "delivered").length;
  const newBuilt = ROADMAP_PHASES.flatMap((p) => p.items).filter((i) => i.status === "new").length;

  return (
    <div>
      <PageHeader
        title="TeamGPS Feature Roadmap"
        subtitle="Replaces PeopleStrong and closes ITBD's performance-management gap with a single platform built natively on TeamGPS."
      />

      <Card className="mb-6">
        <p className="text-sm text-[var(--text-secondary)]">{ROADMAP_SUMMARY.detail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="green">{delivered} / {total} already delivered</Badge>
          <Badge tone="cyan">{newBuilt} / {total} new in this build</Badge>
          <Badge tone="amber">{total - delivered - newBuilt} / {total} placeholder (needs real infra)</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ROADMAP_PHASES.map((phase, colIdx) => (
          <div key={phase.key}>
            <div className={`rounded-t-xl px-4 py-3 ${PHASE_HEADER_TONE[phase.tone]}`}>
              <p className="text-sm font-bold">{phase.title}</p>
              <p className="text-xs opacity-90">{phase.phase}</p>
              <p className="text-xs opacity-75">{phase.subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-b-xl border border-t-0 border-[var(--surface-border)] bg-[var(--surface-1)] p-3">
              {phase.items.map((item, i) => (
                <RoadmapCard key={item.n} item={item} delay={colIdx * 0.05 + i * 0.03} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapCard({ item, delay }) {
  const meta = ROADMAP_STATUS_META[item.status];
  const content = (
    <Card className="group h-full hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          <span className="text-[var(--text-muted)]">{item.n}.</span> {item.title}
        </p>
        {item.to && <IconArrowRight size={14} className="mt-0.5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-brand-cyan" />}
      </div>
      <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{item.description}</p>
      <Badge tone={meta.tone} className="mt-2.5">{meta.label}</Badge>
    </Card>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
      {item.to ? <Link to={item.to}>{content}</Link> : content}
    </motion.div>
  );
}
