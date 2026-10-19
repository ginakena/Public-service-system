const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const buttonStyles = {
  primary: `${base} bg-brand-700 text-white hover:bg-brand-800`,
  secondary: `${base} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`,
  light: `${base} bg-white text-brand-800 hover:bg-brand-50`,
  outlineLight: `${base} border border-white/40 text-white hover:bg-white/10`,
};