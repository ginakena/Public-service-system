import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GuestRoute, ProtectedRoute } from "./components/RouteGuards";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CitizenDashboardPage from "./pages/CitizenDashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import RequestDetailPage from "./pages/RequestDetailPage";
import NewRequestPage from "./pages/NewRequestPage";
import AdminRequestPage from "./pages/AdminRequestPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["citizen"]} />}>
          <Route path="dashboard" element={<CitizenDashboardPage />} />
          <Route path="requests/new" element={<NewRequestPage />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/requests/:id" element={<AdminRequestPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}