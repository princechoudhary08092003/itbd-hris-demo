import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { FieldGroup, Select } from "../../components/ui/Field";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { activeEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { toDateStr } from "../../lib/attendance";

const TEMPLATES = [
  { id: "offer", name: "Offer Letter", body: (n, p) => `Dear ${n},\n\nWe are pleased to offer you the position of ${p} at ITBD.` },
  { id: "promotion", name: "Promotion Letter", body: (n, p) => `Dear ${n},\n\nCongratulations — effective this cycle, you have been promoted to ${p}.` },
  { id: "increment", name: "Increment Letter", body: (n) => `Dear ${n},\n\nWe are glad to inform you of a compensation increment effective this cycle.` },
  { id: "relieving", name: "Relieving Letter", body: (n) => `Dear ${n},\n\nThis is to confirm your last working day and relieve you from your duties at ITBD.` },
];

const SEED_LETTERS = [
  { letter_id: "LT-9001", template: "Offer Letter", employee: "Olivia Martinez", generated_on: "2026-09-06" },
  { letter_id: "LT-9002", template: "Relieving Letter", employee: "Priya Nair", generated_on: "2022-06-28" },
];

export default function Letters() {
  const { db } = useDataStore();
  const [letters, setLetters] = useState(SEED_LETTERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [empId, setEmpId] = useState(activeEmployments(db)[0]?.employment_id ?? "");
  const [preview, setPreview] = useState(null);

  function generatePreview() {
    const template = TEMPLATES.find((t) => t.id === templateId);
    const name = employmentDisplayName(db, empId);
    const position = getPosition(db, db.employments.find((e) => e.employment_id === empId)?.position_id)?.seat_title;
    setPreview({ template, name, body: template.body(name, position) });
  }

  function confirmGenerate() {
    setLetters((prev) => [{ letter_id: `LT-${9000 + prev.length + 3}`, template: preview.template.name, employee: preview.name, generated_on: toDateStr(new Date()) }, ...prev]);
    setModalOpen(false);
    setPreview(null);
  }

  return (
    <div>
      <PageHeader title="Letters" subtitle="Generate offer, promotion, increment, and relieving letters from templates." action={<Button onClick={() => setModalOpen(true)}>Generate Letter</Button>} />

      <Card padded={false}>
        <Table>
          <THead>
            <TRow>
              <TH>Letter ID</TH>
              <TH>Template</TH>
              <TH>Employee</TH>
              <TH>Generated On</TH>
              <TH></TH>
            </TRow>
          </THead>
          <tbody>
            {letters.map((l) => (
              <TRow key={l.letter_id}>
                <TD className="font-mono-data">{l.letter_id}</TD>
                <TD>{l.template}</TD>
                <TD>{l.employee}</TD>
                <TD className="font-mono-data text-xs">{l.generated_on}</TD>
                <TD><Badge tone="green">Generated</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setPreview(null); }}
        title="Generate Letter"
        wide
        footer={preview ? <Button onClick={confirmGenerate}>Confirm & Save</Button> : <Button onClick={generatePreview}>Preview</Button>}
      >
        <div className="flex flex-col gap-4">
          <FieldGroup label="Template">
            <Select value={templateId} onChange={(e) => { setTemplateId(e.target.value); setPreview(null); }}>
              {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Employee">
            <Select value={empId} onChange={(e) => { setEmpId(e.target.value); setPreview(null); }}>
              {activeEmployments(db).map((e) => <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>)}
            </Select>
          </FieldGroup>
          {preview && (
            <div className="whitespace-pre-line rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-primary)]">
              {preview.body}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
