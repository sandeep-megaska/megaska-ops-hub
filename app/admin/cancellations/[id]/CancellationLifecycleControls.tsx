"use client";

import { useState } from "react";

type Props = {
  requestId: string;
  currentStatus: string;
  allowedTransitions: string[];
  currentAdminNote: string;
  shopDomain?: string;
};

export default function CancellationLifecycleControls({
  requestId,
  currentStatus,
  allowedTransitions,
  currentAdminNote,
  shopDomain,
}: Props) {
  const [nextStatus, setNextStatus] = useState(allowedTransitions[0] || currentStatus);
  const [adminNote, setAdminNote] = useState(currentAdminNote);
  const [message, setMessage] = useState("");

  function getHeaders() {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (shopDomain) headers["x-shopify-shop-domain"] = shopDomain;
    return headers;
  }

  async function updateStatus() {
    const response = await fetch(`/api/admin/cancellation-requests/${requestId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ nextStatus, adminNote }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data?.error || "Failed to update status");
      return;
    }

    setMessage(`Status updated to ${data?.request?.status || nextStatus}. Refresh to view latest values.`);
  }

  async function saveNote() {
    const response = await fetch(`/api/admin/cancellation-requests/${requestId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ adminNote }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data?.error || "Failed to save admin note");
      return;
    }

    setMessage(data?.message || "Admin note saved. Refresh to view latest values.");
  }

  const fieldClassName = "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500";
  const labelClassName = "text-sm font-medium text-slate-700";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Lifecycle Action Controls</h3>

      <div className="mt-4 grid max-w-xl gap-3">
        <label className={labelClassName}>
          Current Status
          <input value={currentStatus} disabled className={fieldClassName} />
        </label>

        <label className={labelClassName}>
          Next Status
          <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className={fieldClassName}>
            {(allowedTransitions.length ? allowedTransitions : [currentStatus]).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={updateStatus}
          disabled={!allowedTransitions.length}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          Apply Status
        </button>
      </div>

      <hr className="my-5 border-slate-200" />
      <h4 className="text-base font-semibold text-slate-900">Internal Admin Note</h4>

      <div className="mt-3 grid max-w-xl gap-3">
        <label className={labelClassName}>
          Admin Note
          <textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} className={`${fieldClassName} min-h-28`} />
        </label>
        <button
          type="button"
          onClick={saveNote}
          className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Save Note
        </button>
      </div>
      {message ? <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{message}</p> : null}
    </section>
  );
}
