import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { FieldGroup, Select, Input, Textarea } from "../../components/ui/Field";
import { EmptyState, Avatar } from "../../components/ui/Misc";
import { employmentDisplayName } from "../../lib/selectors";
import bannerImage from "../../assets/images/skyline.jpg";

const STATUS_TONE = { open: "amber", in_progress: "cyan", resolved: "green", closed: "neutral" };

export default function Helpdesk() {
  const { db, dispatch } = useDataStore();
  const { employmentId, isHRAdmin } = useAuth();
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [category, setCategory] = useState("other");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [activeTicket, setActiveTicket] = useState(null);
  const [reply, setReply] = useState("");

  const visible = db.helpdeskTickets.filter((t) => isHRAdmin || t.employment_id === employmentId).sort((a, b) => b.raised_on.localeCompare(a.raised_on));

  function submitTicket(e) {
    e.preventDefault();
    dispatch({ type: "CREATE_HELPDESK_TICKET", payload: { employment_id: employmentId, category, subject, assigned_to: null, messages: [{ from: employmentId, text: body, at: new Date().toISOString().slice(0, 10) }] } });
    setNewTicketOpen(false);
    setSubject("");
    setBody("");
  }

  function sendReply(status) {
    dispatch({ type: "REPLY_HELPDESK_TICKET", payload: { ticket_id: activeTicket.ticket_id, from: employmentId, text: reply, status } });
    setReply("");
  }

  const openTicket = activeTicket ? db.helpdeskTickets.find((t) => t.ticket_id === activeTicket.ticket_id) : null;

  return (
    <div>
      <PageBanner image={bannerImage} title="HR Helpdesk" subtitle="Raise a general HR query — not leave, not attendance." action={<Button onClick={() => setNewTicketOpen(true)}>New Ticket</Button>} compact />

      <Card padded={false}>
        {visible.length === 0 ? <div className="p-6"><EmptyState title="No tickets" /></div> : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {visible.map((t) => (
              <button key={t.ticket_id} onClick={() => setActiveTicket(t)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--surface-2)]">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={employmentDisplayName(db, t.employment_id)} size={32} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--text-primary)]">{t.subject}</p>
                    <p className="truncate text-xs text-[var(--text-secondary)]">{employmentDisplayName(db, t.employment_id)} · {t.category.replace("_", " ")} · {t.raised_on}</p>
                  </div>
                </div>
                <Badge tone={STATUS_TONE[t.status]}>{t.status.replace("_", " ")}</Badge>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Modal open={newTicketOpen} onClose={() => setNewTicketOpen(false)} title="New Helpdesk Ticket" footer={<Button onClick={submitTicket}>Submit Ticket</Button>}>
        <form onSubmit={submitTicket} className="flex flex-col gap-4">
          <FieldGroup label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="benefits">Benefits</option>
              <option value="payslip">Payslip</option>
              <option value="id_card">ID Card</option>
              <option value="policy_clarification">Policy Clarification</option>
              <option value="other">Other</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Subject">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </FieldGroup>
          <FieldGroup label="Details">
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </FieldGroup>
        </form>
      </Modal>

      <Modal open={!!openTicket} onClose={() => setActiveTicket(null)} title={openTicket?.subject} wide>
        {openTicket && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge tone={STATUS_TONE[openTicket.status]}>{openTicket.status.replace("_", " ")}</Badge>
              <Badge tone="neutral">{openTicket.category.replace("_", " ")}</Badge>
            </div>
            <div className="flex max-h-64 flex-col gap-3 overflow-y-auto rounded-lg border border-[var(--surface-border)] p-3">
              {openTicket.messages.map((m, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-[var(--text-primary)]">{employmentDisplayName(db, m.from)} <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">{m.at}</span></p>
                  <p className="text-[var(--text-secondary)]">{m.text}</p>
                </div>
              ))}
            </div>
            {isHRAdmin && openTicket.status !== "closed" && (
              <div className="flex flex-col gap-2">
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply to the employee…" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => sendReply("in_progress")} disabled={!reply}>Reply</Button>
                  <Button size="sm" variant="success" onClick={() => sendReply("resolved")} disabled={!reply}>Reply & Resolve</Button>
                  <Button size="sm" variant="ghost" onClick={() => dispatch({ type: "REPLY_HELPDESK_TICKET", payload: { ticket_id: openTicket.ticket_id, from: employmentId, text: "Ticket closed.", status: "closed" } })}>Close</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
