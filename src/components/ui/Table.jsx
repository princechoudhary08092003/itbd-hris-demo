export function Table({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--surface-border)]">
      <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return <thead className="bg-[var(--surface-2)]/70 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{children}</thead>;
}

export function TRow({ children, className = "" }) {
  return <tr className={`border-t border-[var(--surface-border)] transition-colors first:border-t-0 hover:bg-[var(--surface-2)]/50 ${className}`}>{children}</tr>;
}

export function TH({ children, className = "" }) {
  return <th className={`px-3.5 py-3 font-semibold ${className}`}>{children}</th>;
}

export function TD({ children, className = "" }) {
  return <td className={`px-3.5 py-3 align-middle text-[var(--text-primary)] ${className}`}>{children}</td>;
}
