import { Link } from "react-router-dom";
import { buttonStyles } from "../lib/ui";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">page not found</p>
      <Link to="/" className={`${buttonStyles.primary} mt-6`}>
        Back to home
      </Link>
    </div>
  );
}