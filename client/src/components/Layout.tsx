import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homePathFor } from "../lib/routes";
import { buttonStyles } from "../lib/ui";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold text-brand-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-700 text-sm text-white">PS</span>
            <span className="hidden sm:inline">Public Service Requests</span>
          </Link>

          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Link to={homePathFor(user.role)} className="px-2 text-sm font-medium text-slate-700 hover:text-brand-700">
                  {user.role === "admin" ? "Admin dashboard" : "My requests"}
                </Link>
                {/* <span className="hidden text-sm text-slate-500 md:inline">{user.name}</span> */}
                <button onClick={handleLogout} className={buttonStyles.secondary}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2 text-sm font-medium text-slate-700 hover:text-brand-700">
                  Log in
                </Link>
                <Link to="/register" className={buttonStyles.primary}>
                  Create account
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Public Service Request System
      </footer>
    </div>
  );
}