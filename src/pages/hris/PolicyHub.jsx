import { useDataStore } from "../../state/DataStore";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import bannerImage from "../../assets/images/team-meeting.jpg";

const POLICY_GROUPS = [
  {
    title: "Leave Policy",
    items: ["PTO accrues at 1.67 days/month for US employees, capped at 30 days.", "Annual Leave (UK) is granted 25 days/year, capped at 30 days.", "Unused PTO/AL carries forward up to 5 days into the next period.", "Sick leave does not carry forward and cannot be encashed."],
  },
  {
    title: "Comp-Off Policy",
    items: ["Working a declared holiday or a scheduled week-off earns one comp-off day.", "Comp-off must be approved by the reporting manager before redemption.", "Comp-off must be redeemed within 60 days of approval or it expires."],
  },
  {
    title: "Attendance Policy",
    items: ["Grace period applies per shift — a punch within grace is never marked late.", "A night shift's attendance day is attributed to the date the shift started.", "Attendance locks for payroll once the 21st–20th cycle closes."],
  },
  {
    title: "Movement & Transfer Policy",
    items: ["All movement requests require HR Admin approval before becoming effective.", "Approving a movement updates the org chart and the employee's reporting line immediately.", "Bench release and client reassignment follow the same approval workflow as transfers."],
  },
];

export default function PolicyHub() {
  const { db } = useDataStore();

  return (
    <div>
      <PageBanner image={bannerImage} title="Policy Hub" subtitle="Reference policies driving the business rules in this demo." compact />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {POLICY_GROUPS.map((g) => (
          <Card key={g.title}>
            <CardHeader title={g.title} />
            <ul className="flex flex-col gap-2">
              {g.items.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader title="Holiday Calendar" />
        <Table>
          <THead>
            <TRow>
              <TH>Holiday</TH>
              <TH>Date</TH>
              <TH>Locations</TH>
            </TRow>
          </THead>
          <tbody>
            {db.holidays.map((h) => (
              <TRow key={h.holiday_id}>
                <TD>{h.name}</TD>
                <TD className="font-mono-data">{h.date}</TD>
                <TD>{h.locations.join(", ")}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Shift Definitions" />
        <Table>
          <THead>
            <TRow>
              <TH>Shift</TH>
              <TH>Hours</TH>
              <TH>Break</TH>
              <TH>Grace In / Out</TH>
              <TH>Crosses Midnight</TH>
            </TRow>
          </THead>
          <tbody>
            {db.shiftDefinitions.map((s) => (
              <TRow key={s.shift_id}>
                <TD>{s.name}</TD>
                <TD className="font-mono-data">{s.start_time}–{s.end_time}</TD>
                <TD className="font-mono-data">{s.break_minutes}m</TD>
                <TD className="font-mono-data">{s.grace_in_minutes}m / {s.grace_out_minutes}m</TD>
                <TD>{s.crosses_midnight ? "Yes" : "No"}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
