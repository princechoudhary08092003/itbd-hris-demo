import { useMemo, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName } from "../../lib/selectors";
import { computeAttendanceRange, getCycleForDate, addDays, toDateStr } from "../../lib/attendance";

const ALL_FIELDS = [
  { key: "employee_id", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "work_location", label: "Location" },
  { key: "present_days", label: "Present Days" },
  { key: "absent_days", label: "Absent Days" },
  { key: "leave_days", label: "Leave Days" },
  { key: "half_days", label: "Half Days" },
  { key: "comp_off_used", label: "Comp-Off Used" },
  { key: "total_hours", label: "Total Hours" },
];

export default function AttendanceExport() {
  const { db } = useDataStore();
  const [cycleOffset, setCycleOffset] = useState(-1); // previous (locked) cycle by default
  const [fields, setFields] = useState(new Set(ALL_FIELDS.map((f) => f.key)));

  const referenceDate = addDays(toDateStr(new Date()), cycleOffset * 30);
  const cycle = getCycleForDate(referenceDate);

  const rows = useMemo(() => {
    return activeEmployments(db)
      .filter((e) => e.employment_type !== "vendor" || true)
      .map((e) => {
        const days = computeAttendanceRange(db, e.employment_id, cycle.start, cycle.end);
        const compOffUsed = db.compOffs.filter((c) => c.employment_id === e.employment_id && c.status === "redeemed" && c.redeemed_on_date >= cycle.start && c.redeemed_on_date <= cycle.end).length;
        return {
          employee_id: e.employee_id ?? "—",
          name: employmentDisplayName(db, e.employment_id),
          work_location: e.work_location,
          present_days: days.filter((d) => d.status === "present").length,
          absent_days: days.filter((d) => d.status === "absent").length,
          leave_days: days.filter((d) => d.status === "leave").length,
          half_days: days.filter((d) => d.status === "half_day").length,
          comp_off_used: compOffUsed,
          total_hours: Math.round(days.reduce((s, d) => s + d.total_hours, 0) * 10) / 10,
        };
      });
  }, [db, cycle.start, cycle.end]);

  function toggleField(key) {
    setFields((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const locked = cycleOffset < 0;

  return (
    <div>
      <PageHeader
        title="Attendance Export — Finance Cycle"
        subtitle="Display-only preview of what would export for ADP/Finance. Field list is configurable pending sign-off."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCycleOffset((o) => o - 1)}>← Prior Cycle</Button>
            <Button variant="secondary" size="sm" onClick={() => setCycleOffset((o) => Math.min(o + 1, -1))}>Next Cycle →</Button>
          </div>
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{cycle.label}</p>
            <p className="text-xs text-[var(--text-secondary)]">{cycle.start} → {cycle.end}</p>
          </div>
          <Badge tone={locked ? "neutral" : "cyan"}>{locked ? "Locked for Payroll" : "Open Cycle"}</Badge>
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader title="Export Fields" subtitle="Toggle which columns finance receives — exact list still pending sign-off." />
        <div className="flex flex-wrap gap-2">
          {ALL_FIELDS.map((f) => (
            <label key={f.key} className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${fields.has(f.key) ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan-dark dark:text-brand-cyan" : "border-[var(--surface-border)] text-[var(--text-secondary)]"}`}>
              <input type="checkbox" className="hidden" checked={fields.has(f.key)} onChange={() => toggleField(f.key)} />
              {f.label}
            </label>
          ))}
        </div>
      </Card>

      <Card padded={false}>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Export Preview</p>
          <Button size="sm" disabled={!locked} title={locked ? "" : "Export unlocks once the cycle closes"}>Download CSV</Button>
        </div>
        <Table>
          <THead>
            <TRow>
              {ALL_FIELDS.filter((f) => fields.has(f.key)).map((f) => (
                <TH key={f.key}>{f.label}</TH>
              ))}
            </TRow>
          </THead>
          <tbody>
            {rows.map((r) => (
              <TRow key={r.employee_id + r.name}>
                {ALL_FIELDS.filter((f) => fields.has(f.key)).map((f) => (
                  <TD key={f.key} className={typeof r[f.key] === "number" ? "font-mono-data" : ""}>{r[f.key]}</TD>
                ))}
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
