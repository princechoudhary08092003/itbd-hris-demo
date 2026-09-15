import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { EmptyState } from "../../components/ui/Misc";
import { employmentDisplayName } from "../../lib/selectors";
import { toDateStr, addDays } from "../../lib/attendance";

export default function DocumentExpiry() {
  const { db } = useDataStore();
  const today = toDateStr(new Date());
  const cutoff = addDays(today, 90);

  const tracked = db.documents
    .filter((d) => d.expiry_date)
    .sort((a, b) => a.expiry_date.localeCompare(b.expiry_date));

  return (
    <div>
      <PageHeader title="Document Expiry Tracking" subtitle="Visa, work permit, and certification expiries — flagged within 90 days." />
      <Card padded={false}>
        {tracked.length === 0 ? <div className="p-6"><EmptyState title="Nothing tracked" /></div> : (
          <Table>
            <THead>
              <TRow><TH>Employee</TH><TH>Document</TH><TH>Expiry Date</TH><TH>Status</TH></TRow>
            </THead>
            <tbody>
              {tracked.map((d) => {
                const expiringSoon = d.expiry_date <= cutoff;
                const expired = d.expiry_date < today;
                return (
                  <TRow key={d.document_id}>
                    <TD>{employmentDisplayName(db, d.owner_id)}</TD>
                    <TD className="capitalize">{d.document_type.replace(/_/g, " ")}</TD>
                    <TD className="font-mono-data">{d.expiry_date}</TD>
                    <TD>
                      {expired ? <Badge tone="red">Expired</Badge> : expiringSoon ? <Badge tone="amber">Expiring Soon</Badge> : <Badge tone="green">Valid</Badge>}
                    </TD>
                  </TRow>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
