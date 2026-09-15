import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileBottomNav from "./MobileBottomNav";
import Logo from "../ui/Logo";
import { IconX } from "../ui/Icons";
import RouteGuard from "./RouteGuard";

export default function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--surface-0)]">
      <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex w-full items-start">
        <aside
          className="sticky top-14 hidden h-[calc(100svh-56px)] w-[264px] shrink-0 lg:block"
          style={{
            background: "linear-gradient(180deg, var(--sidebar-bg) 0%, var(--sidebar-bg-2) 100%)",
            borderRight: "1px solid var(--sidebar-border)",
            boxShadow: "4px 0 24px -8px rgba(0,0,0,0.35)",
          }}
        >
          <Sidebar />
        </aside>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto shadow-2xl"
              style={{ background: "linear-gradient(180deg, var(--sidebar-bg) 0%, var(--sidebar-bg-2) 100%)" }}
            >
              <div className="flex h-14 items-center justify-between px-4" style={{ borderBottom: "1px solid var(--sidebar-border)" }}>
                <Logo size={28} className="[&_span:first-child]:text-white [&_span:last-child]:text-[var(--sidebar-text-dim)]" />
                <button onClick={() => setMobileNavOpen(false)} className="rounded-lg p-1.5 text-[var(--sidebar-text)] hover:bg-white/10" aria-label="Close menu">
                  <IconX size={18} />
                </button>
              </div>
              <Sidebar onNavigate={() => setMobileNavOpen(false)} instanceId="mobile" />
            </motion.div>
          </div>
        )}

        <main className="bg-mesh min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-7 sm:pb-10 lg:px-10 xl:px-14 2xl:px-20">
          <div className="mx-auto w-full max-w-[2100px]">
            <RouteGuard>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </RouteGuard>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
