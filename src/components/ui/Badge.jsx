const TONE_CLASSES = {
  green: "bg-brand-green/15 text-brand-green-dark dark:text-brand-green border-brand-green/25",
  cyan: "bg-brand-cyan/15 text-brand-cyan-dark dark:text-brand-cyan border-brand-cyan/25",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
  red: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25",
  violet: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
  neutral: "bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--surface-border)]",
};

const DOT_CLASSES = {
  green: "bg-brand-green-dark dark:bg-brand-green",
  cyan: "bg-brand-cyan-dark dark:bg-brand-cyan",
  amber: "bg-amber-600 dark:bg-amber-400",
  red: "bg-red-600 dark:bg-red-400",
  violet: "bg-violet-600 dark:bg-violet-400",
  neutral: "bg-[var(--text-muted)]",
};

export default function Badge({ tone = "neutral", children, className = "", dot = true }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONE_CLASSES[tone] ?? TONE_CLASSES.neutral} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASSES[tone] ?? DOT_CLASSES.neutral}`} />}
      {children}
    </span>
  );
}
