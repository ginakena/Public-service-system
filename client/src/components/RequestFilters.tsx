import { CATEGORIES, CATEGORY_LABELS, STATUSES, STATUS_LABELS, type Category, type Status } from "../lib/constants";
import { inputClasses } from "../lib/ui";

interface RequestFiltersProps {
  status: Status | "";
  category: Category | "";
  q: string;
  onChange: (patch: { status?: Status | ""; category?: Category | ""; q?: string }) => void;
  onClear: () => void;
}

export function RequestFilters({ status, category, q, onChange, onClear }: RequestFiltersProps) {
  const hasFilters = status !== "" || category !== "" || q !== "";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="search" className="mb-1 block text-xs font-medium text-slate-500">
          Search
        </label>
        <input
          id="search"
          type="search"
          placeholder="Reference, area or county"
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          className={inputClasses(false)}
        />
      </div>

      <div>
        <label htmlFor="status-filter" className="mb-1 block text-xs font-medium text-slate-500">
          Status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onChange({ status: e.target.value as Status | "" })}
          className={inputClasses(false)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category-filter" className="mb-1 block text-xs font-medium text-slate-500">
          Category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => onChange({ category: e.target.value as Category | "" })}
          className={inputClasses(false)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button type="button" onClick={onClear} className="pb-2 text-sm font-semibold text-brand-700 hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );
}