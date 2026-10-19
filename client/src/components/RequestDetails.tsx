import { CATEGORY_LABELS } from "../lib/constants";
import { formatDateTime } from "../lib/format";
import type { ServiceRequest } from "../types";
import { StatusBadge } from "./StatusBadge";
import { StatusProgress } from "./StatusProgress";

export function RequestDetails({ request }: { request: ServiceRequest }) {
  return (
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
  );
}