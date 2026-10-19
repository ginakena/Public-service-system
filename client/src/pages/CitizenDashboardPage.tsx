import { useAuth } from "../hooks/useAuth";

export default function CitizenDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Your requests will appear here.
      </div>
    </div>
  );
}