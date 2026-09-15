import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Select, Input, Textarea } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName, getPosition, getEmployment } from "../../lib/selectors";
import { MOVEMENT_TYPE_LABEL, MOVEMENT_STATUS_TONE } from "../../lib/movement";

export default function Transfers() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const employees = activeEmployments(db);

  const [empId, setEmpId] = useState(employees[0]?.employment_id ?? "");
  const [type, setType] = useState("location_transfer");
  const [toPosition, setToPosition] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");

  const subject = getEmployment(db, empId);
  const fromPosition = subject ? getPosition(db, subject.position_id) : null;
  const openPositions = db.positions.filter((p) => p.position_status === "open" || p.position_status === "bench");

  function submit(e) {
    e.preventDefault();
    if (!subject) return;
    const target = toPosition ? getPosition(db, toPosition) : fromPosition;
    dispatch({
      type: "SUBMIT_MOVEMENT",
      payload: {
        employment_id: empId,
        movement_type: type,
        from_position_id: subject.position_id,
        to_position_id: toPosition || subject.position_id,
        from_reports_to_position_id: fromPosition?.reports_to_position_id ?? null,
        to_reports_to_position_id: target?.reports_to_position_id ?? null,
        from_work_location: subject.work_location,
        to_work_location: toLocation || subject.work_location,
        requested_by: employmentId,
        effective_date: effectiveDate,
        reason,
      },
    });
    setReason("");
    setToPosition("");
    setToLocation("");
  }

  function decide(m, decision) {
    dispatch({ type: "DECIDE_MOVEMENT", payload: { movement_id: m.movement_id, decision, approved_by: employmentId } });
  }
  function makeEffective(m) {
    dispatch({ type: "MAKE_MOVEMENT_EFFECTIVE", payload: { movement_id: m.movement_id } });
  }

  const requests = db.movementRequests.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div>
      <PageHeader title="Transfers & Resource Moves" subtitle="Movement requests — transfers, manager changes, bench release, client reassignment." />

      <Card className="mb-4">
        <CardHeader title="Initiate Transfer" />
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {employees.map((e) => (
                <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label="Movement Type">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {Object.entries(MOVEMENT_TYPE_LABEL).map(([v, label]) => (
                <option key={v} value={v}>{label}</option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label={`Current Seat: ${fromPosition?.seat_title ?? "—"}`}>
            <Select value={toPosition} onChange={(e) => setToPosition(e.target.value)}>
              <option value="">Keep current seat</option>
              {openPositions.map((p) => (
                <option key={p.position_id} value={p.position_id}>{p.seat_title} ({p.position_status})</option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label={`Current Location: ${subject?.work_location ?? "—"}`}>
            <Input value={toLocation} onChange={(e) => setToLocation(e.target.value)} placeholder="New work location (optional)" />
          </FieldGroup>
          <FieldGroup label="Effective Date">
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} required />
          </FieldGroup>
          <div className="sm:col-span-2">
            <FieldGroup label="Reason">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </FieldGroup>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit">Submit for Approval</Button>
          </div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Movement Requests</p></div>
        <Table>
          <THead>
            <TRow>
              <TH>Employee</TH>
              <TH>Type</TH>
              <TH>From → To</TH>
              <TH>Effective</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </TRow>
          </THead>
          <tbody>
            {requests.map((m) => {
              const fromPos = getPosition(db, m.from_position_id);
              const toPos = getPosition(db, m.to_position_id);
              return (
                <TRow key={m.movement_id}>
                  <TD>{employmentDisplayName(db, m.employment_id)}</TD>
                  <TD>{MOVEMENT_TYPE_LABEL[m.movement_type]}</TD>
                  <TD className="max-w-[220px] truncate text-xs">{fromPos?.seat_title} → {toPos?.seat_title}</TD>
                  <TD className="font-mono-data text-xs">{m.effective_date}</TD>
                  <TD><Badge tone={MOVEMENT_STATUS_TONE[m.status]}>{m.status.replace("_", " ")}</Badge></TD>
                  <TD>
                    {isHRAdmin && m.status === "pending_approval" && (
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="danger" onClick={() => decide(m, "rejected")}>Reject</Button>
                        <Button size="sm" variant="success" onClick={() => decide(m, "approved")}>Approve</Button>
                      </div>
                    )}
                    {isHRAdmin && m.status === "approved" && (
                      <Button size="sm" onClick={() => makeEffective(m)}>Make Effective</Button>
                    )}
                  </TD>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
