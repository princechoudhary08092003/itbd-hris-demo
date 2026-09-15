import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/Misc";
import { employmentDisplayName } from "../../lib/selectors";

const ITEM_LABEL = { asset_return: "Asset Return", access_revocation: "Access Revocation", final_documents: "Final Documents", knowledge_transfer: "Knowledge Transfer" };
const STATUS_TONE = { pending: "amber", in_progress: "cyan", completed: "green" };
const NEXT_STATUS = { pending: "in_progress", in_progress: "completed", completed: "pending" };

export default function ExitChecklist() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();

  const employmentIds = [...new Set(db.exitChecklists.map((c) => c.employment_id))];

  function advance(item) {
    dispatch({ type: "UPDATE_EXIT_CHECKLIST_ITEM", payload: { checklist_id: item.checklist_id, status: NEXT_STATUS[item.status], completed_by: employmentId } });
  }

  return (
    <div>
      <PageHeader title="Exit Checklist & Clearance Tracker" subtitle="Click a status pill to advance it through pending → in progress → completed." />
      {employmentIds.length === 0 ? <EmptyState title="No exits in progress" /> : (
        <div className="flex flex-col gap-4">
          {employmentIds.map((eid) => {
            const items = db.exitChecklists.filter((c) => c.employment_id === eid);
            const doneCount = items.filter((i) => i.status === "completed").length;
            return (
              <Card key={eid}>
                <CardHeader title={employmentDisplayName(db, eid)} subtitle={`${doneCount} of ${items.length} items complete`} />
                <div className="flex flex-col divide-y divide-[var(--surface-border)]">
                  {items.map((item) => (
                    <div key={item.checklist_id} className="flex items-center justify-between py-2.5">
                      <span className="text-sm text-[var(--text-primary)]">{ITEM_LABEL[item.item]}</span>
                      <Button size="sm" variant="ghost" onClick={() => advance(item)}>
                        <Badge tone={STATUS_TONE[item.status]}>{item.status.replace("_", " ")}</Badge>
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
