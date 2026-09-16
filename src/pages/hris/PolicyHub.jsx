import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Tabs from "../../components/ui/Tabs";
import SignaturePad from "../../components/ui/SignaturePad";
import { FieldGroup, Input, Textarea } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/Misc";
import { IconCheck, IconFile } from "../../components/ui/Icons";
import { employmentDisplayName } from "../../lib/selectors";
import { generateSopDraft } from "../../lib/policy";
import bannerImage from "../../assets/images/team-meeting.jpg";

export default function PolicyHub() {
  const { db } = useDataStore();
  const [tab, setTab] = useState("documents");
  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div>
      <PageBanner image={bannerImage} title="Policy Hub" subtitle="A single source of truth — every policy has a document ID other records can reference, and a live signature trail." compact />

      <Tabs
        tabs={[
          { value: "documents", label: "Policy Documents" },
          { value: "sop", label: "SOP Assistant" },
          { value: "reference", label: "Holiday & Shift Reference" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "documents" && (
        <Card padded={false}>
          <Table>
            <THead>
              <TRow>
                <TH>Document ID</TH>
                <TH>Title</TH>
                <TH>Category</TH>
                <TH>Version</TH>
                <TH>Signature</TH>
                <TH></TH>
              </TRow>
            </THead>
            <tbody>
              {db.policyDocuments.map((doc) => (
                <TRow key={doc.document_id}>
                  <TD className="font-mono-data text-xs">{doc.document_id}</TD>
                  <TD className="font-medium">{doc.title}</TD>
                  <TD className="text-[var(--text-secondary)]">{doc.category}</TD>
                  <TD className="font-mono-data">{doc.version}</TD>
                  <TD>{doc.requires_signature ? <Badge tone="amber">Required</Badge> : <Badge tone="neutral">Not required</Badge>}</TD>
                  <TD><Button size="sm" variant="secondary" onClick={() => setActiveDoc(doc)}>View{doc.requires_signature ? " & Sign" : ""}</Button></TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {tab === "sop" && <SopAssistant />}

      {tab === "reference" && (
        <>
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
              <THead><TRow><TH>Shift</TH><TH>Hours</TH><TH>Break</TH><TH>Grace In / Out</TH><TH>Crosses Midnight</TH></TRow></THead>
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
        </>
      )}

      <DocumentModal doc={activeDoc} onClose={() => setActiveDoc(null)} />
    </div>
  );
}

function DocumentModal({ doc, onClose }) {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const [signatureName, setSignatureName] = useState("");
  const [signatureImg, setSignatureImg] = useState(null);

  if (!doc) return null;

  const signatures = db.policyAcknowledgments.filter((a) => a.document_id === doc.document_id);
  const myAck = signatures.find((a) => a.employment_id === employmentId);

  function submitSignature() {
    if (!signatureName.trim() || !signatureImg) return;
    dispatch({
      type: "SIGN_POLICY_DOCUMENT",
      payload: { document_id: doc.document_id, employment_id: employmentId, signature_name: signatureName.trim(), signature_data_url: signatureImg },
    });
    setSignatureName("");
    setSignatureImg(null);
  }

  return (
    <Modal open={!!doc} onClose={onClose} title={doc.title} wide>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span className="font-mono-data">{doc.document_id}</span>
        <span>·</span>
        <span>v{doc.version}</span>
        <span>·</span>
        <span>Effective {doc.effective_date}</span>
        <span>·</span>
        <span>{doc.owner}</span>
        <span className="ml-auto">{signatures.length} signature(s) on file</span>
      </div>

      {doc.file_url ? (
        <div className="mb-4 overflow-hidden rounded-lg border border-[var(--surface-border)]">
          <iframe src={doc.file_url} title={doc.title} className="h-96 w-full" />
          <div className="flex items-center justify-between bg-[var(--surface-2)] px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"><IconFile size={13} /> {doc.file_url.split("/").pop()}</span>
            <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand-cyan-dark dark:text-brand-cyan hover:underline">Open in new tab</a>
          </div>
        </div>
      ) : (
        <ul className="mb-4 flex flex-col gap-2">
          {doc.points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
              {p}
            </li>
          ))}
        </ul>
      )}

      {doc.requires_signature && (
        myAck ? (
          <div className="flex items-center gap-3 rounded-lg border border-brand-green/30 bg-brand-green/10 px-4 py-3">
            <Badge tone="green"><IconCheck size={12} /></Badge>
            <div>
              <p className="text-sm font-medium text-brand-green-dark dark:text-brand-green">Signed by {myAck.signature_name}</p>
              <p className="font-mono-data text-xs text-[var(--text-muted)]">{myAck.signed_at}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-[var(--surface-border)] p-4">
            <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Review & Sign</p>
            <FieldGroup label="Type your full name">
              <Input value={signatureName} onChange={(e) => setSignatureName(e.target.value)} placeholder="Full name" />
            </FieldGroup>
            <div className="mt-3">
              {signatureImg ? (
                <div className="flex items-center gap-3 rounded-lg border border-[var(--surface-border)] p-2">
                  <img src={signatureImg} alt="Captured signature" className="h-16 rounded bg-white" />
                  <Button size="sm" variant="ghost" onClick={() => setSignatureImg(null)}>Redo</Button>
                </div>
              ) : (
                <SignaturePad onCapture={setSignatureImg} />
              )}
            </div>
            <Button className="mt-3" onClick={submitSignature} disabled={!signatureName.trim() || !signatureImg}>
              Submit Signature
            </Button>
          </div>
        )
      )}

      {signatures.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Signed by</p>
          <div className="flex flex-wrap gap-2">
            {signatures.map((a) => (
              <Badge key={a.ack_id} tone="neutral">{employmentDisplayName(db, a.employment_id)} · {a.signed_at}</Badge>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}

function SopAssistant() {
  const { dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const [topic, setTopic] = useState("");
  const [pointsInput, setPointsInput] = useState("");
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(false);

  function generate(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    setDraft(generateSopDraft(topic.trim(), pointsInput));
    setSaved(false);
  }

  function save() {
    if (!draft) return;
    dispatch({
      type: "CREATE_POLICY_DOCUMENT",
      payload: {
        document_id: draft.document_id,
        title: draft.title,
        category: draft.category,
        version: "1.0",
        owner: "People & HR",
        requires_signature: false,
        file_url: null,
        points: draft.points,
        generated_by: employmentId,
      },
    });
    setSaved(true);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader title="AI SOP Assistant" subtitle="Prototype — describe a policy need and get a standard-formatted draft, ready to save into the Policy Hub." />
        <form onSubmit={generate} className="flex flex-col gap-4">
          <FieldGroup label="Policy topic">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Travel & Expense Reimbursement" required />
          </FieldGroup>
          <FieldGroup label="Key points (one per line)">
            <Textarea value={pointsInput} onChange={(e) => setPointsInput(e.target.value)} placeholder={"Pre-approval required over $500\nReceipts required for all claims\nReimbursed within one payroll cycle"} className="min-h-28" />
          </FieldGroup>
          <div><Button type="submit">Generate Draft</Button></div>
        </form>
      </Card>

      <Card>
        <CardHeader title="Draft Preview" />
        {!draft ? (
          <EmptyState title="No draft yet" subtitle="Fill in a topic and generate one." />
        ) : (
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span className="font-mono-data">{draft.document_id}</span>
              <Badge tone="cyan">{draft.version}</Badge>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{draft.title}</p>
            <div className="mt-3 flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <div><span className="font-medium text-[var(--text-primary)]">Purpose — </span>{draft.sections.purpose}</div>
              <div><span className="font-medium text-[var(--text-primary)]">Scope — </span>{draft.sections.scope}</div>
              <div>
                <span className="font-medium text-[var(--text-primary)]">Policy Statement</span>
                <ul className="mt-1 flex flex-col gap-1.5">
                  {draft.points.map((p, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div><span className="font-medium text-[var(--text-primary)]">Procedure — </span>{draft.sections.procedure}</div>
              <div><span className="font-medium text-[var(--text-primary)]">Responsibilities — </span>{draft.sections.responsibilities}</div>
            </div>
            <Button className="mt-4" variant="success" onClick={save} disabled={saved}>
              {saved ? "Saved to Policy Hub" : "Save to Policy Hub"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
