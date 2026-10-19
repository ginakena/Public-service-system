import { Spinner } from "./Spinner";

export function PageLoader() {
  return (
    <div className="flex justify-center py-24 text-brand-700">
      <Spinner className="h-8 w-8" />
    </div>
  );
}