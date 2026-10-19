import { Link } from "react-router-dom";
import { CATEGORY_LABELS } from "../lib/constants";
import { citizenName, formatDate } from "../lib/format";
import type { ServiceRequest } from "../types";
import { StatusBadge } from "./StatusBadge";

export function RequestsTable({ requests }: { requests: ServiceRequest[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Reference</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3">Location</th>
            <th scope="col" className="px-4 py-3">Citizen</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {requests.map((request) => (
            <tr key={request._id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3">
                <Link to={`/admin/requests/${request._id}`} className="font-semibold text-brand-700 hover:underline">
                  {request.refNo}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3">{CATEGORY_LABELS[request.category]}</td>
              <td className="px-4 py-3">
                {request.location.area}, {request.location.county}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{citizenName(request)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={request.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(request.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}