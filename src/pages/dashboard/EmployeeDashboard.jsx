import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDataStore } from "../../state/DataStore";
import { useAuth } from "../../state/AuthContext";
import Card, { CardHeader } from "../../components/ui/Card";
import StatTile from "../../components/ui/StatTile";
import Badge from "../../components/ui/Badge";
import { Avatar, EmptyState } from "../../components/ui/Misc";
import Reveal, { staggerContainer, staggerItem } from "../../components/ui/Reveal";
import {
  IconCalendar, IconArrowRight, IconMapPin, IconBuilding, IconClock, IconChart,
  IconUsers, IconLayers,
} from "../../components/ui/Icons";
import { directReportEmployments, employmentDisplayName, getEmployment, getPosition, personForEmployment, statusLabel } from "../../lib/selectors";
import { computeAttendanceDay, formatTime, ATTENDANCE_STATUS_META, toDateStr } from "../../lib/attendance";
import { allBalancesFor } from "../../lib/leave";
import { upcomingBirthdays, upcomingHolidays, awaitingMyAction } from "../../lib/dashboard";
import heroImage from "../../assets/images/hero-office.jpg";
import collabImage from "../../assets/images/collab.jpg";

export default function EmployeeDashboard() {
  const { db } = useDataStore();
  const { login, isManager, isHRAdmin } = useAuth();
  const employmentId = login.employment_id;
  const employment = getEmployment(db, employmentId);
  const position = getPosition(db, employment.position_id);
  const person = personForEmployment(db, employmentId);
  const today = toDateStr(new Date());

  const todayAttendance = computeAttendanceDay(db, employmentId, today);
  const balances = allBalancesFor(db, employmentId);
  const ptoBalance = balances.find((b) => b.leaveType.code === "PTO" || b.leaveType.code === "AL");
  const reports = isManager ? directReportEmployments(db, employmentId) : [];
  const actions = awaitingMyAction(db, employmentId, isHRAdmin);
  const birthdays = upcomingBirthdays(db, 30).filter((b) => b.employment_id !== employmentId);
  const holidays = upcomingHolidays(db, employment.work_location, 60);
  const myPayslips = db.payslips.filter((p) => p.employment_id === employmentId);

  const statusMeta = ATTENDANCE_STATUS_META[todayAttendance.status];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Today's Status", value: statusMeta.label, sub: todayAttendance.first_in ? `In: ${formatTime(todayAttendance.first_in)}` : "Not punched in", tone: "cyan", icon: IconClock },
    { label: ptoBalance?.leaveType.name ?? "Leave Balance", value: ptoBalance ? ptoBalance.balance.available : "—", sub: "days available", tone: "green", icon: IconCalendar },
    { label: "Awaiting My Action", value: actions.length, sub: isManager ? "approvals & tickets" : "nothing pending", tone: "default", icon: IconChart },
    { label: isManager ? "My Team" : "Tenure", value: isManager ? reports.length : tenureLabel(employment.date_of_joining), sub: isManager ? "direct reports" : "at ITBD", tone: "default", icon: isManager ? IconUsers : IconLayers },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-card-hover)" }}>
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(115deg, rgba(3,17,29,0.94) 8%, rgba(3,17,29,0.78) 40%, rgba(0,85,105,0.55) 70%, rgba(0,175,221,0.35) 100%)" }}
          />
          <div
            className="absolute -right-10 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl animate-float-slow"
            style={{ background: "radial-gradient(circle, var(--color-brand-green), transparent 70%)" }}
          />
        </div>
        <div className="relative flex flex-col gap-5 px-5 py-7 sm:px-8 sm:py-9 md:flex-row md:items-center md:justify-between">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-cyan-light">{greeting}</p>
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{person.first_name} {person.last_name}</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70">
              <span className="flex items-center gap-1.5"><IconBuilding size={14} /> {position.seat_title}</span>
              <span className="flex items-center gap-1.5"><IconMapPin size={14} /> {employment.work_location}</span>
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex shrink-0 items-center gap-3">
            <Avatar name={`${person.first_name} ${person.last_name}`} size={56} ring />
            <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-white/60">Employee ID</p>
              <p className="font-mono-data text-sm font-semibold text-white">{employment.employee_id}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={staggerItem}>
            <StatTile {...s} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {isManager && (
            <Reveal delay={0.05}>
              <Card>
                <CardHeader title="Awaiting My Action" subtitle="Approvals and tickets that need your response" />
                {actions.length === 0 ? (
                  <EmptyState title="You're all caught up" subtitle="No pending approvals right now." />
                ) : (
                  <div className="flex flex-col divide-y divide-[var(--surface-border)]">
                    {actions.map((a) => (
                      <div key={`${a.type}-${a.id}`} className="group flex items-center justify-between gap-3 rounded-lg py-2.5 px-1.5 -mx-1.5 transition-colors hover:bg-[var(--surface-2)]/60">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar name={employmentDisplayName(db, a.employmentId)} size={30} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{employmentDisplayName(db, a.employmentId)} — {a.label}</p>
                            <p className="truncate text-xs text-[var(--text-secondary)]">{a.detail}</p>
                          </div>
                        </div>
                        <ActionLink type={a.type} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </Reveal>
          )}

          {isManager && (
            <Reveal delay={0.1}>
              <Card>
                <CardHeader title="My Team" subtitle="Direct reports and today's attendance" />
                {reports.length === 0 ? (
                  <EmptyState title="No direct reports" />
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {reports.map((r) => {
                      const rName = employmentDisplayName(db, r.employment_id);
                      const rDay = computeAttendanceDay(db, r.employment_id, today);
                      const rMeta = ATTENDANCE_STATUS_META[rDay.status];
                      return (
                        <div key={r.employment_id} className="flex items-center gap-3 rounded-lg border border-[var(--surface-border)] p-2.5 transition-colors hover:border-brand-cyan/40 hover:bg-[var(--surface-2)]/40">
                          <Avatar name={rName} size={32} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{rName}</p>
                            <p className="truncate text-xs text-[var(--text-secondary)]">{getPosition(db, r.position_id)?.seat_title}</p>
                          </div>
                          <Badge tone={rMeta.tone}>{rMeta.label}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </Reveal>
          )}

          <Reveal delay={0.15}>
            <Card padded={false} className="overflow-hidden">
              <div className="relative h-28 w-full">
                <img src={collabImage} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-1)] via-[var(--surface-1)]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="text-sm font-semibold text-white drop-shadow">Company Announcements</h2>
                </div>
              </div>
              <div className="flex flex-col divide-y divide-[var(--surface-border)] p-4 sm:p-5">
                {db.announcements.map((a) => (
                  <div key={a.announcement_id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{a.title}</p>
                      <span className="shrink-0 text-xs text-[var(--text-muted)]">{a.posted_on}</span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{a.body}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">— {a.posted_by}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4">
          <Reveal delay={0.05}>
            <Card>
              <CardHeader title="Quick Links" />
              <div className="flex flex-col gap-2">
                <QuickLink to="/hris/policy-hub" label="Policy Hub" />
                <QuickLink to="/hris/org-chart" label="Org Chart" />
                <QuickLink to="/leave/apply" label="Apply Leave" />
                <QuickLink to="/attendance/comp-off" label="Comp-Off" />
                {isManager && <QuickLink to="/hris/letters" label="Issue a Letter" />}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card>
              <CardHeader title="Upcoming Holidays" />
              {holidays.length === 0 ? (
                <EmptyState title="None in the next 60 days" />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {holidays.map((h) => (
                    <div key={h.holiday_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconCalendar size={15} className="text-brand-cyan" />
                        <span className="text-sm text-[var(--text-primary)]">{h.name}</span>
                      </div>
                      <span className="font-mono-data text-xs text-[var(--text-secondary)]">{h.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Reveal>

          <Reveal delay={0.15}>
            <Card>
              <CardHeader title="Birthdays" />
              {birthdays.length === 0 ? (
                <EmptyState title="None in the next 30 days" />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {birthdays.slice(0, 6).map((b) => (
                    <div key={b.employment_id} className="flex items-center gap-2.5">
                      <Avatar name={`${b.person.first_name} ${b.person.last_name}`} size={28} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-[var(--text-primary)]">{b.person.first_name} {b.person.last_name}</p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">{b.days === 0 ? "Today" : `in ${b.days}d`}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Reveal>

          <Reveal delay={0.2}>
            <Card>
              <CardHeader title="My Payslips" subtitle="Issued by the payroll vendor — no salary detail is stored in this system" />
              {myPayslips.length === 0 ? (
                <EmptyState title="No payslips yet" />
              ) : (
                <div className="flex flex-col gap-2">
                  {myPayslips.map((p) => (
                    <div key={p.payslip_id} className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] px-3 py-2 text-sm">
                      <span className="text-[var(--text-primary)]">{p.period}</span>
                      <Badge tone="green">Issued</Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Reveal>

          <Reveal delay={0.25}>
            <Card className="relative overflow-hidden">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl"
                style={{ background: "radial-gradient(circle, var(--color-brand-cyan), transparent 70%)" }}
              />
              <CardHeader title="My Profile" />
              <div className="flex items-center gap-3">
                <Avatar name={`${person.first_name} ${person.last_name}`} size={44} ring />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{person.first_name} {person.last_name}</p>
                  <p className="truncate text-xs text-[var(--text-secondary)]">{employment.employee_id}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5"><IconBuilding size={13} /> {position.seat_title}</span>
                <span className="flex items-center gap-1.5"><IconMapPin size={13} /> {employment.work_location}</span>
                <span>Status: <Badge tone="green">{statusLabel(employment.employment_status)}</Badge></span>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function tenureLabel(dateOfJoining) {
  const doj = new Date(`${dateOfJoining}T00:00:00`);
  const now = new Date();
  let years = now.getFullYear() - doj.getFullYear();
  let months = now.getMonth() - doj.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return years > 0 ? `${years}y ${months}m` : `${months}m`;
}

function ActionLink({ type }) {
  const path = { leave: "/leave/approvals", comp_off: "/attendance/bulk-approvals", movement: "/hris/transfers", helpdesk: "/helpdesk" }[type] ?? "/";
  return (
    <Link to={path} className="flex shrink-0 items-center gap-1 text-xs font-medium text-brand-cyan-dark dark:text-brand-cyan hover:underline">
      Review <IconArrowRight size={13} />
    </Link>
  );
}

function QuickLink({ to, label }) {
  return (
    <Link to={to} className="group flex items-center justify-between rounded-lg border border-[var(--surface-border)] px-3 py-2 text-sm text-[var(--text-primary)] transition-all hover:border-brand-cyan/40 hover:bg-[var(--surface-2)] hover:pl-4">
      {label}
      <IconArrowRight size={14} className="text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-brand-cyan" />
    </Link>
  );
}
