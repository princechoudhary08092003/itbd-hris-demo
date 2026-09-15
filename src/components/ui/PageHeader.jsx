import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
        <div className="mt-2.5 h-[3px] w-10 rounded-full bg-gradient-to-r from-brand-cyan to-brand-green" />
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </motion.div>
  );
}
