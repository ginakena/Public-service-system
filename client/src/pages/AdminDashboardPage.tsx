import { useEffect, useState } from "react";
import { Alert } from "../components/Alert";
import { PageLoader } from "../components/PageLoader";
import { StatsOverview } from "../components/StatsOverview";
import { adminApi } from "../lib/adminApi";
import { errorMessage } from "../lib/api";
import type { DashboardStats } from "../types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((err) => setError(errorMessage(err, "Could not load statistics")));
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-slate-600">An overview of citizen service requests.</p>
      </div>

      {error ? <Alert message={error} /> : stats ? <StatsOverview stats={stats} /> : <PageLoader />}
    </div>
  );
}