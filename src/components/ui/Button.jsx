const VARIANTS = {
  primary: "bg-gradient-to-b from-brand-cyan to-brand-cyan-dark text-white border-transparent shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_16px_-6px_rgba(0,175,221,0.55)] hover:brightness-110 hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_22px_-6px_rgba(0,175,221,0.6)]",
  secondary: "bg-transparent text-[var(--text-primary)] border-[var(--surface-border-strong)] hover:bg-[var(--surface-2)] hover:border-[var(--surface-border-strong)]",
  success: "bg-gradient-to-b from-brand-green to-brand-green-dark text-brand-dark border-transparent shadow-[0_1px_0_rgba(255,255,255,0.35)_inset,0_6px_16px_-6px_rgba(190,214,47,0.55)] hover:brightness-105",
  danger: "bg-transparent text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/10",
  ghost: "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--surface-2)]",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3.5 py-2 text-sm",
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium transition-all duration-150 ease-out active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
