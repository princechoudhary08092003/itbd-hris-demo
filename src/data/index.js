import { people } from "./seed/people";
import { employments } from "./seed/employments";
import { positions } from "./seed/positions";
import { orgUnits } from "./seed/orgUnits";
import { movementRequests } from "./seed/movementRequests";
import { shiftDefinitions } from "./seed/shiftDefinitions";
import { shiftAssignments } from "./seed/shiftAssignments";
import { punchEvents } from "./seed/punchEvents";
import { leaveTypes } from "./seed/leaveTypes";
import { leaveEntitlements } from "./seed/leaveEntitlements";
import { leaveRequests } from "./seed/leaveRequests";
import { compOffs } from "./seed/compOffs";
import { holidays } from "./seed/holidays";
import { resignations, exitChecklists } from "./seed/resignations";
import { documents, assets } from "./seed/documents";
import { announcements } from "./seed/announcements";
import { helpdeskTickets } from "./seed/helpdeskTickets";
import { securityRoles, permissionGrants, demoLogins } from "./seed/roles";

// A fresh deep clone every time the app boots (or the demo is reset),
// so edits made during a session never leak into the seed modules themselves.
export function createInitialState() {
  return structuredClone({
    people,
    employments,
    positions,
    orgUnits,
    movementRequests,
    shiftDefinitions,
    shiftAssignments,
    punchEvents,
    leaveTypes,
    leaveEntitlements,
    leaveRequests,
    compOffs,
    holidays,
    resignations,
    exitChecklists,
    documents,
    assets,
    announcements,
    helpdeskTickets,
    securityRoles,
    permissionGrants,
    demoLogins,
    shiftSwapRequests: [],
  });
}
