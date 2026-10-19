import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { PageLoader } from "../components/PageLoader";
import { RequestDetails } from "../components/RequestDetails";
import { StatusTimeline } from "../components/StatusTimeline";
import { StatusUpdateForm } from "../components/StatusUpdateForm";
import { errorMessage } from "../lib/api";
import { requestsApi } from "../lib/requestsApi";
import type { ServiceRequest } from "../types";

export default function AdminRequestPage() {
  const { id } = useParams();
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
        if (!cancelled) setError(errorMessage(err, "Could not load this request"));
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const citizen = request && typeof request.citizen === "object" ? request.citizen : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/admin" className="text-sm font-medium text-brand-700 hover:underline">
        ← Dashboard
      </Link>

      {error ? (
        <div className="mt-4">
          <Alert message={error} />
        </div>
      ) : !request ? (
        <PageLoader />
      ) : (
        <div className="mt-4 space-y-6">
          <RequestDetails request={request} />

          {citizen && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-semibold">Citizen</h2>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Name</dt>
                  <dd className="mt-0.5">{citizen.name}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">National ID</dt>
                  <dd className="mt-0.5">{citizen.nationalId ?? "-"}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Email</dt>
                  <dd className="mt-0.5">
                    <a href={`mailto:${citizen.email}`} className="text-brand-700 hover:underline">
                      {citizen.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${citizen.phone}`} className="text-brand-700 hover:underline">
                      {citizen.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </section>
          )}

          <StatusUpdateForm request={request} onUpdated={setRequest} />

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Status history</h2>
            <StatusTimeline history={request.history} showActor />
          </section>
        </div>
      )}
    </div>
  );
}