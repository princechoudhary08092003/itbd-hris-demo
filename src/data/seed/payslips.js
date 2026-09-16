import { employments } from "./employments";

// Display-only — no amounts or calculations. This system exports attendance
// and leave data to the payroll vendor; it never computes pay itself.
function monthLabel(offset) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset, 1);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function generate() {
  const rows = [];
  let seq = 1;
  for (const e of employments) {
    if (e.employment_status !== "active" || e.employment_type === "vendor") continue;
    for (let m = 1; m <= 3; m++) {
      rows.push({
        payslip_id: `PS-${String(seq++).padStart(5, "0")}`,
        employment_id: e.employment_id,
        period: monthLabel(m),
        status: "issued_by_payroll_vendor",
      });
    }
  }
  return rows;
}

export const payslips = generate();
