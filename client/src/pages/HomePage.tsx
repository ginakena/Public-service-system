import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { homePathFor } from "../lib/routes";
import { buttonStyles } from "../lib/ui";

const steps = [
  { title: "Report", text: "Tell us the category, where it is, and what is wrong. Add a photo if you have one." },
  { title: "Track", text: "Follow your request from Pending to In Progress with a clear status timeline." },
  { title: "Resolved", text: "Get the outcome once the responsible team has fixed the issue." },
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <section className="bg-brand-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            Report public service issues and follow them to resolution
          </h1>
          <p className="mt-4 max-w-xl text-brand-100">
            Broken streetlights, water problems, uncollected garbage. Report them in minutes and get updates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link to={homePathFor(user.role)} className={buttonStyles.light}>
                Go to your dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className={buttonStyles.light}>
                  Create an account
                </Link>
                <Link to="/login" className={buttonStyles.outlineLight}>
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}