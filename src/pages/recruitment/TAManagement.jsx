import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Select } from "../../components/ui/Field";
import { getPosition } from "../../lib/selectors";

const STAGES = [
  { key: "applied", label: "Applied" },
  { key: "screening", label: "Screening" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
];

export default function TAManagement() {
  const { db, dispatch } = useDataStore();

  function moveCandidate(candidateId, stage) {
    dispatch({ type: "MOVE_CANDIDATE_STAGE", payload: { candidate_id: candidateId, stage } });
  }

  const rejected = db.candidates.filter((c) => c.stage === "rejected");

  return (
    <div>
      <PageHeader title="TA Open-Positions Management" subtitle="End-to-end hiring pipeline — job board integrations and digital offer letters are Phase 2 scope; the pipeline itself is real here." />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {STAGES.map((stage) => {
          const items = db.candidates.filter((c) => c.stage === stage.key);
          return (
            <div key={stage.key}>
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{stage.label}</p>
                <span className="font-mono-data text-xs text-[var(--text-muted)]">{items.length}</span>
              </div>
              <div className="flex min-h-24 flex-col gap-2 rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-2)]/30 p-2">
                {items.map((c) => (
                  <Card key={c.candidate_id} className="p-3">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{c.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{getPosition(db, c.position_id)?.seat_title}</p>
                    <p className="mt-1 font-mono-data text-[11px] text-[var(--text-muted)]">Applied {c.applied_on} · {c.source.replace("_", " ")}</p>
                    <Select value={c.stage} onChange={(e) => moveCandidate(c.candidate_id, e.target.value)} className="mt-2 text-xs">
                      {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                      <option value="rejected">Rejected</option>
                    </Select>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {rejected.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[var(--text-muted)]">Rejected:</span>
          {rejected.map((c) => (
            <Badge key={c.candidate_id} tone="neutral">{c.name} — {getPosition(db, c.position_id)?.seat_title}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
