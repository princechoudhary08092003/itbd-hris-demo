import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../state/AuthContext";
import { useTheme } from "../../state/ThemeContext";
import { useDataStore } from "../../state/DataStore";
import { employmentDisplayName, getEmployment } from "../../lib/selectors";
import { Avatar } from "../ui/Misc";
import Logo from "../ui/Logo";
import { IconMenu, IconSun, IconMoon, IconBell, IconChevronDown, IconSearch } from "../ui/Icons";

export default function TopBar({ onOpenMobileNav }) {
  const { db } = useDataStore();
  const { login, role, switchLogin, availableLogins } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const name = employmentDisplayName(db, login.employment_id);
  const employment = getEmployment(db, login.employment_id);

  function submitSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/hris/directory?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 px-3 backdrop-blur-md sm:px-5"
      style={{ background: "color-mix(in oklab, var(--surface-1) 88%, transparent)", borderBottom: "1px solid var(--surface-border)" }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-2)] lg:hidden" onClick={onOpenMobileNav} aria-label="Open menu">
          <IconMenu />
        </button>
        <Logo size={30} className="shrink-0" />
      </div>

      <form onSubmit={submitSearch} className="mx-2 hidden max-w-sm flex-1 md:block">
        <div className="group flex items-center gap-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface-2)]/70 px-3 py-1.5 transition-colors focus-within:border-brand-cyan/50 focus-within:bg-[var(--surface-1)] focus-within:ring-2 focus-within:ring-brand-cyan/15">
          <IconSearch size={15} className="text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, seats…"
            className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>
      </form>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button onClick={toggleTheme} className="relative overflow-hidden rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-2)]" aria-label="Toggle theme">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 60, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {theme === "dark" ? <IconSun size={17} /> : <IconMoon size={17} />}
            </motion.span>
          </AnimatePresence>
        </button>
        <button className="relative rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-2)]" aria-label="Notifications">
          <IconBell size={17} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_0_2px_var(--surface-1)]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-[var(--surface-border)] py-1 pl-1 pr-2 transition-colors hover:bg-[var(--surface-2)]"
          >
            <Avatar name={name} size={28} />
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-medium leading-tight text-[var(--text-primary)]">{name}</span>
              <span className="block text-[11px] leading-tight text-[var(--text-muted)]">{role.name}{employment?.work_location ? ` · ${employment.work_location}` : ""}</span>
            </span>
            <motion.span animate={{ rotate: roleMenuOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
              <IconChevronDown size={14} className="text-[var(--text-muted)]" />
            </motion.span>
          </button>

          <AnimatePresence>
            {roleMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setRoleMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-20 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface-1)]"
                  style={{ boxShadow: "var(--shadow-pop)" }}
                >
                  <p className="border-b border-[var(--surface-border)] bg-[var(--surface-2)]/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                    Demo role switcher
                  </p>
                  {availableLogins.map((l) => (
                    <button
                      key={l.login_id}
                      onClick={() => {
                        switchLogin(l.login_id);
                        setRoleMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--surface-2)] ${l.login_id === login.login_id ? "bg-brand-cyan/8 font-medium text-brand-cyan-dark dark:text-brand-cyan" : "text-[var(--text-primary)]"}`}
                    >
                      <Avatar name={l.label.split(" — ")[0]} size={24} />
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
