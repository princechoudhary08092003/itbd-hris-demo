import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Select, Input, Textarea } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";

export default function ProxyResignation() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const employees = activeEmployments(db);

  const [empId, setEmpId] = useState(employees[0]?.employment_id ?? "");
  const [lastDay, setLastDay] = useState(addDays(toDateStr(new Date()), 14));
  const [reason, setReason] = useState("");

  const proxyResignations = db.resignations.filter((r) => r.initiated_by === "proxy");

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: "SUBMIT_RESIGNATION",
      payload: { employment_id: empId, initiated_by: "proxy", initiated_by_employment_id: employmentId, resignation_date: toDateStr(new Date()), last_working_day: lastDay, reason },
    });
    setReason("");
  }

  return (
    <div>
      <PageHeader title="Proxy Resignation" subtitle="HR- or manager-initiated resignation raised on an employee's behalf." />

      <Card className="mb-4">
        <CardHeader title="Raise Proxy Resignation" />
        <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => setEmpId(e.target.value)}>
              {employees.map((e) => <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Last Working Day">
            <Input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
          </FieldGroup>
          <div className="sm:col-span-2">
            <FieldGroup label="Reason for Proxy Resignation">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. unresponsive beyond policy threshold, with HR sign-off" required />
            </FieldGroup>
          </div>
          <div className="sm:col-span-2"><Button type="submit">Submit Proxy Resignation</Button></div>
        </form>
      </Card>

      <Card padded={false}>
        <div className="p-4"><p className="text-sm font-semibold text-[var(--text-primary)]">Proxy Resignations on File</p></div>
        <Table>
          <THead><TRow><TH>Employee</TH><TH>Last Working Day</TH><TH>Status</TH><TH>Reason</TH></TRow></THead>
          <tbody>
            {proxyResignations.map((r) => (
              <TRow key={r.resignation_id}>
                <TD>{employmentDisplayName(db, r.employment_id)}</TD>
                <TD className="font-mono-data">{r.last_working_day}</TD>
                <TD><Badge tone="amber">{r.status}</Badge></TD>
                <TD className="max-w-xs truncate text-[var(--text-secondary)]">{r.reason}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
