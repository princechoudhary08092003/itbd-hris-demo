import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";

import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";

import ApplyLeave from "./pages/leave/ApplyLeave";
import LeaveDetails from "./pages/leave/LeaveDetails";
import LeaveApprovals from "./pages/leave/LeaveApprovals";
import LeaveReports from "./pages/leave/LeaveReports";

import AttendanceHome from "./pages/attendance/AttendanceHome";
import CompOff from "./pages/attendance/CompOff";
import ShiftSwap from "./pages/attendance/ShiftSwap";
import BulkApprovals from "./pages/attendance/BulkApprovals";
import AssignRoster from "./pages/attendance/AssignRoster";
import BulkShiftUpload from "./pages/attendance/BulkShiftUpload";
import AttendanceExport from "./pages/attendance/AttendanceExport";

import Transfers from "./pages/hris/Transfers";
import OrgChart from "./pages/hris/OrgChart";
import Directory from "./pages/hris/Directory";
import Letters from "./pages/hris/Letters";
import PolicyHub from "./pages/hris/PolicyHub";
import Promotion from "./pages/hris/Promotion";
import HrisReports from "./pages/hris/Reports";

import Onboarding from "./pages/onboarding/Onboarding";

import Resignation from "./pages/exit/Resignation";
import ProxyResignation from "./pages/exit/ProxyResignation";
import ExitChecklist from "./pages/exit/ExitChecklist";
import Rehire from "./pages/exit/Rehire";

import Referrals from "./pages/recruitment/Referrals";
import OpenPositions from "./pages/recruitment/OpenPositions";
import TAManagement from "./pages/recruitment/TAManagement";

import HRCases from "./pages/admin/HRCases";
import BulkOps from "./pages/admin/BulkOps";
import Assets from "./pages/admin/Assets";
import DocumentExpiry from "./pages/admin/DocumentExpiry";
import SystemReports from "./pages/admin/SystemReports";
import CompanySetup from "./pages/admin/CompanySetup";
import PolicyConfig from "./pages/admin/PolicyConfig";
import RolesAdmin from "./pages/admin/Roles";
import AuditLog from "./pages/admin/AuditLog";

import Helpdesk from "./pages/helpdesk/Helpdesk";
import EmployeeProfile from "./pages/hris/EmployeeProfile";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<EmployeeDashboard />} />

        <Route path="/leave/apply" element={<ApplyLeave />} />
        <Route path="/leave/details" element={<LeaveDetails />} />
        <Route path="/leave/approvals" element={<LeaveApprovals />} />
        <Route path="/leave/reports" element={<LeaveReports />} />

        <Route path="/attendance" element={<AttendanceHome />} />
        <Route path="/attendance/comp-off" element={<CompOff />} />
        <Route path="/attendance/shift-swap" element={<ShiftSwap />} />
        <Route path="/attendance/bulk-approvals" element={<BulkApprovals />} />
        <Route path="/attendance/roster" element={<AssignRoster />} />
        <Route path="/attendance/bulk-upload" element={<BulkShiftUpload />} />
        <Route path="/attendance/export" element={<AttendanceExport />} />

        <Route path="/hris/transfers" element={<Transfers />} />
        <Route path="/hris/org-chart" element={<OrgChart />} />
        <Route path="/hris/directory" element={<Directory />} />
        <Route path="/hris/directory/:employmentId" element={<EmployeeProfile />} />
        <Route path="/hris/letters" element={<Letters />} />
        <Route path="/hris/policy-hub" element={<PolicyHub />} />
        <Route path="/hris/promotion" element={<Promotion />} />
        <Route path="/hris/reports" element={<HrisReports />} />

        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/exit/resignation" element={<Resignation />} />
        <Route path="/exit/proxy-resignation" element={<ProxyResignation />} />
        <Route path="/exit/checklist" element={<ExitChecklist />} />
        <Route path="/exit/rehire" element={<Rehire />} />

        <Route path="/recruitment/referrals" element={<Referrals />} />
        <Route path="/recruitment/open-positions" element={<OpenPositions />} />
        <Route path="/recruitment/ta" element={<TAManagement />} />

        <Route path="/admin/cases" element={<HRCases />} />
        <Route path="/admin/bulk-ops" element={<BulkOps />} />
        <Route path="/admin/assets" element={<Assets />} />
        <Route path="/admin/document-expiry" element={<DocumentExpiry />} />
        <Route path="/admin/reports" element={<SystemReports />} />
        <Route path="/admin/company" element={<CompanySetup />} />
        <Route path="/admin/policy-config" element={<PolicyConfig />} />
        <Route path="/admin/roles" element={<RolesAdmin />} />
        <Route path="/admin/audit-log" element={<AuditLog />} />

        <Route path="/helpdesk" element={<Helpdesk />} />
      </Route>
    </Routes>
  );
}
