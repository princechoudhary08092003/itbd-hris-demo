import { initials } from "../../lib/selectors";
import Badge from "./Badge";
import { IconLayers } from "./Icons";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #00AFDD, #0090B8)",
  "linear-gradient(135deg, #BED62F, #8fae1f)",
  "linear-gradient(135deg, #00AFDD, #BED62F)",
  "linear-gradient(135deg, #5cd2f5, #00AFDD)",
  "linear-gradient(135deg, #03111D, #0090B8)",
  "linear-gradient(135deg, #9fb724, #00AFDD)",
];

function gradientFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

export function Avatar({ name, size = 32, ring = false }) {
  const label = name || "?";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${ring ? "ring-2 ring-[var(--surface-1)]" : ""}`}
      style={{ width: size, height: size, fontSize: size * 0.36, background: gradientFor(label), boxShadow: "0 2px 6px -1px rgba(0,0,0,0.25)" }}
    >
      {initials(label)}
    </div>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-2)]/30 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-muted)]">
        <IconLayers size={18} />
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</p>}
    </div>
  );
}

export function PlaceholderScreen({ title, note }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-2)]/30 py-16 text-center">
      <Badge tone="violet">Placeholder — Phase 2</Badge>
      <p className="mt-3 text-base font-semibold text-[var(--text-primary)]">{title}</p>
      {note && <p className="mt-1 max-w-md text-sm text-[var(--text-secondary)]">{note}</p>}
    </div>
  );
}
