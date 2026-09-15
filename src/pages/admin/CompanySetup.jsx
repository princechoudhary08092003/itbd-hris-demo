import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";

const LEGAL_ENTITIES = [
  { name: "IT By Design Inc.", country: "United States", ein: "EIN-84-1029384" },
  { name: "IT By Design Ltd.", country: "United Kingdom", ein: "CRN-09284710" },
];
const COST_CENTERS = [
  { code: "CC-100", name: "Client Delivery", entity: "IT By Design Inc." },
  { code: "CC-200", name: "Engineering", entity: "IT By Design Inc." },
  { code: "CC-300", name: "People & HR", entity: "IT By Design Inc." },
  { code: "CC-400", name: "Finance & Ops", entity: "IT By Design Inc." },
  { code: "CC-500", name: "Sales & Marketing", entity: "IT By Design Inc." },
  { code: "CC-600", name: "EMEA Delivery", entity: "IT By Design Ltd." },
];

export default function CompanySetup() {
  const { db } = useDataStore();
  const locations = [...new Set(db.employments.map((e) => e.work_location).filter(Boolean))];

  return (
    <div>
      <PageHeader title="Company / Entity Setup" subtitle="Legal entities, cost centers, org units, and work locations." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Legal Entities" />
          <Table>
            <THead><TRow><TH>Entity</TH><TH>Country</TH><TH>Registration</TH></TRow></THead>
            <tbody>
              {LEGAL_ENTITIES.map((e) => (
                <TRow key={e.name}><TD>{e.name}</TD><TD>{e.country}</TD><TD className="font-mono-data text-xs">{e.ein}</TD></TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Cost Centers" />
          <Table>
            <THead><TRow><TH>Code</TH><TH>Name</TH><TH>Entity</TH></TRow></THead>
            <tbody>
              {COST_CENTERS.map((c) => (
                <TRow key={c.code}><TD className="font-mono-data">{c.code}</TD><TD>{c.name}</TD><TD className="text-xs text-[var(--text-secondary)]">{c.entity}</TD></TRow>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader title="Work Locations" />
          <div className="flex flex-wrap gap-2">
            {locations.map((l) => (
              <span key={l} className="rounded-full border border-[var(--surface-border)] px-3 py-1 text-xs text-[var(--text-primary)]">{l}</span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Org Units" />
          <div className="flex flex-col gap-1.5">
            {db.orgUnits.map((u) => (
              <div key={u.org_unit_id} className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-primary)]">{u.name}</span>
                <span className="font-mono-data text-xs text-[var(--text-muted)]">{u.org_unit_id}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
