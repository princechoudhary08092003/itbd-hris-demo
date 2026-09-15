// accrual_method: monthly_accrual | annual_grant | none
export const leaveTypes = [
  { leave_type_id: "LT-PTO", code: "PTO", name: "Paid Time Off", accrual_method: "monthly_accrual", monthly_accrual: 1.67, max_balance: 30, carry_forward_cap: 5, encashment: true, location: "US" },
  { leave_type_id: "LT-SICK-US", code: "SL", name: "Sick Leave", accrual_method: "annual_grant", annual_grant: 10, max_balance: 15, carry_forward_cap: 0, encashment: false, location: "US" },
  { leave_type_id: "LT-AL-UK", code: "AL", name: "Annual Leave", accrual_method: "annual_grant", annual_grant: 25, max_balance: 30, carry_forward_cap: 5, encashment: false, location: "UK" },
  { leave_type_id: "LT-SICK-UK", code: "SL", name: "Sick Leave", accrual_method: "annual_grant", annual_grant: 10, max_balance: 15, carry_forward_cap: 0, encashment: false, location: "UK" },
  { leave_type_id: "LT-UNPAID", code: "LWP", name: "Leave Without Pay", accrual_method: "none", max_balance: null, carry_forward_cap: 0, encashment: false, location: "ALL" },
  { leave_type_id: "LT-PARENTAL", code: "PRNT", name: "Parental Leave", accrual_method: "none", max_balance: 84, carry_forward_cap: 0, encashment: false, location: "ALL" },
];

export function leaveTypesForLocation(workLocation) {
  const region = /london/i.test(workLocation) ? "UK" : "US";
  return leaveTypes.filter((lt) => lt.location === region || lt.location === "ALL");
}
