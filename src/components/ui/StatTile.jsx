const ACCENTS = {
  default: "from-[var(--surface-border-strong)] to-[var(--surface-border)]",
  cyan: "from-brand-cyan to-brand-cyan-light",
  green: "from-brand-green to-brand-green-dark",
};

export default function StatTile({ label, value, sub, tone = "default", icon: Icon }) {
  const toneClass = tone === "cyan" ? "text-brand-cyan-dark dark:text-brand-cyan" : tone === "green" ? "text-brand-green-dark dark:text-brand-green" : "text-[var(--text-primary)]";
  return (
    <div className="card-surface group relative overflow-hidden rounded-2xl p-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${ACCENTS[tone] ?? ACCENTS.default} opacity-80`} />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
        {Icon && (
          <span className={`rounded-lg p-1.5 ${tone === "cyan" ? "bg-brand-cyan/12 text-brand-cyan-dark dark:text-brand-cyan" : tone === "green" ? "bg-brand-green/15 text-brand-green-dark dark:text-brand-green" : "bg-[var(--surface-2)] text-[var(--text-muted)]"}`}>
            <Icon size={15} />
          </span>
        )}
      </div>
      <p className={`mt-1.5 font-mono-data text-2xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
}
