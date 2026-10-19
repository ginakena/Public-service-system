import { useState, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, name, error, hint, type, ...inputProps }: FormFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 ${
            isPassword ? "pr-16" : ""
          } ${error ? "border-red-500" : "border-slate-300"}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-slate-500 hover:text-brand-700 focus:outline-none focus-visible:text-brand-700"
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}