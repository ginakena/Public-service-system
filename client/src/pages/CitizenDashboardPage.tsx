import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { PageLoader } from "../components/PageLoader";
import { RequestCard } from "../components/RequestCard";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { requestsApi } from "../lib/requestsApi";
import { buttonStyles } from "../lib/ui";
import type { ServiceRequest } from "../types";

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await requestsApi.listMine();
      setRequests(res.requests);
      setError("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your requests");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = () => {
    setError("");
    setRequests(null);
    void load();
  };

  const resolved = requests?.filter((r) => r.status === "resolved").length ?? 0;
  const total = requests?.length ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My requests</h1>
          <p className="text-sm text-slate-600">Welcome back, {user?.name}</p>
        </div>
        <Link to="/requests/new" className={buttonStyles.primary}>
          Report an issue
        </Link>
      </div>

      {error ? (
        <div className="mt-6 space-y-3">
          <Alert message={error} />
          <Button variant="secondary" onClick={retry}>
            Try again
          </Button>
        </div>
      ) : requests === null ? (
        <PageLoader />
      ) : requests.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="font-semibold">No requests yet</h2>
          <p className="mt-1 text-sm text-slate-600">Report a streetlight, water or garbage issue to get started.</p>
          <Link to="/requests/new" className={`${buttonStyles.primary} mt-4`}>
            Report an issue
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
            <StatChip label="Total" value={total} />
            <StatChip label="Open" value={total - resolved} />
            <StatChip label="Resolved" value={resolved} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {requests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}