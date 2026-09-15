import { shiftAssignments } from "./shiftAssignments";
import { shiftDefinitions } from "./shiftDefinitions";

function shiftById(id) {
  return shiftDefinitions.find((s) => s.shift_id === id);
}

// deterministic pseudo-random minute jitter, stable across reloads
function jitter(seedStr, range) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) >>> 0;
  return (h % (range * 2 + 1)) - range;
}

function toUtcIso(dateStr, hhmm, addDays = 0) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + addDays);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function addMinutesToHHMM(hhmm, minutes) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const days = Math.floor(total / 1440);
  return { hhmm: `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`, dayOffset: total < 0 ? -1 : days };
}

const sources = ["biometric", "mobile_geofence", "manual", "middleware_import", "access_control"];
function sourceFor(seedStr) {
  return sources[Math.abs(jitter(seedStr, 1000)) % sources.length];
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Hand-placed overrides so the demo hits the exact rules in the brief:
// { employment_id, date, in, out, outDayOffset }
const overrides = {
  // Isabella Rossi — night shift 22:00–06:00, grace 10 min.
  // Punch at 22:05 must NOT read late; punch at 22:15 (a later date) must.
  [`EMY-P015-01|${isoDaysAgo(6)}`]: { in: "22:05", out: "06:02" },
  [`EMY-P015-01|${isoDaysAgo(3)}`]: { in: "22:15", out: "06:08" },
  // Jamal Carter — 9–5, grace 10 min. On-time vs late pair.
  [`EMY-P013-01|${isoDaysAgo(5)}`]: { in: "09:05", out: "17:04" },
  [`EMY-P013-01|${isoDaysAgo(2)}`]: { in: "09:15", out: "17:20" },
};

function generatePunches() {
  const rows = [];
  let seq = 1;

  for (const a of shiftAssignments) {
    const shift = shiftById(a.shift_id);
    const key = `${a.employment_id}|${a.date}`;
    const override = overrides[key];

    const inHHMM = override?.in ?? addMinutesToHHMM(shift.start_time, jitter(key + "in", 12)).hhmm;
    const outResult = override
      ? { hhmm: override.out, dayOffset: shift.crosses_midnight ? 1 : 0 }
      : addMinutesToHHMM(shift.end_time, jitter(key + "out", 10));

    const inTs = toUtcIso(a.date, inHHMM, 0);
    const outTs = toUtcIso(a.date, outResult.hhmm, shift.crosses_midnight ? 1 : outResult.dayOffset);

    // occasionally skip the out-punch entirely to simulate a missed punch (rare)
    const skipOut = !override && Math.abs(jitter(key + "skip", 100)) < 2 && a.date < isoDaysAgo(1);

    rows.push({ punch_id: `PN-${String(seq++).padStart(6, "0")}`, employment_id: a.employment_id, timestamp_utc: inTs, direction: "in", source: sourceFor(key + "in"), device_id: `DEV-${a.employment_id.slice(-4)}` });
    if (!skipOut) {
      rows.push({ punch_id: `PN-${String(seq++).padStart(6, "0")}`, employment_id: a.employment_id, timestamp_utc: outTs, direction: "out", source: sourceFor(key + "out"), device_id: `DEV-${a.employment_id.slice(-4)}` });
    }
  }

  // Comp-off eligible days: worked on a declared holiday, or on a day outside the normal roster (week-off)
  const compOffWorkedDays = [
    { employment_id: "EMY-P012-01", date: isoDaysAgo(18), in: "09:02", out: "17:10" }, // Grace, Founders Day holiday
    { employment_id: "EMY-P011-01", date: isoDaysAgo(9), in: "10:00", out: "15:30" }, // Noah, week-off day
    { employment_id: "EMY-P014-01", date: isoDaysAgo(33), in: "08:00", out: "14:00" }, // Wei, week-off day (already redeemed comp-off)
  ];
  for (const w of compOffWorkedDays) {
    rows.push({ punch_id: `PN-${String(seq++).padStart(6, "0")}`, employment_id: w.employment_id, timestamp_utc: toUtcIso(w.date, w.in), direction: "in", source: "access_control", device_id: `DEV-${w.employment_id.slice(-4)}` });
    rows.push({ punch_id: `PN-${String(seq++).padStart(6, "0")}`, employment_id: w.employment_id, timestamp_utc: toUtcIso(w.date, w.out), direction: "out", source: "access_control", device_id: `DEV-${w.employment_id.slice(-4)}` });
  }

  return rows;
}

export const punchEvents = generatePunches();
