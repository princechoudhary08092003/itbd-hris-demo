import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDataStore } from "../../state/DataStore";
import PageHeader from "../../components/ui/PageHeader";
import Card, { CardHeader } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Select } from "../../components/ui/Field";
import { Avatar, EmptyState } from "../../components/ui/Misc";
import { IconClock } from "../../components/ui/Icons";
import { activeEmployments, employmentDisplayName, getPosition } from "../../lib/selectors";
import { formatTime, toDateStr } from "../../lib/attendance";

export default function LiveCapture() {
  const { db, dispatch } = useDataStore();
  const employees = activeEmployments(db).filter((e) => e.employment_type === "employee");
  const [empId, setEmpId] = useState(employees[0]?.employment_id ?? "");
  const [flash, setFlash] = useState(null);

  const today = toDateStr(new Date());
  const todaysLog = db.punchEvents
    .filter((p) => p.timestamp_utc.slice(0, 10) === today && p.source === "access_control")
    .sort((a, b) => b.timestamp_utc.localeCompare(a.timestamp_utc));

  function tap() {
    if (!empId) return;
    dispatch({ type: "ADD_KIOSK_PUNCH", payload: { employment_id: empId, device_id: "KIOSK-LOBBY-01" } });
    const name = employmentDisplayName(db, empId);
    setFlash({ name, at: Date.now() });
    setTimeout(() => setFlash(null), 1800);
  }

  return (
    <div>
      <PageHeader title="Live Attendance Capture" subtitle="A badge tap at any reader instantly records attendance — no manual entry, no waiting for a batch sync." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Lobby Reader" subtitle="Device KIOSK-LOBBY-01" />
          <Select value={empId} onChange={(e) => setEmpId(e.target.value)} className="mb-5">
            {employees.map((e) => (
              <option key={e.employment_id} value={e.employment_id}>{employmentDisplayName(db, e.employment_id)}</option>
            ))}
          </Select>

          <div className="flex flex-col items-center gap-4 py-4">
            <motion.button
              onClick={tap}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.03 }}
              className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dark text-white"
              style={{ boxShadow: "var(--glow-cyan)" }}
            >
              <IconClock size={40} />
              <span className="absolute -bottom-7 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">Tap Card</span>
            </motion.button>

            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-6 flex items-center gap-2 rounded-xl border border-brand-green/40 bg-brand-green/10 px-4 py-2.5"
                >
                  <Avatar name={flash.name} size={28} />
                  <div>
                    <p className="text-sm font-semibold text-brand-green-dark dark:text-brand-green">{flash.name} — captured</p>
                    <p className="font-mono-data text-xs text-[var(--text-muted)]">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="p-4 sm:p-5">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Today's Capture Log</p>
            <p className="text-xs text-[var(--text-secondary)]">Every tap across all readers, newest first</p>
          </div>
          {todaysLog.length === 0 ? (
            <div className="px-5 pb-5"><EmptyState title="No taps yet today" subtitle="Use the reader on the left to simulate one." /></div>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--surface-border)] px-4 pb-4 sm:px-5 sm:pb-5">
              <AnimatePresence initial={false}>
                {todaysLog.map((p) => {
                  const name = employmentDisplayName(db, p.employment_id);
                  return (
                    <motion.div
                      key={p.punch_id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center gap-3 py-2.5"
                    >
                      <Avatar name={name} size={30} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)]">{name}</p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">{getPosition(db, db.employments.find((e) => e.employment_id === p.employment_id)?.position_id)?.seat_title} · {p.device_id}</p>
                      </div>
                      <Badge tone={p.direction === "in" ? "green" : "neutral"}>{p.direction.toUpperCase()}</Badge>
                      <span className="font-mono-data text-xs text-[var(--text-muted)]">{formatTime(p.timestamp_utc)}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
