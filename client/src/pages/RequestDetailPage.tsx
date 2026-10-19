import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Alert } from "../components/Alert";
import { PageLoader } from "../components/PageLoader";
import { RequestDetails } from "../components/RequestDetails";
import { StatusTimeline } from "../components/StatusTimeline";
import { errorMessage } from "../lib/api";
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
        if (!cancelled) setError(errorMessage(err, "Could not load this request"));
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
          <RequestDetails request={request} />
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Status history</h2>
            <StatusTimeline history={request.history} />
          </section>
        </div>
      )}
    </div>
  );
}