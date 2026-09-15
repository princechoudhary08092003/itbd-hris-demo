import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { navSections, canSee } from "../../navConfig";
import { useAuth } from "../../state/AuthContext";

export default function Sidebar({ onNavigate, instanceId = "desktop" }) {
  const { login } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
      {navSections.map((section) => {
        const items = section.items.filter((item) => canSee(item.minRole, login.role_id));
        if (items.length === 0) return null;
        return (
          <div key={section.title} className="mb-2">
            <p className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--sidebar-text-dim)" }}>
              {section.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const isActive = item.path === "/" ? pathname === "/" : pathname === item.path || pathname.startsWith(item.path + "/");
                return (
                  <Link key={item.path} to={item.path} onClick={onNavigate} className="relative block">
                    {isActive && (
                      <motion.div
                        layoutId={`sidebar-active-pill-${instanceId}`}
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "linear-gradient(90deg, color-mix(in oklab, var(--color-brand-cyan) 22%, transparent), color-mix(in oklab, var(--color-brand-green) 14%, transparent))",
                          boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--color-brand-cyan) 35%, transparent)",
                        }}
                      />
                    )}
                    <span
                      className={`relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${
                        isActive ? "font-medium text-white" : "hover:bg-white/[0.06]"
                      }`}
                      style={{ color: isActive ? "#ffffff" : "var(--sidebar-text)" }}
                    >
                      {item.icon ? (
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                          style={isActive ? { background: "color-mix(in oklab, var(--color-brand-cyan) 55%, transparent)" } : {}}
                        >
                          <item.icon size={15} />
                        </span>
                      ) : (
                        <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
