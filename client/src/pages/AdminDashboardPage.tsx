import { useEffect, useState } from "react";
import { Alert } from "../components/Alert";
import { PageLoader } from "../components/PageLoader";
import { Pagination } from "../components/Pagination";
import { RequestFilters } from "../components/RequestFilters";
import { RequestsTable } from "../components/RequestsTable";
import { StatsOverview } from "../components/StatsOverview";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { adminApi } from "../lib/adminApi";
import { errorMessage } from "../lib/api";
import type { Category, Status } from "../lib/constants";
import type { DashboardStats, PaginatedRequests } from "../types";

const PAGE_SIZE = 10;

interface Filters {
  status: Status | "";
  category: Category | "";
  q: string;
  page: number;
}

const initialFilters: Filters = { status: "", category: "", q: "", page: 1 };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState("");

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [result, setResult] = useState<{ key: string; data: PaginatedRequests } | null>(null);
  const [listError, setListError] = useState("");

  const debouncedQ = useDebouncedValue(filters.q.trim());
  const queryKey = `${filters.status}|${filters.category}|${debouncedQ}|${filters.page}`;

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((err) => setStatsError(errorMessage(err, "Could not load statistics")));
  }, []);

  useEffect(() => {
    let cancelled = false;

    adminApi
      .listRequests({
        status: filters.status,
        category: filters.category,
        q: debouncedQ,
        page: filters.page,
        limit: PAGE_SIZE,
      })
      .then((data) => {
        if (cancelled) return;
        setResult({ key: queryKey, data });
        setListError("");
      })
      .catch((err) => {
        if (!cancelled) setListError(errorMessage(err, "Could not load requests"));
      });

    return () => {
      cancelled = true;
    };
  }, [queryKey, filters.status, filters.category, filters.page, debouncedQ]);

  // Loading whenever the data on screen is for a different query than the one requested
  const listLoading = result?.key !== queryKey && !listError;

  const updateFilters = (patch: Partial<Omit<Filters, "page">>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 })); // any filter change goes back to page 1

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }));

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-slate-600">An overview of citizen service requests.</p>
      </div>

      {statsError ? <Alert message={statsError} /> : stats ? <StatsOverview stats={stats} /> : <PageLoader />}

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">All requests</h2>

        <RequestFilters
          status={filters.status}
          category={filters.category}
          q={filters.q}
          onChange={updateFilters}
          onClear={() => setFilters(initialFilters)}
        />

        {listError ? (
          <Alert message={listError} />
        ) : !result ? (
          <PageLoader />
        ) : result.data.requests.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No requests match your filters.</p>
        ) : (
          <div className={listLoading ? "opacity-60 transition-opacity" : "transition-opacity"}>
            <RequestsTable requests={result.data.requests} />
          </div>
        )}

        {result && <Pagination pagination={result.data.pagination} onPageChange={setPage} />}
      </section>
    </div>
  );
}