import { STATUSES, STATUS_LABELS, type Status } from "../lib/constants";

export function StatusProgress({ status }: { status: Status }) {
  const current = STATUSES.indexOf(status);

  return (
    <ol className="flex items-center" aria-label="Request progress">
      {STATUSES.map((s, i) => {
        const reached = i <= current;
        return (
          <li
            key={s}
            className="flex flex-1 items-center last:flex-none"
            aria-current={i === current ? "step" : undefined}
          >
            <div className="flex flex-col items-center gap-1">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  reached ? "bg-brand-700 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {reached ? "✓" : i + 1}
              </span>
              <span className={`text-xs font-medium ${reached ? "text-brand-800" : "text-slate-500"}`}>
                {STATUS_LABELS[s]}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <div className={`mx-2 mb-5 h-0.5 flex-1 ${i < current ? "bg-brand-700" : "bg-slate-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}