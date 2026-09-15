import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/Misc";
import { leaveTypesFor, computeLeaveBalance, LEAVE_STATUS_META } from "../../lib/leave";

export default function LeaveDetails() {
  const { db } = useDataStore();
  const { employmentId } = useAuth();
  const [filter, setFilter] = useState("all");
  const leaveTypes = leaveTypesFor(db, employmentId);

  const history = db.leaveRequests
    .filter((lr) => lr.employment_id === employmentId && (filter === "all" || lr.status === filter))
    .slice()
    .sort((a, b) => b.applied_on.localeCompare(a.applied_on));

  return (
    <div>
      <PageHeader title="My Leave Details" subtitle="Period 2026 — opening and accrued balances with live usage." />

      <Card className="mb-4">
        <CardHeader title="Balance Summary" />
        <Table>
          <THead>
            <TRow>
              <TH>Leave Type</TH>
              <TH>Opening</TH>
              <TH>Accrued</TH>
              <TH>Used</TH>
              <TH>Pending</TH>
              <TH>Closing</TH>
              <TH>Available</TH>
            </TRow>
          </THead>
          <tbody>
            {leaveTypes.map((lt) => {
              const b = computeLeaveBalance(db, employmentId, lt.leave_type_id);
              return (
                <TRow key={lt.leave_type_id}>
                  <TD className="font-medium">{lt.name} <span className="text-[var(--text-muted)]">({lt.code})</span></TD>
                  <TD className="font-mono-data">{b.opening}</TD>
                  <TD className="font-mono-data">{b.accrued}</TD>
                  <TD className="font-mono-data">{b.used}</TD>
                  <TD className="font-mono-data">{b.pending}</TD>
                  <TD className="font-mono-data">{b.closing}</TD>
                  <TD className="font-mono-data font-semibold text-brand-cyan-dark dark:text-brand-cyan">{b.available}</TD>
                </TRow>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="Request History" />
        <Tabs
          tabs={[
            { value: "all", label: "All" },
            { value: "pending_approval", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          active={filter}
          onChange={setFilter}
        />
        {history.length === 0 ? (
          <EmptyState title="No requests in this filter" />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>Type</TH>
                <TH>Dates</TH>
                <TH>Days</TH>
                <TH>Status</TH>
                <TH>Reason</TH>
              </TRow>
            </THead>
            <tbody>
              {history.map((lr) => {
                const lt = db.leaveTypes.find((t) => t.leave_type_id === lr.leave_type_id);
                const meta = LEAVE_STATUS_META[lr.status];
                return (
                  <TRow key={lr.request_id}>
                    <TD>{lt?.name}</TD>
                    <TD className="font-mono-data">{lr.start_date} → {lr.end_date}</TD>
                    <TD className="font-mono-data">{lr.days}</TD>
                    <TD><Badge tone={meta.tone}>{meta.label}</Badge></TD>
                    <TD className="max-w-xs truncate text-[var(--text-secondary)]">{lr.reason}{lr.rejection_note ? ` — ${lr.rejection_note}` : ""}</TD>
                  </TRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
