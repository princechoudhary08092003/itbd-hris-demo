import { useRef, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";

export default function BulkShiftUpload() {
  const { db, dispatch } = useDataStore();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [processed, setProcessed] = useState(false);

  const employees = activeEmployments(db).filter((e) => e.employment_type === "employee").slice(0, 8);

  function simulateUpload() {
    setFileName("monthly_roster_upload.csv");
    setProcessed(false);
    const rows = employees.map((e, i) => ({
      employment_id: e.employment_id,
      shift_id: db.shiftDefinitions[i % db.shiftDefinitions.length].shift_id,
    }));
    setPreview(rows);
  }

  function process() {
    if (!preview) return;
    const dateFrom = toDateStr(new Date());
    const dateTo = addDays(dateFrom, 27);
    const byShift = {};
    for (const row of preview) {
      byShift[row.shift_id] = byShift[row.shift_id] || [];
      byShift[row.shift_id].push(row.employment_id);
    }
    for (const [shift_id, employment_ids] of Object.entries(byShift)) {
      dispatch({ type: "BULK_ASSIGN_SHIFT", payload: { employment_ids, date_from: dateFrom, date_to: dateTo, shift_id } });
    }
    setProcessed(true);
  }

  return (
    <div>
      <PageHeader title="Bulk Shift Upload" subtitle="Upload a monthly roster file to assign shifts in bulk." />

      <Card className="mb-4">
        <CardHeader title="Upload File" />
        <div
          onClick={() => fileRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--surface-border)] py-10 text-center hover:border-brand-cyan/50"
        >
          <p className="text-sm font-medium text-[var(--text-primary)]">{fileName || "Click to select a CSV file"}</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">employee_id, shift_code, effective_from, effective_to</p>
        </div>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={simulateUpload} />
        {!fileName && (
          <div className="mt-3">
            <Button variant="secondary" onClick={simulateUpload}>Simulate a sample upload</Button>
          </div>
        )}
      </Card>

      {preview && (
        <Card>
          <CardHeader title="Preview" subtitle={`${preview.length} rows parsed from ${fileName}`} action={<Button onClick={process} disabled={processed}>{processed ? "Processed" : "Process Upload"}</Button>} />
          <Table>
            <THead>
              <TRow>
                <TH>Employee</TH>
                <TH>Shift</TH>
                <TH>Status</TH>
              </TRow>
            </THead>
            <tbody>
              {preview.map((row) => (
                <TRow key={row.employment_id}>
                  <TD>{employmentDisplayName(db, row.employment_id)}</TD>
                  <TD>{db.shiftDefinitions.find((s) => s.shift_id === row.shift_id)?.name}</TD>
                  <TD>{processed ? <Badge tone="green">Applied</Badge> : <Badge tone="amber">Pending</Badge>}</TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  );
}
