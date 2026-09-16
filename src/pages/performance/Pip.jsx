import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { FieldGroup, Select, Input, Textarea } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/Misc";
import { activeEmployments, directReportEmployments, employmentDisplayName, managerEmploymentOf } from "../../lib/selectors";
import { PIP_STAGE_META, PIP_STAGE_ORDER } from "../../lib/performance";
import { toDateStr, addDays } from "../../lib/attendance";

export default function Pip() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [letterCase, setLetterCase] = useState(null);

  const pool = isHRAdmin ? activeEmployments(db) : directReportEmployments(db, employmentId);
  const [empId, setEmpId] = useState(pool[0]?.employment_id ?? "");
  const [reason, setReason] = useState("");
  const [targetEnd, setTargetEnd] = useState(addDays(toDateStr(new Date()), 60));

  const visible = db.pipCases.filter((p) => isHRAdmin || p.manager_id === employmentId).sort((a, b) => b.start_date.localeCompare(a.start_date));

  function createCase(e) {
    e.preventDefault();
    const manager = managerEmploymentOf(db, empId);
    dispatch({
      type: "CREATE_PIP_CASE",
      payload: {
        employment_id: empId,
        manager_id: manager?.employment_id ?? employmentId,
        hr_approver_id: employmentId,
        reason,
        start_date: toDateStr(new Date()),
        target_end_date: targetEnd,
      },
    });
    setCreateOpen(false);
    setReason("");
  }

  function advance(pipCase) {
    dispatch({ type: "ADVANCE_PIP_CASE", payload: { pip_id: pipCase.pip_id, outcome: "improved" } });
  }

  function generateLetter(pipCase) {
    dispatch({ type: "GENERATE_PIP_LETTER", payload: { pip_id: pipCase.pip_id } });
    setLetterCase(pipCase);
  }

  return (
    <div>
      <PageHeader title="PIP Workflow" subtitle="Structured, auditable performance-improvement cases with auto letter generation." action={<Button onClick={() => setCreateOpen(true)}>New PIP Case</Button>} />

      {visible.length === 0 ? (
        <EmptyState title="No PIP cases" />
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((p) => (
            <Card key={p.pip_id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{employmentDisplayName(db, p.employment_id)}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{p.reason}</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)] font-mono-data">{p.start_date} → {p.target_end_date}</p>
                </div>
                <Badge tone={PIP_STAGE_META[p.stage].tone}>{PIP_STAGE_META[p.stage].label}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StageTrack stage={p.stage} order={PIP_STAGE_ORDER} meta={PIP_STAGE_META} />
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => generateLetter(p)}>{p.letter_generated ? "View Letter" : "Generate Letter"}</Button>
                  {p.stage !== "closed" && <Button size="sm" onClick={() => advance(p)}>Advance Stage</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New PIP Case" footer={<Button onClick={createCase}>Create Case</Button>}>
        <form onSubmit={createCase} className="flex flex-col gap-4">
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {pool.map((e) => <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Target End Date">
            <Input type="date" value={targetEnd} onChange={(e) => setTargetEnd(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Reason">
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
          </FieldGroup>
        </form>
      </Modal>

      <Modal open={!!letterCase} onClose={() => setLetterCase(null)} title="Performance Improvement Plan Letter" wide>
        {letterCase && (
          <div className="whitespace-pre-line rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-primary)]">
            {`Dear ${employmentDisplayName(db, letterCase.employment_id)},\n\nThis letter confirms you have been placed on a Performance Improvement Plan (PIP) effective ${letterCase.start_date}, with a target resolution date of ${letterCase.target_end_date}.\n\nReason: ${letterCase.reason}\n\nYour manager will check in regularly to review progress against the plan. Please reach out to HR with any questions.`}
          </div>
        )}
      </Modal>
    </div>
  );
}

function StageTrack({ stage, order, meta }) {
  const currentIndex = order.indexOf(stage);
  return (
    <div className="flex items-center gap-1.5">
      {order.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${i <= currentIndex ? "bg-brand-cyan" : "bg-[var(--surface-border-strong)]"}`}
            title={meta[s].label}
          />
          {i < order.length - 1 && <span className={`h-px w-5 ${i < currentIndex ? "bg-brand-cyan" : "bg-[var(--surface-border-strong)]"}`} />}
        </div>
      ))}
    </div>
  );
}
