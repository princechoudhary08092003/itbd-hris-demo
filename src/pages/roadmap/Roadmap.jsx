import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { ROADMAP_PHASES, ROADMAP_STATUS_META, ROADMAP_SUMMARY, ROADMAP_MILESTONES, ENHANCEMENT_PHASE } from "../../data/roadmapItems";
import { IconArrowRight, IconCheck } from "../../components/ui/Icons";

const TOTAL_MONTHS = 13;
const PHASE_BAR_TONE = {
  red: "from-red-500 to-red-600",
  amber: "from-amber-400 to-amber-500",
  cyan: "from-brand-cyan to-brand-cyan-dark",
  neutral: "from-violet-400 to-violet-500",
};
const PHASE_HEADER_TONE = {
  red: "bg-red-600 text-white",
  amber: "bg-amber-500 text-white",
  cyan: "bg-brand-cyan text-white",
  neutral: "bg-[var(--surface-3)] text-[var(--text-primary)]",
};

function pct(month) {
  return ((month - 1) / TOTAL_MONTHS) * 100;
}
function widthPct(start, end) {
  return ((end - start + 1) / TOTAL_MONTHS) * 100;
}

export default function Roadmap() {
  const total = ROADMAP_PHASES.reduce((s, p) => s + p.items.length, 0);
  const delivered = ROADMAP_PHASES.flatMap((p) => p.items).filter((i) => i.status === "delivered").length;
  const newBuilt = ROADMAP_PHASES.flatMap((p) => p.items).filter((i) => i.status === "new").length;

  return (
    <div>
      <PageHeader title="Product Roadmap" subtitle={ROADMAP_SUMMARY.title} />

      <Card className="mb-6">
        <p className="text-sm text-[var(--text-secondary)]">{ROADMAP_SUMMARY.detail}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="green">{delivered} / {total} already delivered</Badge>
          <Badge tone="cyan">{newBuilt} / {total} new in this build</Badge>
          <Badge tone="amber">{total - delivered - newBuilt} / {total} placeholder (needs real infra)</Badge>
        </div>
      </Card>

      {/* Visual timeline */}
      <Card className="mb-6 overflow-x-auto">
        <CardHeader title="Delivery Timeline" subtitle="6 months to full core platform, 9 months with AI & Innovation, migration and enhancements beyond" />
        <div className="min-w-[720px] pb-8 pt-2">
          <div className="relative h-10 rounded-lg bg-[var(--surface-2)]">
            {ROADMAP_PHASES.map((phase, i) => (
              <motion.div
                key={phase.key}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                style={{ left: `${pct(phase.months[0])}%`, width: `${widthPct(phase.months[0], phase.months[1])}%`, transformOrigin: "left" }}
                className={`absolute top-0 flex h-10 items-center justify-center rounded-lg bg-gradient-to-r px-2 text-center text-[11px] font-semibold text-white ${PHASE_BAR_TONE[phase.tone]}`}
              >
                <span className="truncate">{phase.title}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              style={{ left: `${pct(ENHANCEMENT_PHASE.months[0])}%`, width: `${widthPct(ENHANCEMENT_PHASE.months[0], ENHANCEMENT_PHASE.months[1])}%`, transformOrigin: "left" }}
              className="absolute top-0 flex h-10 items-center justify-center rounded-lg border-2 border-dashed border-brand-green bg-brand-green/15 px-2 text-center text-[11px] font-semibold text-brand-green-dark dark:text-brand-green"
            >
              <span className="truncate">{ENHANCEMENT_PHASE.title}</span>
            </motion.div>

            {ROADMAP_MILESTONES.map((m) => (
              <div key={m.key} className="absolute -top-2 flex flex-col items-center" style={{ left: `${pct(m.month) + widthPct(1, 1) / 2}%` }}>
                <div className="h-14 w-0.5 bg-[var(--text-muted)]/50" />
              </div>
            ))}
          </div>

          {/* month ruler */}
          <div className="relative mt-1.5 h-4">
            {Array.from({ length: TOTAL_MONTHS }, (_, i) => i + 1).map((m) => (
              <span key={m} className="absolute -translate-x-1/2 font-mono-data text-[10px] text-[var(--text-muted)]" style={{ left: `${pct(m) + widthPct(1, 1) / 2}%` }}>
                {m}
              </span>
            ))}
          </div>

          {/* milestone callouts — staggered so adjacent months don't collide */}
          <div className="relative mt-3 h-24">
            {ROADMAP_MILESTONES.map((m, i) => (
              <div
                key={m.key}
                className={`absolute w-40 text-center ${i % 2 === 0 ? "-translate-x-full pr-3 text-right" : "pl-3 text-left"}`}
                style={{ left: `${pct(m.month) + widthPct(1, 1) / 2}%`, top: i % 2 === 0 ? 0 : 36 }}
              >
                <Badge tone={m.tone}>{m.date}</Badge>
                <p className="mt-1 text-xs font-semibold text-[var(--text-primary)]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Milestone detail cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROADMAP_MILESTONES.map((m) => (
          <Card key={m.key}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Month {m.month} · Target {m.date}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{m.label}</p>
              </div>
              <Badge tone={m.tone}><IconCheck size={11} /></Badge>
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{m.description}</p>
          </Card>
        ))}
      </div>

      {/* Phase columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {ROADMAP_PHASES.map((phase, colIdx) => (
          <div key={phase.key}>
            <div className={`rounded-t-xl px-4 py-3 ${PHASE_HEADER_TONE[phase.tone]}`}>
              <p className="text-sm font-bold">{phase.title}</p>
              <p className="text-xs opacity-90">Month{phase.months[0] === phase.months[1] ? ` ${phase.months[0]}` : `s ${phase.months[0]}–${phase.months[1]}`}</p>
              <p className="text-xs opacity-75">{phase.subtitle}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-b-xl border border-t-0 border-[var(--surface-border)] bg-[var(--surface-1)] p-3">
              {phase.items.map((item, i) => (
                <RoadmapCard key={item.n} item={item} delay={colIdx * 0.05 + i * 0.03} />
              ))}
            </div>
          </div>
        ))}

        <div>
          <div className="rounded-t-xl bg-brand-green/90 px-4 py-3 text-brand-dark">
            <p className="text-sm font-bold">{ENHANCEMENT_PHASE.title}</p>
            <p className="text-xs opacity-90">Months {ENHANCEMENT_PHASE.months[0]}–{ENHANCEMENT_PHASE.months[1]}</p>
            <p className="text-xs opacity-75">{ENHANCEMENT_PHASE.subtitle}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-b-xl border border-t-0 border-[var(--surface-border)] bg-[var(--surface-1)] p-3">
            {ENHANCEMENT_PHASE.items.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 + i * 0.03 }}>
                <Card className="h-full">
                  <p className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                    {item}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
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
