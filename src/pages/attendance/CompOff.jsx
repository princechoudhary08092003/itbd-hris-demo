import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Input } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/Misc";
import { eligibleCompOffDays } from "../../lib/compOff";
import { managerEmploymentOf, isManagerOf, employmentDisplayName } from "../../lib/selectors";
import { toDateStr } from "../../lib/attendance";

const STATUS_TONE = { pending_approval: "amber", approved: "cyan", redeemed: "green", expired: "neutral" };
const STATUS_LABEL = { pending_approval: "Pending Approval", approved: "Approved — Ready to Redeem", redeemed: "Redeemed", expired: "Expired" };

export default function CompOff() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const [redeemDateFor, setRedeemDateFor] = useState(null);
  const [redeemDate, setRedeemDate] = useState(toDateStr(new Date()));

  const eligible = eligibleCompOffDays(db, employmentId);
  const manager = managerEmploymentOf(db, employmentId);

  const mine = db.compOffs.filter((c) => c.employment_id === employmentId).sort((a, b) => b.worked_date.localeCompare(a.worked_date));
  const forApproval = db.compOffs.filter((c) => c.status === "pending_approval" && (isHRAdmin || isManagerOf(db, employmentId, c.employment_id)));

  function apply(date, reason) {
    dispatch({ type: "APPLY_COMP_OFF", payload: { employment_id: employmentId, worked_date: date, reason, approved_by: null } });
  }
  function decide(c, decision) {
    dispatch({ type: "DECIDE_COMP_OFF", payload: { comp_off_id: c.comp_off_id, decision, approved_by: employmentId } });
  }
  function redeem() {
    dispatch({ type: "REDEEM_COMP_OFF", payload: { comp_off_id: redeemDateFor.comp_off_id, redeemed_on_date: redeemDate } });
    setRedeemDateFor(null);
  }

  return (
    <div>
      <PageHeader title="Comp-Off" subtitle="Apply → approve → redeem, computed from actual punches on holidays and week-offs." />

      <Card className="mb-4">
        <CardHeader title="Eligible Days" subtitle="Detected from your punch history — not yet logged as comp-off" />
        {eligible.length === 0 ? (
          <EmptyState title="No new eligible days" subtitle="You have no unlogged work on a holiday or week-off." />
        ) : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {eligible.map((e) => (
              <div key={e.date} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-mono-data text-sm text-[var(--text-primary)]">{e.date}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{e.reason}</p>
                </div>
                <Button size="sm" onClick={() => apply(e.date, e.reason)}>Apply for Comp-Off</Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {forApproval.length > 0 && (
        <Card className="mb-4">
          <CardHeader title="Approval Queue" />
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {forApproval.map((c) => (
              <div key={c.comp_off_id} className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, c.employment_id)} — {c.worked_date}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{c.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="danger" onClick={() => decide(c, "rejected")}>Reject</Button>
                  <Button size="sm" variant="success" onClick={() => decide(c, "approved")}>Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader title="My Comp-Off Ledger" />
        {mine.length === 0 ? (
          <EmptyState title="No comp-off history" />
        ) : (
          <Table>
            <THead>
              <TRow>
                <TH>Worked Date</TH>
                <TH>Reason</TH>
                <TH>Status</TH>
                <TH>Redeemed On</TH>
                <TH></TH>
              </TRow>
            </THead>
            <tbody>
              {mine.map((c) => (
                <TRow key={c.comp_off_id}>
                  <TD className="font-mono-data">{c.worked_date}</TD>
                  <TD className="max-w-xs truncate text-[var(--text-secondary)]">{c.reason}</TD>
                  <TD><Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge></TD>
                  <TD className="font-mono-data">{c.redeemed_on_date ?? "—"}</TD>
                  <TD>{c.status === "approved" && <Button size="sm" onClick={() => setRedeemDateFor(c)}>Redeem</Button>}</TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {redeemDateFor && (
        <Card className="mt-4 border-brand-cyan/40">
          <CardHeader title={`Redeem Comp-Off — worked ${redeemDateFor.worked_date}`} />
          <div className="flex flex-wrap items-end gap-3">
            <FieldGroup label="Redeem against date">
              <Input type="date" value={redeemDate} onChange={(e) => setRedeemDate(e.target.value)} />
            </FieldGroup>
            <Button onClick={redeem}>Confirm Redemption</Button>
            <Button variant="ghost" onClick={() => setRedeemDateFor(null)}>Cancel</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
