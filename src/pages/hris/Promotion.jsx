import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Select, Input, Textarea } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { toDateStr } from "../../lib/attendance";

export default function Promotion() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const employees = activeEmployments(db).filter((e) => e.employment_type === "employee");

  const [empId, setEmpId] = useState(employees[0]?.employment_id ?? "");
  const [toPosition, setToPosition] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(toDateStr(new Date()));
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState("");

  const currentPosition = getPosition(db, db.employments.find((e) => e.employment_id === empId)?.position_id);
  const eligibleSeats = db.positions.filter((p) => p.position_status === "open" && p.position_id !== currentPosition?.position_id);

  const promotionHistory = db.movementRequests.filter((m) => m.reason?.startsWith("Promotion:")).sort((a, b) => b.effective_date.localeCompare(a.effective_date));

  function submit(e) {
    e.preventDefault();
    if (!empId || !toPosition) return;
    dispatch({ type: "PROMOTE_EMPLOYEE", payload: { employment_id: empId, to_position_id: toPosition, effective_date: effectiveDate, reason, requested_by: employmentId } });
    setToast(`${employmentDisplayName(db, empId)} promoted to ${getPosition(db, toPosition)?.seat_title}.`);
    setToPosition("");
    setReason("");
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div>
      <PageHeader title="Promotion" subtitle="Move an employee into an open seat — updates their position and the org chart immediately." />

      <Card className="mb-4">
        <CardHeader title="Promote Employee" />
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {employees.map((e) => <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)} — {getPosition(db, e.position_id)?.seat_title}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="New Seat (open positions only)">
            <Select value={toPosition} onChange={(e) => setToPosition(e.target.value)}>
              <option value="">Select an open seat</option>
              {eligibleSeats.map((p) => <option key={p.position_id} value={p.position_id}>{p.seat_title}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Effective Date">
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
          </FieldGroup>
          <div className="sm:col-span-2">
            <FieldGroup label="Reason">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </FieldGroup>
          </div>
          {toast && <p className="text-sm text-brand-green-dark dark:text-brand-green sm:col-span-2">{toast}</p>}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={!toPosition}>Confirm Promotion</Button>
          </div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Promotion History</p></div>
        <Table>
          <THead>
            <TRow><TH>Employee</TH><TH>New Seat</TH><TH>Effective Date</TH><TH>Status</TH></TRow>
          </THead>
          <tbody>
            {promotionHistory.map((m) => (
              <TRow key={m.movement_id}>
                <TD>{employmentDisplayName(db, m.employment_id)}</TD>
                <TD>{getPosition(db, m.to_position_id)?.seat_title}</TD>
                <TD className="font-mono-data">{m.effective_date}</TD>
                <TD><Badge tone="green">{m.status}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
