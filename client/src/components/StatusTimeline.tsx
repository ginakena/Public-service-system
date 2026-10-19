import { formatDateTime } from "../lib/format";
import type { HistoryEntry } from "../types";
import { StatusBadge } from "./StatusBadge";

export function StatusTimeline({ history }: { history: HistoryEntry[] }) {
  const entries = [...history].reverse(); // newest first

  return (
    <ol className="space-y-5 border-l-2 border-slate-200 pl-5">
      {entries.map((entry, i) => (
        <li key={`${entry.at}-${entry.status}`} className="relative">
          <span
            className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${
              i === 0 ? "bg-brand-700" : "bg-slate-300"
            }`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={entry.status} />
            <time dateTime={entry.at} className="text-xs text-slate-500">
              {formatDateTime(entry.at)}
            </time>
          </div>
          {entry.note && <p className="mt-1 text-sm text-slate-700">{entry.note}</p>}
        </li>
      ))}
    </ol>
  );
}