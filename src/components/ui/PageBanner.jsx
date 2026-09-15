import { motion } from "framer-motion";

export default function PageBanner({ image, title, subtitle, action, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative mb-6 overflow-hidden rounded-2xl ${compact ? "h-32 sm:h-36" : "h-44 sm:h-52"}`}
      style={{ boxShadow: "var(--shadow-card-hover)" }}
    >
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(3,17,29,0.92) 15%, rgba(3,17,29,0.72) 45%, rgba(0,175,221,0.38) 100%)" }}
      />
      <div className="relative flex h-full flex-col justify-end gap-2 px-5 py-5 sm:px-8 sm:py-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-xl text-sm text-white/75">{subtitle}</p>}
        </div>
        {action && <div className="flex shrink-0 gap-2">{action}</div>}
      </div>
    </motion.div>
  );
}
