import { useRef, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";

export default function BulkOps() {
  const { db } = useDataStore();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(null);
  const [processed, setProcessed] = useState(false);

  function simulateUpload() {
    setFileName("employee_master_update.csv");
    setProcessed(false);
    setRows(activeEmployments(db).slice(0, 10).map((e) => ({ employment_id: e.employment_id, field: "work_location", current: e.work_location, incoming: e.work_location })));
  }

  return (
    <div>
      <PageHeader title="Bulk Operations" subtitle="Bulk employee import/update — demo as a mock file-upload flow." />

      <Card className="mb-4">
        <CardHeader title="Upload File" />
        <div onClick={() => fileRef.current?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--surface-border)] py-10 text-center hover:border-brand-cyan/50">
          <p className="text-sm font-medium text-[var(--text-primary)]">{fileName || "Click to select a CSV or XLSX file"}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">employee_id, field, new_value</p>
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={simulateUpload} />
        {!fileName && <div className="mt-3"><Button variant="secondary" onClick={simulateUpload}>Simulate a sample upload</Button></div>}
      </Card>

      {rows && (
        <Card>
          <CardHeader title="Preview & Validation" subtitle={`${rows.length} rows parsed`} action={<Button onClick={() => setProcessed(true)} disabled={processed}>{processed ? "Applied" : "Apply Changes"}</Button>} />
          <Table>
            <THead><TRow><TH>Employee</TH><TH>Field</TH><TH>Current Value</TH><TH>Status</TH></TRow></THead>
            <tbody>
              {rows.map((r) => (
                <TRow key={r.employment_id}>
                  <TD>{employmentDisplayName(db, r.employment_id)}</TD>
                  <TD className="capitalize">{r.field.replace("_", " ")}</TD>
                  <TD>{r.current}</TD>
                  <TD>{processed ? <Badge tone="green">Applied</Badge> : <Badge tone="amber">Validated</Badge>}</TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
