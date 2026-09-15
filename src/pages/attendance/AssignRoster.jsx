import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FieldGroup, Input, Select } from "../../components/ui/Field";
import { activeEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";

export default function AssignRoster() {
  const { db, dispatch } = useDataStore();
  const employees = activeEmployments(db).filter((e) => e.employment_type === "employee");

  const [selected, setSelected] = useState(new Set());
  const [shiftId, setShiftId] = useState(db.shiftDefinitions[0]?.shift_id ?? "");
  const [dateFrom, setDateFrom] = useState(toDateStr(new Date()));
  const [dateTo, setDateTo] = useState(addDays(toDateStr(new Date()), 6));
  const [toast, setToast] = useState("");

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => (prev.size === employees.length ? new Set() : new Set(employees.map((e) => e.employment_id))));
  }

  function assign() {
    if (selected.size === 0) return;
    dispatch({ type: "BULK_ASSIGN_SHIFT", payload: { employment_ids: [...selected], date_from: dateFrom, date_to: dateTo, shift_id: shiftId } });
    setToast(`Assigned ${db.shiftDefinitions.find((s) => s.shift_id === shiftId)?.name} to ${selected.size} employee(s) from ${dateFrom} to ${dateTo}.`);
    setSelected(new Set());
    setTimeout(() => setToast(""), 4000);
  }

  return (
    <div>
      <PageHeader title="Assign Roster" subtitle="Bulk-assign a shift to selected employees for a date range." />

      <Card className="mb-4">
        <CardHeader title="Assignment" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FieldGroup label="Shift">
            <Select value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
              {db.shiftDefinitions.map((s) => (
                <option key={s.shift_id} value={s.shift_id}>{s.name}</option>
              ))}
            </Select>
          </FieldGroup>
          <FieldGroup label="From">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </FieldGroup>
          <FieldGroup label="To">
            <Input type="date" value={dateTo} min={dateFrom} onChange={(e) => setDateTo(e.target.value)} />
          </FieldGroup>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={assign} disabled={selected.size === 0}>Assign to {selected.size} Selected</Button>
          {toast && <span className="text-sm text-brand-green-dark dark:text-brand-green">{toast}</span>}
        </div>
      </Card>

      <Card padded={false}>
        <div className="flex items-center justify-between border-b border-[var(--surface-border)] p-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Employees</p>
          <button onClick={toggleAll} className="text-xs font-medium text-brand-cyan-dark dark:text-brand-cyan hover:underline">
            {selected.size === employees.length ? "Clear all" : "Select all"}
          </button>
        </div>
        <div className="max-h-[480px] divide-y divide-[var(--surface-border)] overflow-y-auto">
          {employees.map((e) => (
            <label key={e.employment_id} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-2)]">
              <input type="checkbox" className="h-4 w-4 accent-[var(--color-brand-cyan)]" checked={selected.has(e.employment_id)} onChange={() => toggle(e.employment_id)} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-[var(--text-primary)]">{employmentDisplayName(db, e.employment_id)}</p>
                <p className="truncate text-xs text-[var(--text-secondary)]">{getPosition(db, e.position_id)?.seat_title} · {e.work_location}</p>
              </div>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
