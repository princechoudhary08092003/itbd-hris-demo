import { useState } from "react";
import { Link } from "react-router-dom";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Misc";
import { buildPositionTree } from "../../lib/orgChart";
import { employmentDisplayName } from "../../lib/selectors";

const STATUS_BADGE = {
  filled: null,
  open: { tone: "amber", label: "Vacant" },
  bench: { tone: "violet", label: "Bench" },
  frozen: { tone: "neutral", label: "Frozen" },
  abolished: { tone: "neutral", label: "Abolished" },
};

export default function OrgChart() {
  const { db } = useDataStore();
  const tree = buildPositionTree(db);

  return (
    <div>
      <PageHeader title="Org Chart" subtitle="Seat-driven — vacant and bench positions are shown distinctly. Approving a movement updates this live." />
      <Card>
        <div className="flex flex-col gap-1">
          {tree.map((n) => (
            <TreeNode key={n.position.position_id} node={n} depth={0} db={db} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function TreeNode({ node, depth, db }) {
  const [open, setOpen] = useState(depth < 2);
  const statusBadge = STATUS_BADGE[node.position.position_status];
  const name = node.occupant ? employmentDisplayName(db, node.occupant.employment_id) : null;
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg py-1.5 hover:bg-[var(--surface-2)]" style={{ paddingLeft: depth * 22 }}>
        {hasChildren ? (
          <button onClick={() => setOpen((o) => !o)} className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--surface-border)]">
            {open ? "−" : "+"}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        {name ? <Avatar name={name} size={26} /> : <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-dashed border-[var(--surface-border)] text-[var(--text-muted)]">?</div>}
        <div className="min-w-0">
          {name ? (
            <Link to={`/hris/directory/${node.occupant.employment_id}`} className="text-sm font-medium text-[var(--text-primary)] hover:text-brand-cyan-dark dark:hover:text-brand-cyan">
              {name}
            </Link>
          ) : (
            <span className="text-sm font-medium text-[var(--text-muted)]">Unassigned</span>
          )}
          <span className="ml-2 text-xs text-[var(--text-secondary)]">{node.position.seat_title}</span>
        </div>
        {statusBadge && <Badge tone={statusBadge.tone}>{statusBadge.label}</Badge>}
      </div>
      {open && hasChildren && (
        <div>
          {node.children.map((c) => (
            <TreeNode key={c.position.position_id} node={c} depth={depth + 1} db={db} />
          ))}
        </div>
      )}
    </div>
  );
}
