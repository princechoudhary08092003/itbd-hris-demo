import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { FieldGroup, Select, Textarea } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/Misc";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";
import { DISCIPLINE_STAGE_META } from "../../lib/performance";
import { toDateStr, addDays } from "../../lib/attendance";

const VIOLATION_LABEL = { attendance_policy: "Attendance Policy", data_handling: "Data Handling", conduct: "Conduct", client_escalation: "Client Escalation" };
const DECISION_LABEL = { verbal_warning: "Verbal Warning", written_warning: "Written Warning", suspension: "Suspension", termination: "Termination" };

export default function Discipline() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const employees = activeEmployments(db);

  const [empId, setEmpId] = useState(employees[0]?.employment_id ?? "");
  const [violationType, setViolationType] = useState("attendance_policy");
  const [description, setDescription] = useState("");

  const cases = db.disciplineCases.slice().sort((a, b) => b.nte_date.localeCompare(a.nte_date));

  function createCase(e) {
    e.preventDefault();
    dispatch({
      type: "CREATE_DISCIPLINE_CASE",
      payload: {
        employment_id: empId,
        issued_by: employmentId,
        hr_approver_id: employmentId,
        violation_type: violationType,
        description,
        nte_date: toDateStr(new Date()),
        response_due_date: addDays(toDateStr(new Date()), 7),
      },
    });
    setCreateOpen(false);
    setDescription("");
  }

  function advance(c) {
    const decision = c.stage === "ntd_issued" ? "written_warning" : undefined;
    dispatch({ type: "ADVANCE_DISCIPLINE_CASE", payload: { case_id: c.case_id, decision } });
  }

  return (
    <div>
      <PageHeader title="Discipline Management" subtitle="Formal NTE/NTD issuance and retention agreements." action={<Button onClick={() => setCreateOpen(true)}>Issue NTE</Button>} />

      {cases.length === 0 ? (
        <EmptyState title="No discipline cases on file" />
      ) : (
        <div className="flex flex-col gap-4">
          {cases.map((c) => (
            <Card key={c.case_id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{employmentDisplayName(db, c.employment_id)}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{VIOLATION_LABEL[c.violation_type] ?? c.violation_type} — {c.description}</p>
                  <p className="mt-1 text-xs font-mono-data text-[var(--text-muted)]">NTE {c.nte_date} · response due {c.response_due_date}{c.ntd_date ? ` · NTD ${c.ntd_date}` : ""}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge tone={DISCIPLINE_STAGE_META[c.stage].tone}>{DISCIPLINE_STAGE_META[c.stage].label}</Badge>
                  {c.decision && <Badge tone="neutral">{DECISION_LABEL[c.decision] ?? c.decision}</Badge>}
                </div>
              </div>
              {c.stage !== "closed" && (
                <div className="mt-3">
                  <Button size="sm" onClick={() => advance(c)}>
                    {c.stage === "nte_issued" ? "Log Employee Response" : c.stage === "employee_response" ? "Issue NTD" : "Close Case"}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Issue Notice to Explain (NTE)" footer={<Button onClick={createCase}>Issue NTE</Button>}>
        <form onSubmit={createCase} className="flex flex-col gap-4">
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {employees.map((e) => <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Violation Type">
            <Select value={violationType} onChange={(e) => setViolationType(e.target.value)}>
              {Object.entries(VIOLATION_LABEL).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </FieldGroup>
        </form>
      </Modal>
    </div>
  );
}
