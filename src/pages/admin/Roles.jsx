import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { employmentDisplayName } from "../../lib/selectors";

const ACCESS_TONE = { none: "neutral", read_own: "cyan", create_own: "cyan", read_all: "green", read_write_all: "green", approve_direct_reports: "amber", read_direct_reports: "amber" };

export default function Roles() {
  const { db } = useDataStore();

  return (
    <div>
      <PageHeader title="User & Role Management" subtitle="Roles, who holds them in this demo, and field-level permission grants." />

      <Card className="mb-4">
        <CardHeader title="Security Roles" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {db.securityRoles.map((r) => (
            <div key={r.role_id} className="rounded-lg border border-[var(--surface-border)] p-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{r.name}</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">{r.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <CardHeader title="Demo Logins" subtitle="Who the role switcher signs you in as" />
        <Table>
          <THead><TRow><TH>Login</TH><TH>Employee</TH><TH>Role</TH></TRow></THead>
          <tbody>
            {db.demoLogins.map((l) => (
              <TRow key={l.login_id}>
                <TD className="font-mono-data text-xs">{l.login_id}</TD>
                <TD>{employmentDisplayName(db, l.employment_id)}</TD>
                <TD><Badge tone="cyan">{db.securityRoles.find((r) => r.role_id === l.role_id)?.name}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="Field-Level Permission Grants" />
        <Table>
          <THead><TRow><TH>Role</TH><TH>Resource</TH><TH>Access</TH></TRow></THead>
          <tbody>
            {db.permissionGrants.map((g, i) => (
              <TRow key={i}>
                <TD>{db.securityRoles.find((r) => r.role_id === g.role_id)?.name}</TD>
                <TD className="font-mono-data text-xs">{g.resource}</TD>
                <TD><Badge tone={ACCESS_TONE[g.access] ?? "neutral"}>{g.access.replace(/_/g, " ")}</Badge></TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
