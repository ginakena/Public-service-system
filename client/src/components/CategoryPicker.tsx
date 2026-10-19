import { CATEGORIES, CATEGORY_LABELS, type Category } from "../lib/constants";

interface CategoryPickerProps {
  value: Category | "";
  onChange: (category: Category) => void;
  error?: string;
}

export function CategoryPicker({ value, onChange, error }: CategoryPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-slate-700">What is the problem about?</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <label
            key={category}
            className={`cursor-pointer rounded-lg border px-3 py-3 text-center text-sm font-medium transition focus-within:ring-2 focus-within:ring-brand-600 ${
              value === category
                ? "border-brand-600 bg-brand-50 text-brand-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name="category"
              value={category}
              checked={value === category}
              onChange={() => onChange(category)}
              className="sr-only"
            />
            {CATEGORY_LABELS[category]}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </fieldset>
  );
}