import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { PageLoader } from "../components/PageLoader";
import { StatusBadge } from "../components/StatusBadge";
import { StatusProgress } from "../components/StatusProgress";
import { StatusTimeline } from "../components/StatusTimeline";
import { ApiError } from "../lib/api";
import { CATEGORY_LABELS } from "../lib/constants";
import { formatDateTime } from "../lib/format";
import { requestsApi } from "../lib/requestsApi";
import type { ServiceRequest } from "../types";

export default function RequestDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const justCreated = Boolean((location.state as { justCreated?: boolean } | null)?.justCreated);

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    requestsApi
      .get(id)
      .then((res) => {
        if (!cancelled) setRequest(res.request);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load this request");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/dashboard" className="text-sm font-medium text-brand-700 hover:underline">
        ← My requests
      </Link>

      {error ? (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      ) : !request ? (
        <PageLoader />
      ) : (
        <div className="mt-4 space-y-6">
          {justCreated && (
            <div role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Your request has been submitted. Keep your reference number: <strong>{request.refNo}</strong>
            </div>
          )}

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{request.refNo}</p>
                <h1 className="mt-0.5 text-2xl font-bold">{CATEGORY_LABELS[request.category]}</h1>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="mt-6">
              <StatusProgress status={request.status} />
            </div>

            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-medium text-slate-500">Location</dt>
                <dd className="mt-0.5 text-slate-900">
                  {request.location.area}, {request.location.county}
                  {request.location.address && <span className="block text-slate-600">{request.location.address}</span>}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-500">Submitted</dt>
                <dd className="mt-0.5 text-slate-900">{formatDateTime(request.createdAt)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <h2 className="text-sm font-medium text-slate-500">Description</h2>
              <p className="mt-1 whitespace-pre-line text-slate-900">{request.description}</p>
            </div>

            {request.imageUrl && (
              <img
                src={request.imageUrl}
                alt={`Photo attached to request ${request.refNo}`}
                loading="lazy"
                className="mt-6 max-h-96 w-full rounded-lg border border-slate-200 object-contain"
              />
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Status history</h2>
            <StatusTimeline history={request.history} />
          </section>
        </div>
      )}
    </div>
  );
}