import { AnimatePresence, motion } from "framer-motion";

export default function Modal({ open, onClose, title, children, footer, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`relative z-10 max-h-[90vh] w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} overflow-y-auto rounded-t-2xl border border-[var(--surface-border)] bg-[var(--surface-1)] p-5 sm:rounded-2xl`}
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
              <button onClick={onClose} className="rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-2)]" aria-label="Close">
                ✕
              </button>
            </div>
            <div>{children}</div>
            {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
