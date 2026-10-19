import type { TextareaHTMLAttributes } from "react";
import { inputClasses } from "../lib/ui";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  value: string;
  maxLength: number;
  error?: string;
}

export function TextAreaField({ label, name, value, maxLength, error, ...textareaProps }: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        maxLength={maxLength}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClasses(Boolean(error))}
        {...textareaProps}
      />
      <div className="mt-1 flex justify-between gap-2">
        {error ? (
          <p id={`${name}-error`} className="text-sm text-red-600">
            {error}
          </p>
        ) : (
          <span />
        )}
        <span className="text-xs text-slate-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}