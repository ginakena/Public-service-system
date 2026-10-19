import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homePathFor } from "../lib/routes";
import type { Role } from "../types";
import { Spinner } from "./Spinner";

function PageLoader() {
  return (
    <div className="flex justify-center py-24 text-brand-700">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

// Requires a logged-in user
export function ProtectedRoute({ roles }: { roles?: Role[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

// For login and register: logged-in users go straight to their dashboard
export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={homePathFor(user.role)} replace />;
  return <Outlet />;
}