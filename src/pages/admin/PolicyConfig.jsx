import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";

export default function PolicyConfig() {
  const { db } = useDataStore();

  return (
    <div>
      <PageHeader title="Policy Configuration" subtitle="Leave types, holiday calendars, and shift definitions per country/location." />

      <Card className="mb-4">
        <CardHeader title="Leave Types" />
        <Table>
          <THead><TRow><TH>Code</TH><TH>Name</TH><TH>Location</TH><TH>Accrual</TH><TH>Max Balance</TH><TH>Carry-Forward Cap</TH><TH>Encashment</TH></TRow></THead>
          <tbody>
            {db.leaveTypes.map((lt) => (
              <TRow key={lt.leave_type_id}>
                <TD className="font-mono-data">{lt.code}</TD>
                <TD>{lt.name}</TD>
                <TD><Badge tone="neutral">{lt.location}</Badge></TD>
                <TD className="text-xs text-[var(--text-secondary)]">{lt.accrual_method.replace("_", " ")}{lt.monthly_accrual ? ` (${lt.monthly_accrual}/mo)` : lt.annual_grant ? ` (${lt.annual_grant}/yr)` : ""}</TD>
                <TD className="font-mono-data">{lt.max_balance ?? "—"}</TD>
                <TD className="font-mono-data">{lt.carry_forward_cap}</TD>
                <TD>{lt.encashment ? <Badge tone="green">Yes</Badge> : <Badge tone="neutral">No</Badge>}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mb-4">
        <CardHeader title="Holiday Calendar" />
        <Table>
          <THead><TRow><TH>Holiday</TH><TH>Date</TH><TH>Locations</TH></TRow></THead>
          <tbody>
            {db.holidays.map((h) => (
              <TRow key={h.holiday_id}><TD>{h.name}</TD><TD className="font-mono-data">{h.date}</TD><TD>{h.locations.join(", ")}</TD></TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="Shift Definitions" />
        <Table>
          <THead><TRow><TH>Shift</TH><TH>Hours</TH><TH>Break</TH><TH>Grace</TH><TH>Crosses Midnight</TH><TH>Work Days</TH></TRow></THead>
          <tbody>
            {db.shiftDefinitions.map((s) => (
              <TRow key={s.shift_id}>
                <TD>{s.name}</TD>
                <TD className="font-mono-data">{s.start_time}–{s.end_time}</TD>
                <TD className="font-mono-data">{s.break_minutes}m</TD>
                <TD className="font-mono-data">{s.grace_in_minutes}m/{s.grace_out_minutes}m</TD>
                <TD>{s.crosses_midnight ? <Badge tone="violet">Yes</Badge> : "No"}</TD>
                <TD className="text-xs">{s.work_days.map((d) => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(", ")}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
