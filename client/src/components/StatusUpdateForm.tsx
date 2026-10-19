import { useState, type FormEvent } from "react";
import { adminApi } from "../lib/adminApi";
import { errorMessage } from "../lib/api";
import { NEXT_STATUS, STATUS_LABELS } from "../lib/constants";
import type { ServiceRequest } from "../types";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { TextAreaField } from "./TextAreaField";

interface StatusUpdateFormProps {
  request: ServiceRequest;
  onUpdated: (request: ServiceRequest) => void;
}

export function StatusUpdateForm({ request, onUpdated }: StatusUpdateFormProps) {
  const next = NEXT_STATUS[request.status][0]; // forward-only, so there is at most one next step
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!next) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        This request is resolved. No further changes are possible.
      </section>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (next === "resolved" && !window.confirm("Mark this request as resolved? This cannot be undone.")) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await adminApi.updateStatus(request._id, next, note.trim() || undefined);
      setNote("");
      onUpdated(res.request);
    } catch (err) {
      setError(errorMessage(err, "Could not update the status"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold">Update status</h2>
      <p className="mt-1 text-sm text-slate-600">
        Currently <strong>{STATUS_LABELS[request.status]}</strong>. The next step is{" "}
        <strong>{STATUS_LABELS[next]}</strong>.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {error && <Alert message={error} />}
        <TextAreaField
          label="Note for the citizen (optional)"
          name="note"
          maxLength={500}
          placeholder="e.g. A technician has been assigned and will visit on Friday."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit" loading={submitting}>
          Mark as {STATUS_LABELS[next].toLowerCase()}
        </Button>
      </form>
    </section>
  );
}