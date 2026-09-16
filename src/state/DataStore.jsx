import { createContext, useContext, useMemo, useReducer } from "react";
import { createInitialState } from "../data";
import { toDateStr } from "../lib/attendance";
import { PIP_STAGE_ORDER, DISCIPLINE_STAGE_ORDER } from "../lib/performance";

const DataStoreContext = createContext(null);

let idSeq = 9000;
function nextId(prefix) {
  idSeq += 1;
  return `${prefix}-${idSeq}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return createInitialState();

    case "APPLY_LEAVE": {
      const { employment_id, leave_type_id, start_date, end_date, days, reason, approver_id } = action.payload;
      const request = {
        request_id: nextId("LR"),
        employment_id,
        leave_type_id,
        start_date,
        end_date,
        days,
        status: "pending_approval",
        approver_id,
        applied_on: toDateStr(new Date()),
        reason,
      };
      return { ...state, leaveRequests: [request, ...state.leaveRequests] };
    }

    case "CANCEL_LEAVE": {
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((lr) => (lr.request_id === action.payload.request_id ? { ...lr, status: "cancelled" } : lr)),
      };
    }

    case "DECIDE_LEAVE": {
      const { request_id, decision, note } = action.payload;
      return {
        ...state,
        leaveRequests: state.leaveRequests.map((lr) =>
          lr.request_id === request_id ? { ...lr, status: decision, rejection_note: decision === "rejected" ? note : lr.rejection_note } : lr
        ),
      };
    }

    case "SUBMIT_MOVEMENT": {
      const movement = { movement_id: nextId("MV"), status: "pending_approval", created_at: toDateStr(new Date()), approved_by: null, ...action.payload };
      return { ...state, movementRequests: [movement, ...state.movementRequests] };
    }

    case "DECIDE_MOVEMENT": {
      const { movement_id, decision, approved_by } = action.payload;
      return {
        ...state,
        movementRequests: state.movementRequests.map((m) => (m.movement_id === movement_id ? { ...m, status: decision, approved_by: decision === "approved" ? approved_by : m.approved_by } : m)),
      };
    }

    case "MAKE_MOVEMENT_EFFECTIVE": {
      const { movement_id } = action.payload;
      const movement = state.movementRequests.find((m) => m.movement_id === movement_id);
      if (!movement) return state;
      return {
        ...state,
        movementRequests: state.movementRequests.map((m) => (m.movement_id === movement_id ? { ...m, status: "effective" } : m)),
        employments: state.employments.map((e) =>
          e.employment_id === movement.employment_id ? { ...e, position_id: movement.to_position_id, work_location: movement.to_work_location } : e
        ),
        positions: state.positions.map((p) => {
          if (p.position_id === movement.from_position_id && movement.from_position_id !== movement.to_position_id) return { ...p, position_status: p.position_id === "POS-SUP-ENG-BENCH" ? "bench" : "open" };
          if (p.position_id === movement.to_position_id) return { ...p, position_status: "filled" };
          return p;
        }),
      };
    }

    case "PROMOTE_EMPLOYEE": {
      const { employment_id, to_position_id, effective_date, reason, requested_by } = action.payload;
      const employment = state.employments.find((e) => e.employment_id === employment_id);
      const fromPosition = state.positions.find((p) => p.position_id === employment.position_id);
      const toPosition = state.positions.find((p) => p.position_id === to_position_id);
      const movement = {
        movement_id: nextId("MV"),
        employment_id,
        movement_type: "position_change",
        from_position_id: employment.position_id,
        to_position_id,
        from_reports_to_position_id: fromPosition?.reports_to_position_id ?? null,
        to_reports_to_position_id: toPosition?.reports_to_position_id ?? null,
        from_work_location: employment.work_location,
        to_work_location: employment.work_location,
        requested_by,
        approved_by: requested_by,
        status: "effective",
        effective_date,
        created_at: toDateStr(new Date()),
        reason: `Promotion: ${reason}`,
      };
      return {
        ...state,
        movementRequests: [movement, ...state.movementRequests],
        employments: state.employments.map((e) => (e.employment_id === employment_id ? { ...e, position_id: to_position_id } : e)),
        positions: state.positions.map((p) => {
          if (p.position_id === employment.position_id) return { ...p, position_status: "open" };
          if (p.position_id === to_position_id) return { ...p, position_status: "filled" };
          return p;
        }),
      };
    }

    case "APPLY_COMP_OFF": {
      const comp = { comp_off_id: nextId("CO"), status: "pending_approval", redeemed_on_date: null, approved_by: null, ...action.payload };
      return { ...state, compOffs: [comp, ...state.compOffs] };
    }

    case "DECIDE_COMP_OFF": {
      const { comp_off_id, decision, approved_by } = action.payload;
      return {
        ...state,
        compOffs: state.compOffs.map((c) => (c.comp_off_id === comp_off_id ? { ...c, status: decision, approved_by: decision === "approved" ? approved_by : c.approved_by } : c)),
      };
    }

    case "REDEEM_COMP_OFF": {
      const { comp_off_id, redeemed_on_date } = action.payload;
      return {
        ...state,
        compOffs: state.compOffs.map((c) => (c.comp_off_id === comp_off_id ? { ...c, status: "redeemed", redeemed_on_date } : c)),
      };
    }

    case "REQUEST_SHIFT_SWAP": {
      const { employment_id, date, from_shift_id, to_shift_id, approver_id, reason } = action.payload;
      const swap = { swap_id: nextId("SW"), employment_id, date, from_shift_id, to_shift_id, approver_id, reason, status: "pending_approval", requested_on: toDateStr(new Date()) };
      return { ...state, shiftSwapRequests: [swap, ...state.shiftSwapRequests] };
    }

    case "DECIDE_SHIFT_SWAP": {
      const { swap_id, decision } = action.payload;
      const swap = state.shiftSwapRequests.find((s) => s.swap_id === swap_id);
      if (!swap) return state;
      const updatedSwaps = state.shiftSwapRequests.map((s) => (s.swap_id === swap_id ? { ...s, status: decision } : s));
      if (decision !== "approved") return { ...state, shiftSwapRequests: updatedSwaps };
      const filtered = state.shiftAssignments.filter((sa) => !(sa.employment_id === swap.employment_id && sa.date === swap.date));
      return {
        ...state,
        shiftSwapRequests: updatedSwaps,
        shiftAssignments: [...filtered, { assignment_id: nextId("SA"), employment_id: swap.employment_id, date: swap.date, shift_id: swap.to_shift_id, source: "swap" }],
      };
    }

    case "BULK_ASSIGN_SHIFT": {
      const { employment_ids, date_from, date_to, shift_id } = action.payload;
      const toDate = (s) => new Date(`${s}T00:00:00`);
      let cursor = toDate(date_from);
      const end = toDate(date_to);
      const newRows = [];
      while (cursor <= end) {
        const dateStr = toDateStr(cursor);
        for (const employment_id of employment_ids) newRows.push({ assignment_id: nextId("SA"), employment_id, date: dateStr, shift_id, source: "monthly_bulk" });
        cursor.setDate(cursor.getDate() + 1);
      }
      const keySet = new Set(newRows.map((r) => `${r.employment_id}|${r.date}`));
      const filtered = state.shiftAssignments.filter((sa) => !keySet.has(`${sa.employment_id}|${sa.date}`));
      return { ...state, shiftAssignments: [...filtered, ...newRows] };
    }

    case "CONVERT_TO_EMPLOYEE": {
      const { employment_id, company_email, employee_id } = action.payload;
      return {
        ...state,
        employments: state.employments.map((e) => (e.employment_id === employment_id ? { ...e, employment_status: "active", company_email, employee_id } : e)),
      };
    }

    case "REHIRE_PERSON": {
      const { person_id, position_id, employment_type, date_of_joining, work_location } = action.payload;
      const employment = {
        employment_id: nextId("EMY"),
        person_id,
        employee_id: `EMP-${1400 + Math.floor(Math.random() * 90)}`,
        company_email: null,
        employment_type,
        employment_status: "pre_onboarding",
        position_id,
        date_of_joining,
        exit_date: null,
        exit_type: null,
        exit_reason: null,
        work_location,
      };
      return {
        ...state,
        employments: [...state.employments, employment],
        positions: state.positions.map((p) => (p.position_id === position_id ? { ...p, position_status: "filled" } : p)),
      };
    }

    case "SUBMIT_RESIGNATION": {
      const resignation = { resignation_id: nextId("RES"), status: "submitted", ...action.payload };
      return { ...state, resignations: [resignation, ...state.resignations] };
    }

    case "UPDATE_EXIT_CHECKLIST_ITEM": {
      const { checklist_id, status, completed_by } = action.payload;
      return {
        ...state,
        exitChecklists: state.exitChecklists.map((c) =>
          c.checklist_id === checklist_id ? { ...c, status, completed_by: status === "completed" ? completed_by : c.completed_by, completed_at: status === "completed" ? toDateStr(new Date()) : null } : c
        ),
      };
    }

    case "TOGGLE_ASSET_STATUS": {
      const { asset_id } = action.payload;
      return {
        ...state,
        assets: state.assets.map((a) =>
          a.asset_id === asset_id
            ? a.status === "issued"
              ? { ...a, status: "returned", returned_date: toDateStr(new Date()) }
              : { ...a, status: "issued", returned_date: null }
            : a
        ),
      };
    }

    case "CREATE_HELPDESK_TICKET": {
      const ticket = { ticket_id: nextId("HD"), status: "open", raised_on: toDateStr(new Date()), messages: [], ...action.payload };
      return { ...state, helpdeskTickets: [ticket, ...state.helpdeskTickets] };
    }

    case "REPLY_HELPDESK_TICKET": {
      const { ticket_id, from, text, status } = action.payload;
      return {
        ...state,
        helpdeskTickets: state.helpdeskTickets.map((t) =>
          t.ticket_id === ticket_id ? { ...t, status: status ?? t.status, messages: [...t.messages, { from, text, at: toDateStr(new Date()) }] } : t
        ),
      };
    }

    case "CREATE_PIP_CASE": {
      const pip = { pip_id: nextId("PIP"), stage: "initiated", letter_generated: false, ...action.payload };
      return { ...state, pipCases: [pip, ...state.pipCases] };
    }

    case "ADVANCE_PIP_CASE": {
      const { pip_id, outcome } = action.payload;
      return {
        ...state,
        pipCases: state.pipCases.map((p) => {
          if (p.pip_id !== pip_id) return p;
          const currentIndex = PIP_STAGE_ORDER.indexOf(p.stage);
          const nextStage = PIP_STAGE_ORDER[Math.min(currentIndex + 1, PIP_STAGE_ORDER.length - 1)];
          return { ...p, stage: nextStage, outcome: nextStage === "closed" ? outcome ?? p.outcome : p.outcome };
        }),
      };
    }

    case "GENERATE_PIP_LETTER": {
      return { ...state, pipCases: state.pipCases.map((p) => (p.pip_id === action.payload.pip_id ? { ...p, letter_generated: true } : p)) };
    }

    case "CREATE_DISCIPLINE_CASE": {
      const disc = { case_id: nextId("DISC"), stage: "nte_issued", ntd_date: null, decision: null, ...action.payload };
      return { ...state, disciplineCases: [disc, ...state.disciplineCases] };
    }

    case "ADVANCE_DISCIPLINE_CASE": {
      const { case_id, decision } = action.payload;
      return {
        ...state,
        disciplineCases: state.disciplineCases.map((c) => {
          if (c.case_id !== case_id) return c;
          const currentIndex = DISCIPLINE_STAGE_ORDER.indexOf(c.stage);
          const nextStage = DISCIPLINE_STAGE_ORDER[Math.min(currentIndex + 1, DISCIPLINE_STAGE_ORDER.length - 1)];
          return {
            ...c,
            stage: nextStage,
            ntd_date: nextStage === "ntd_issued" ? toDateStr(new Date()) : c.ntd_date,
            decision: nextStage === "closed" ? decision ?? c.decision : c.decision,
          };
        }),
      };
    }

    case "ADJUST_CALIBRATION": {
      const { employment_id, results_score, behavior_score } = action.payload;
      return {
        ...state,
        performanceMetrics: state.performanceMetrics.map((m) =>
          m.employment_id === employment_id ? { ...m, results_score, behavior_score, source: "calibration_adjustment" } : m
        ),
      };
    }

    case "RUN_KPI_INGESTION": {
      const run = {
        run_id: nextId("KPI-RUN"),
        ran_at: toDateStr(new Date()),
        source: action.payload?.source ?? "QA Scorecard API",
        records_ingested: state.performanceMetrics.length,
        status: "success",
      };
      return { ...state, kpiIngestionLog: [run, ...state.kpiIngestionLog] };
    }

    case "UPDATE_SUCCESSION_READINESS": {
      const { plan_id, readiness } = action.payload;
      return { ...state, successionPlans: state.successionPlans.map((p) => (p.plan_id === plan_id ? { ...p, readiness } : p)) };
    }

    case "COMPLETE_PROBATION_REVIEW": {
      const { review_id, outcome, reviewed_by } = action.payload;
      return {
        ...state,
        probationReviews: state.probationReviews.map((r) =>
          r.review_id === review_id ? { ...r, status: "completed", outcome, reviewed_by } : r
        ),
      };
    }

    case "MOVE_CANDIDATE_STAGE": {
      const { candidate_id, stage } = action.payload;
      return { ...state, candidates: state.candidates.map((c) => (c.candidate_id === candidate_id ? { ...c, stage } : c)) };
    }

    default:
      return state;
  }
}

export function DataStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const value = useMemo(() => ({ db: state, dispatch }), [state]);
  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>;
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
