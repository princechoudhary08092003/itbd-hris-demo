import { useParams, Link } from "react-router-dom";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Avatar, EmptyState } from "../../components/ui/Misc";
import {
  getEmployment, getPosition, personForEmployment, allEmploymentsForPerson,
  employmentTypeLabel, statusLabel, managerEmploymentOf, employmentDisplayName,
} from "../../lib/selectors";

export default function EmployeeProfile() {
  const { employmentId } = useParams();
  const { db } = useDataStore();
  const employment = getEmployment(db, employmentId);

  if (!employment) return <EmptyState title="Employee not found" />;

  const person = personForEmployment(db, employmentId);
  const position = getPosition(db, employment.position_id);
  const manager = managerEmploymentOf(db, employmentId);
  const allEmployments = allEmploymentsForPerson(db, person.person_id);
  const docs = db.documents.filter((d) => (d.owner_type === "employment" && d.owner_id === employmentId) || (d.owner_type === "person" && d.owner_id === person.person_id));
  const assets = db.assets.filter((a) => a.employment_id === employmentId);

  return (
    <div>
      <PageHeader
        title={`${person.first_name} ${person.last_name}`}
        subtitle={`${position?.seat_title ?? "—"} · ${employment.work_location}`}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Current Employment" />
          <div className="flex items-center gap-3">
            <Avatar name={`${person.first_name} ${person.last_name}`} size={48} />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{person.first_name} {person.last_name}</p>
              <p className="text-xs text-[var(--text-secondary)]">{employment.company_email ?? "No company email issued yet"}</p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Field label="Employee ID" value={employment.employee_id ?? "—"} mono />
            <Field label="Employment Type" value={employmentTypeLabel(employment.employment_type)} />
            <Field label="Status" value={<Badge tone="green">{statusLabel(employment.employment_status)}</Badge>} />
            <Field label="Position" value={position?.seat_title} />
            <Field label="Reports To" value={manager ? employmentDisplayName(db, manager.employment_id) : "—"} />
            <Field label="Date of Joining" value={employment.date_of_joining ?? "—"} mono />
            <Field label="Personal Email" value={person.personal_email} />
            <Field label="Personal Phone" value={person.personal_phone} />
            <Field label="National ID" value={person.national_id} mono />
          </dl>
        </Card>

        <Card>
          <CardHeader title="Assets" />
          {assets.length === 0 ? <EmptyState title="No assets on record" /> : (
            <div className="flex flex-col gap-2">
              {assets.map((a) => (
                <div key={a.asset_id} className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] px-3 py-2 text-sm">
                  <span className="capitalize">{a.asset_type}</span>
                  <Badge tone={a.status === "issued" ? "cyan" : "neutral"}>{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Employment History" subtitle="Every employment period this person has ever had at ITBD, across gaps, exits, and rehires — all linked to one person record." />
        <Table>
          <THead>
            <TRow>
              <TH>Period</TH>
              <TH>Type</TH>
              <TH>Employee ID</TH>
              <TH>Company Email</TH>
              <TH>Status</TH>
              <TH>Exit Reason</TH>
            </TRow>
          </THead>
          <tbody>
            {allEmployments.map((e) => (
              <TRow key={e.employment_id} className={e.employment_id === employmentId ? "bg-brand-cyan/5" : ""}>
                <TD className="font-mono-data">{e.date_of_joining ?? "—"} → {e.exit_date ?? "present"}</TD>
                <TD>{employmentTypeLabel(e.employment_type)}</TD>
                <TD className="font-mono-data">{e.employee_id ?? "—"}</TD>
                <TD>{e.company_email ?? "—"}</TD>
                <TD><Badge tone={e.employment_status === "active" ? "green" : "neutral"}>{statusLabel(e.employment_status)}</Badge></TD>
                <TD>{e.exit_reason?.replace(/_/g, " ") ?? "—"}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Documents" />
        {docs.length === 0 ? <EmptyState title="No documents on file" /> : (
          <div className="flex flex-col divide-y divide-[var(--surface-border)]">
            {docs.map((d) => (
              <div key={d.document_id} className="flex items-center justify-between py-2 text-sm">
                <span className="capitalize text-[var(--text-primary)]">{d.document_type.replace(/_/g, " ")}</span>
                <Badge tone={d.file_name ? "green" : "amber"}>{d.file_name ? "On file" : "Awaiting upload"}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <dt className="text-xs text-[var(--text-muted)]">{label}</dt>
      <dd className={`mt-0.5 text-[var(--text-primary)] ${mono ? "font-mono-data" : ""}`}>{value}</dd>
    </div>
  );
}
