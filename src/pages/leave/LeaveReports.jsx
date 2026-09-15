import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments } from "../../lib/selectors";

export default function LeaveReports() {
  const { db } = useDataStore();
  const employees = activeEmployments(db);

  const totalApproved = db.leaveRequests.filter((lr) => lr.status === "approved").reduce((s, lr) => s + lr.days, 0);
  const totalPending = db.leaveRequests.filter((lr) => lr.status === "pending_approval").length;
  const totalRejected = db.leaveRequests.filter((lr) => lr.status === "rejected").length;

  const byType = db.leaveTypes.map((lt) => ({
    lt,
    used: db.leaveRequests.filter((lr) => lr.leave_type_id === lt.leave_type_id && lr.status === "approved").reduce((s, lr) => s + lr.days, 0),
    requests: db.leaveRequests.filter((lr) => lr.leave_type_id === lt.leave_type_id).length,
  })).filter((r) => r.requests > 0);

  return (
    <div>
      <PageHeader title="Leave Reports" subtitle="Company-wide leave utilization, live from current request data." />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Days Approved (YTD)" value={totalApproved} tone="green" />
        <StatTile label="Pending Requests" value={totalPending} tone="cyan" />
        <StatTile label="Rejected Requests" value={totalRejected} />
        <StatTile label="Active Employees" value={employees.length} />
      </div>

      <Card>
        <CardHeader title="Usage by Leave Type" />
        <Table>
          <THead>
            <TRow>
              <TH>Leave Type</TH>
              <TH>Location</TH>
              <TH>Requests</TH>
              <TH>Days Used (Approved)</TH>
            </TRow>
          </THead>
          <tbody>
            {byType.map(({ lt, used, requests }) => (
              <TRow key={lt.leave_type_id}>
                <TD className="font-medium">{lt.name} ({lt.code})</TD>
                <TD>{lt.location}</TD>
                <TD className="font-mono-data">{requests}</TD>
                <TD className="font-mono-data">{used}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
