import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { employmentDisplayName } from "../../lib/selectors";

export default function Assets() {
  const { db, dispatch } = useDataStore();

  return (
    <div>
      <PageHeader title="Asset Management" subtitle="Issue, track, and return company assets per employment." />
      <Card padded={false}>
        <Table>
          <THead>
            <TRow><TH>Employee</TH><TH>Asset Type</TH><TH>Issued</TH><TH>Returned</TH><TH>Status</TH><TH></TH></TRow>
          </THead>
          <tbody>
            {db.assets.map((a) => (
              <TRow key={a.asset_id}>
                <TD>{employmentDisplayName(db, a.employment_id)}</TD>
                <TD className="capitalize">{a.asset_type}</TD>
                <TD className="font-mono-data">{a.issued_date}</TD>
                <TD className="font-mono-data">{a.returned_date ?? "—"}</TD>
                <TD><Badge tone={a.status === "issued" ? "cyan" : "neutral"}>{a.status}</Badge></TD>
                <TD>
                  <Button size="sm" variant="secondary" onClick={() => dispatch({ type: "TOGGLE_ASSET_STATUS", payload: { asset_id: a.asset_id } })}>
                    Mark {a.status === "issued" ? "Returned" : "Re-issued"}
                  </Button>
                </TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
