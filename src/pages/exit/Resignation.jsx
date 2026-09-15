import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { FieldGroup, Input, Textarea } from "../../components/ui/Field";
import { EmptyState } from "../../components/ui/Misc";
import { toDateStr, addDays } from "../../lib/attendance";

export default function Resignation() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();

  const [lastDay, setLastDay] = useState(addDays(toDateStr(new Date()), 30));
  const [reason, setReason] = useState("");

  const mine = db.resignations.filter((r) => r.employment_id === employmentId);

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: "SUBMIT_RESIGNATION",
      payload: { employment_id: employmentId, initiated_by: "self", resignation_date: toDateStr(new Date()), last_working_day: lastDay, reason },
    });
    setReason("");
  }

  return (
    <div>
      <PageHeader title="Resignation" subtitle="Submit your own resignation." />

      <Card className="mb-4">
        <CardHeader title="Submit Resignation" />
        {mine.some((r) => r.status !== "withdrawn") ? (
          <p className="text-sm text-[var(--text-secondary)]">You already have an active resignation on file (see below). Contact HR to withdraw it before submitting a new one.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <FieldGroup label="Preferred Last Working Day">
              <Input type="date" value={lastDay} onChange={(e) => setLastDay(e.target.value)} />
            </FieldGroup>
            <FieldGroup label="Reason">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} required />
            </FieldGroup>
            <div><Button type="submit">Submit Resignation</Button></div>
          </form>
        )}
      </Card>

      <Card>
        <CardHeader title="My Resignation History" />
        {mine.length === 0 ? <EmptyState title="No resignation on file" /> : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {mine.map((r) => (
              <div key={r.resignation_id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm text-[var(--text-primary)]">Last working day: {r.last_working_day}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{r.reason}</p>
                </div>
                <Badge tone={r.status === "completed" ? "green" : "amber"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
