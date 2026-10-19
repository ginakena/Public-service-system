import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../lib/constants";
import { formatDate } from "../lib/format";
import type { ServiceRequest } from "../types";
import { StatusBadge } from "./StatusBadge";

export function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <Link
      to={`/requests/${request._id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-600 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{request.refNo}</p>
          <h3 className="mt-0.5 font-semibold text-slate-900">{CATEGORY_LABELS[request.category]}</h3>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{request.description}</p>
      <p className="mt-3 text-xs text-slate-500">
        {request.location.area}, {request.location.county} · {formatDate(request.createdAt)}
      </p>
    </Link>
  );
}