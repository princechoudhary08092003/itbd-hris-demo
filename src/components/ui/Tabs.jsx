import { motion } from "framer-motion";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[var(--surface-border)]">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`relative shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
            active === t.value ? "text-brand-cyan-dark dark:text-brand-cyan" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          {t.label}
          {active === t.value && (
            <motion.div layoutId="tabs-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-brand-cyan" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
          )}
        </button>
      ))}
    </div>
  );
}
