import type { ReactNode } from "react";
import heroImage from "../images/hero.jpg";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid lg:min-h-[calc(100vh-8rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center bg-white px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-center text-3xl font-bold text-brand-800">{title}</h1>
          <p className="mt-1 text-center text-sm text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      <div className="relative hidden bg-brand-800 lg:block">
        <img
        src={heroImage}
        alt="Community service"
        className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/30 bg-black/35 p-6 text-white backdrop-blur-sm">
          <p className="text-xl font-semibold leading-snug">
            Report issues in your community and watch them get resolved
          </p>
        </div>
      </div>
    </div>
  );
}