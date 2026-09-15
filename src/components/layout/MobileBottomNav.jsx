import { NavLink } from "react-router-dom";
import { mobilePrimaryNav } from "../../navConfig";

export default function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--surface-border)] bg-[var(--surface-1)]/95 backdrop-blur lg:hidden">
      {mobilePrimaryNav.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? "text-brand-cyan-dark dark:text-brand-cyan" : "text-[var(--text-muted)]"}`
          }
        >
          <item.icon size={19} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
