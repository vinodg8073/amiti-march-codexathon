import { Navigate, Route, Routes } from "react-router-dom";
import WorkspacePage from "../pages/WorkspacePage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<WorkspacePage />} />
      <Route path="/signup" element={<WorkspacePage />} />
      <Route path="/forgot-password" element={<WorkspacePage />} />
      <Route path="/app/dashboard" element={<WorkspacePage />} />
      <Route path="/app/transactions" element={<WorkspacePage />} />
      <Route path="/app/budgets" element={<WorkspacePage />} />
      <Route path="/app/goals" element={<WorkspacePage />} />
      <Route path="/app/reports" element={<WorkspacePage />} />
      <Route path="/app/recurring" element={<WorkspacePage />} />
      <Route path="/app/accounts" element={<WorkspacePage />} />
      <Route path="/app/settings" element={<WorkspacePage />} />
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}
