import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/Misc";
import { personForEmployment, getPosition } from "../../lib/selectors";
import bannerImage from "../../assets/images/onboarding.jpg";

export default function Onboarding() {
  const { db, dispatch } = useDataStore();
  const preOnboarding = db.employments.filter((e) => e.employment_status === "pre_onboarding");
  const [convertedToast, setConvertedToast] = useState("");

  function convert(employment) {
    const person = personForEmployment(db, employment.employment_id);
    const company_email = `${person.first_name}.${person.last_name}`.toLowerCase() + "@itbd.net";
    const employee_id = `EMP-${1300 + Math.floor(Math.random() * 90)}`;
    dispatch({ type: "CONVERT_TO_EMPLOYEE", payload: { employment_id: employment.employment_id, company_email, employee_id } });
    setConvertedToast(`${person.first_name} ${person.last_name} converted to Employee — ${employee_id} / ${company_email}`);
    setTimeout(() => setConvertedToast(""), 5000);
  }

  return (
    <div>
      <PageBanner image={bannerImage} title="Pre-Onboarding" subtitle="Candidates exist in the system before they have a company email — documents can attach here." compact />

      {convertedToast && <p className="mb-4 rounded-lg bg-brand-green/10 px-3 py-2 text-sm text-brand-green-dark dark:text-brand-green">{convertedToast}</p>}

      {preOnboarding.length === 0 ? (
        <EmptyState title="No candidates in pre-onboarding" />
      ) : (
        <div className="flex flex-col gap-4">
          {preOnboarding.map((employment) => (
            <PreOnboardingCard key={employment.employment_id} employment={employment} onConvert={() => convert(employment)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PreOnboardingCard({ employment, onConvert }) {
  const { db } = useDataStore();
  const person = personForEmployment(db, employment.employment_id);
  const position = getPosition(db, employment.position_id);
  const docs = db.documents.filter((d) => d.owner_type === "employment" && d.owner_id === employment.employment_id);
  const allUploaded = docs.every((d) => d.file_name);

  return (
    <Card>
      <CardHeader
        title={`${person.first_name} ${person.last_name}`}
        subtitle={`Target seat: ${position?.seat_title} · Joining ${employment.date_of_joining}`}
        action={<Badge tone="amber">Pre-Onboarding — no company email yet</Badge>}
      />
      <div className="mb-4 flex flex-col gap-2">
        {docs.map((d) => (
          <div key={d.document_id} className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] px-3 py-2 text-sm">
            <span className="capitalize text-[var(--text-primary)]">{d.document_type.replace(/_/g, " ")}</span>
            <Badge tone={d.file_name ? "green" : "amber"}>{d.file_name ? "Uploaded" : "Awaiting upload"}</Badge>
          </div>
        ))}
      </div>
      <Button onClick={onConvert} disabled={!allUploaded} title={allUploaded ? "" : "All documents must be uploaded first"}>
        Convert to Employee — Issue Company Email
      </Button>
    </Card>
  );
}
