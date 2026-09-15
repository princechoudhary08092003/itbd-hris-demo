const base =
  "w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface-0)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20";

export function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">{children}</label>;
}

export function Input(props) {
  return <input className={base} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={base} {...props}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea className={`${base} min-h-20 resize-y`} {...props} />;
}

export function FieldGroup({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
