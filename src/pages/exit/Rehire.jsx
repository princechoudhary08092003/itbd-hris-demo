import { useMemo, useState } from "react";
import { useDataStore } from "../../state/DataStore";
import PageBanner from "../../components/ui/PageBanner";
import Card, { CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Input, Select, FieldGroup } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { EmptyState } from "../../components/ui/Misc";
import { getPerson, allEmploymentsForPerson, employmentTypeLabel } from "../../lib/selectors";
import { toDateStr } from "../../lib/attendance";
import bannerImage from "../../assets/images/celebration.jpg";

export default function Rehire() {
  const { db, dispatch } = useDataStore();
  const [query, setQuery] = useState("");
  const [rehiring, setRehiring] = useState(null);
  const [positionId, setPositionId] = useState("");
  const [employmentType, setEmploymentType] = useState("employee");
  const [doj, setDoj] = useState(toDateStr(new Date()));
  const [toast, setToast] = useState("");

  const exitedPeople = useMemo(() => {
    const personIds = [...new Set(db.employments.filter((e) => e.employment_status === "exited").map((e) => e.person_id))];
    return personIds
      .map((pid) => {
        const person = getPerson(db, pid);
        const isCurrentlyActive = db.employments.some((e) => e.person_id === pid && e.employment_status !== "exited");
        return { person, history: allEmploymentsForPerson(db, pid), isCurrentlyActive };
      })
      .filter(({ person, isCurrentlyActive }) => !isCurrentlyActive && (!query || `${person.first_name} ${person.last_name} ${person.national_id}`.toLowerCase().includes(query.toLowerCase())));
  }, [db, query]);

  const openPositions = db.positions.filter((p) => p.position_status === "open" || p.position_status === "bench");

  function confirmRehire() {
    dispatch({ type: "REHIRE_PERSON", payload: { person_id: rehiring.person.person_id, position_id: positionId, employment_type: employmentType, date_of_joining: doj, work_location: "Chicago HQ" } });
    setToast(`New employment created for ${rehiring.person.first_name} ${rehiring.person.last_name} — status: pre-onboarding. Continue in the Onboarding screen.`);
    setRehiring(null);
    setPositionId("");
    setTimeout(() => setToast(""), 6000);
  }

  return (
    <div>
      <PageBanner image={bannerImage} title="Rehire" subtitle="Search past employments by name or national ID across the person's full history at ITBD." compact />

      {toast && <p className="mb-4 rounded-lg bg-brand-green/10 px-3 py-2 text-sm text-brand-green-dark dark:text-brand-green">{toast}</p>}

      <Input placeholder="Search by name or national ID…" value={query} onChange={(e) => setQuery(e.target.value)} className="mb-4 sm:max-w-sm" />

      {exitedPeople.length === 0 ? (
        <EmptyState title="No matching past employees" />
      ) : (
        <div className="flex flex-col gap-3">
          {exitedPeople.map(({ person, history }) => (
            <Card key={person.person_id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{person.first_name} {person.last_name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{history.length} past employment record(s) on file</p>
                </div>
                <Button size="sm" onClick={() => setRehiring({ person, history })}>Start New Employment</Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {history.map((h) => (
                  <Badge key={h.employment_id} tone="neutral">
                    {employmentTypeLabel(h.employment_type)}: {h.date_of_joining} → {h.exit_date ?? "present"}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!rehiring} onClose={() => setRehiring(null)} title={`Rehire ${rehiring?.person.first_name ?? ""} ${rehiring?.person.last_name ?? ""}`} footer={<Button onClick={confirmRehire} disabled={!positionId}>Create Employment Record</Button>}>
        <div className="flex flex-col gap-4">
          <FieldGroup label="New Seat">
            <Select value={positionId} onChange={(e) => setPositionId(e.target.value)}>
              <option value="">Select an open or bench seat</option>
              {openPositions.map((p) => <option key={p.position_id} value={p.position_id}>{p.seat_title}</option>)}
            </Select>
          </FieldGroup>
          <FieldGroup label="Employment Type">
            <Select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
              <option value="employee">Employee</option>
              <option value="vendor">Vendor</option>
              <option value="contractor">Contractor</option>
            </Select>
          </FieldGroup>
          <FieldGroup label="Date of Joining">
            <Input type="date" value={doj} onChange={(e) => setDoj(e.target.value)} />
          </FieldGroup>
          <p className="text-xs text-[var(--text-muted)]">This creates a brand-new employment row linked to the same person_id — a fresh employee_id and company email will be issued once onboarding completes.</p>
        </div>
      </Modal>
    </div>
  );
}
