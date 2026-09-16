import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { PlaceholderScreen } from "../../components/ui/Misc";
import { IconLock } from "../../components/ui/Icons";

const PROVIDERS = [
  { name: "Azure AD / Entra ID", scope: "Primary SSO for all US & UK staff", status: "planned" },
  { name: "Google Workspace SSO", scope: "Secondary provider for Philippines operations", status: "planned" },
  { name: "TOTP / Authenticator App MFA", scope: "Required for HR Admin & Super Admin roles on sensitive actions", status: "planned" },
];

export default function Security() {
  return (
    <div>
      <PageHeader title="Security — SSO / AD / MFA" subtitle="Secure single sign-on and MFA for sensitive HR actions, across all geographies." />

      <Card className="mb-4">
        <CardHeader title="Planned Identity Providers" />
        <div className="flex flex-col divide-y divide-[var(--surface-border)]">
          {PROVIDERS.map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <IconLock size={15} className="text-[var(--text-muted)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{p.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{p.scope}</p>
                </div>
              </div>
              <Badge tone="amber">Planned — Phase 1B</Badge>
            </div>
          ))}
        </div>
      </Card>

      <PlaceholderScreen
        title="SSO / MFA Configuration"
        note="This screen requires a real identity provider connection (Azure AD, Okta, Google Workspace) and cannot be meaningfully demoed without one. The mocked role switcher stands in for auth in this build."
      />
    </div>
  );
}
