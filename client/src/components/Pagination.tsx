import type { Pagination as PaginationInfo } from "../types";
import { Button } from "./Button";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
      <p>
        {total} request{total === 1 ? "" : "s"} · Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}