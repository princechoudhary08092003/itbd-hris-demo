import { useState } from "react";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import { EmptyState } from "../../components/ui/Misc";
import { personForEmployment, getPosition, employmentDisplayName } from "../../lib/selectors";
import bannerImage from "../../assets/images/onboarding.jpg";

const PROBATION_OUTCOME_TONE = { confirmed: "green", extended: "amber", terminated: "red" };

export default function Onboarding() {
  const { db, dispatch } = useDataStore();
  const { employmentId } = useAuth();
  const [tab, setTab] = useState("preonboarding");
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

  function completeReview(review, outcome) {
    dispatch({ type: "COMPLETE_PROBATION_REVIEW", payload: { review_id: review.review_id, outcome, reviewed_by: employmentId } });
  }

  const scheduled = db.probationReviews.filter((r) => r.status === "scheduled").sort((a, b) => a.review_date.localeCompare(b.review_date));
  const completed = db.probationReviews.filter((r) => r.status === "completed").sort((a, b) => b.review_date.localeCompare(a.review_date));

  return (
    <div>
      <PageBanner image={bannerImage} title="Onboarding & Offboarding" subtitle="Automates the hire-to-exit lifecycle: pre-onboarding, probation reviews, transfers, and full & final settlement." compact />

      <Tabs
        tabs={[
          { value: "preonboarding", label: "Pre-Onboarding" },
          { value: "probation", label: "Probation Reviews" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "preonboarding" && (
        <>
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
        </>
      )}

      {tab === "probation" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Due for Review" subtitle="90 days from date of joining" />
            {scheduled.length === 0 ? <EmptyState title="Nothing due right now" /> : (
              <div className="flex flex-col divide-y divide-[var(--surface-border)]">
                {scheduled.map((r) => (
                  <div key={r.review_id} className="flex items-center justify-between gap-3 py-2.5">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, r.employment_id)}</p>
                      <p className="font-mono-data text-xs text-[var(--text-muted)]">Due {r.review_date}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="success" onClick={() => completeReview(r, "confirmed")}>Confirm</Button>
                      <Button size="sm" variant="secondary" onClick={() => completeReview(r, "extended")}>Extend</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader title="Review History" />
            {completed.length === 0 ? <EmptyState title="No completed reviews yet" /> : (
              <div className="flex flex-col divide-y divide-[var(--surface-border)]">
                {completed.map((r) => (
                  <div key={r.review_id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{employmentDisplayName(db, r.employment_id)}</p>
                      <p className="font-mono-data text-xs text-[var(--text-muted)]">{r.review_date}</p>
                    </div>
                    <Badge tone={PROBATION_OUTCOME_TONE[r.outcome] ?? "neutral"}>{r.outcome}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
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
