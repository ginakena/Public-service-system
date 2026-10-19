import { STATUS_LABELS, type Status } from "../lib/constants";

const styles: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  in_progress: "bg-blue-100 text-blue-800 ring-blue-200",
  resolved: "bg-green-100 text-green-800 ring-green-200",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}