import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Avatar } from "../../components/ui/Misc";
import { computeAttendanceRange, computeAttendanceDay, formatTime, ATTENDANCE_STATUS_META, toDateStr, addDays, getCycleForDate } from "../../lib/attendance";
import { directReportEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";

export default function AttendanceHome() {
  const { db } = useDataStore();
  const { employmentId, isManager } = useAuth();
  const [tab, setTab] = useState("mine");

  const today = toDateStr(new Date());
  const cycle = getCycleForDate(today);
  const rangeStart = cycle.start < addDays(today, -20) ? addDays(today, -20) : cycle.start;
  const myDays = computeAttendanceRange(db, employmentId, rangeStart, today).reverse();

  const reports = isManager ? directReportEmployments(db, employmentId) : [];

  return (
    <div>
      <PageHeader title="Attendance" subtitle={`Current finance cycle: ${cycle.label}`} />

      {isManager && (
        <Tabs
          tabs={[
            { value: "mine", label: "My Attendance" },
            { value: "team", label: "Team Attendance" },
          ]}
          active={tab}
          onChange={setTab}
        />
      )}

      {tab === "mine" && (
        <Card>
          <CardHeader title="My Attendance" subtitle={`${rangeStart} → ${today}`} />
          <Table>
            <THead>
              <TRow>
                <TH>Date</TH>
                <TH>Shift</TH>
                <TH>First In</TH>
                <TH>Last Out</TH>
                <TH>Total Hrs</TH>
                <TH>Status</TH>
                <TH>Cycle</TH>
              </TRow>
            </THead>
            <tbody>
              {myDays.map((d) => {
                const meta = ATTENDANCE_STATUS_META[d.status];
                return (
                  <TRow key={d.date} className={d.locked_for_payroll ? "opacity-70" : ""}>
                    <TD className="font-mono-data">{d.date}</TD>
                    <TD>{d.shift?.name ?? "—"}</TD>
                    <TD className="font-mono-data">{formatTime(d.first_in)} {d.is_late && <Badge tone="amber" className="ml-1">Late</Badge>}</TD>
                    <TD className="font-mono-data">{formatTime(d.last_out)}</TD>
                    <TD className="font-mono-data">{d.total_hours || "—"}</TD>
                    <TD><Badge tone={meta.tone}>{meta.label}</Badge></TD>
                    <TD>{d.locked_for_payroll ? <Badge tone="neutral">Locked</Badge> : <Badge tone="cyan">Open</Badge>}</TD>
                  </TRow>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === "team" && (
        <Card>
          <CardHeader title="Team Attendance — Today" subtitle={today} />
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {reports.map((r) => {
              const name = employmentDisplayName(db, r.employment_id);
              const d = computeAttendanceDay(db, r.employment_id, today);
              const meta = ATTENDANCE_STATUS_META[d.status];
              return (
                <div key={r.employment_id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={name} size={32} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">{name}</p>
                      <p className="truncate text-xs text-[var(--text-secondary)]">{getPosition(db, r.position_id)?.seat_title} · {d.shift?.name ?? "No shift assigned"}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-mono-data text-xs text-[var(--text-secondary)]">{formatTime(d.first_in)}</span>
                    {d.is_late && <Badge tone="amber">Late</Badge>}
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
