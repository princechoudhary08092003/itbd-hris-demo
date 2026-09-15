import { useLocation } from "react-router-dom";
import { navSections, canSee } from "../../navConfig";
import { useAuth } from "../../state/AuthContext";
import Card from "../ui/Card";
import { IconShield } from "../ui/Icons";

const ALL_ITEMS = navSections.flatMap((s) => s.items);

export default function RouteGuard({ children }) {
  const { pathname } = useLocation();
  const { login } = useAuth();

  const match = ALL_ITEMS.find((item) => item.path === pathname || (item.path !== "/" && pathname.startsWith(item.path + "/")));
  const allowed = !match || canSee(match.minRole, login.role_id);

  if (!allowed) {
    return (
      <Card className="mx-auto mt-10 max-w-md text-center">
        <IconShield size={28} className="mx-auto mb-3 text-[var(--text-muted)]" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Access Restricted</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {match.label} requires {match.minRole.replace("_", " ")} access or higher. Switch roles from the top-right menu to view this screen.
        </p>
      </Card>
    );
  }

  return children;
}
