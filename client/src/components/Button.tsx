import type { ButtonHTMLAttributes } from "react";
import { buttonStyles } from "../lib/ui";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({ variant = "primary", loading = false, disabled, children, className = "", ...rest }: ButtonProps) {
  return (
    <button className={`${buttonStyles[variant]} ${className}`} disabled={disabled || loading} {...rest}>
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}