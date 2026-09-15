export default function Logo({ size = 34, withWordmark = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="shrink-0">
        <defs>
          <linearGradient id="itbd-mark-grad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#00AFDD" />
            <stop offset="1" stopColor="#BED62F" />
          </linearGradient>
          <linearGradient id="itbd-mark-shine" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#itbd-mark-grad)" />
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#itbd-mark-shine)" />
        {/* abstract org-node glyph: a lead node connected to two reports — the seat-driven org chart, literalized */}
        <circle cx="20" cy="12.5" r="4" fill="white" />
        <circle cx="12" cy="28" r="4" fill="white" fillOpacity="0.92" />
        <circle cx="28" cy="28" r="4" fill="white" fillOpacity="0.92" />
        <path d="M20 16.5V21M20 21L12 24.5M20 21L28 24.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {withWordmark && (
        <span className="flex items-baseline gap-1.5 leading-none">
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">ITBD</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">HRIS</span>
        </span>
      )}
    </div>
  );
}
