import Link from 'next/link'
import { GstShell } from '../../../components/gst/gst-shell'

export default function GstAdminPage() {
  return (
    <GstShell title="GST Test Console">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          This GST console is isolated for test-store validation. It does not attach GST
          generation to checkout, order creation, or refunds automatically.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/gst/settings" className="rounded-2xl border p-4">
            <div className="font-semibold">Settings</div>
            <div className="mt-1 text-sm text-gray-600">Create and update GST settings.</div>
          </Link>

          <Link href="/admin/gst/invoice-preview" className="rounded-2xl border p-4">
            <div className="font-semibold">Invoice Preview</div>
            <div className="mt-1 text-sm text-gray-600">Test invoice draft payloads.</div>
          </Link>

          <Link href="/admin/gst/note-preview" className="rounded-2xl border p-4">
            <div className="font-semibold">Note Preview</div>
            <div className="mt-1 text-sm text-gray-600">Test credit/debit note payloads.</div>
          </Link>

          <Link href="/admin/gst/reconcile" className="rounded-2xl border p-4">
            <div className="font-semibold">Reconcile</div>
            <div className="mt-1 text-sm text-gray-600">Run debug + persisted reconciliation.</div>
          </Link>

          <Link href="/admin/gst/documents" className="rounded-2xl border p-4">
            <div className="font-semibold">Document Viewer</div>
            <div className="mt-1 text-sm text-gray-600">Fetch invoice/note and PDF payload.</div>
          </Link>

          <Link href="/admin/gst/exports" className="rounded-2xl border p-4">
            <div className="font-semibold">Exports</div>
            <div className="mt-1 text-sm text-gray-600">Run and inspect GST export batches.</div>
          </Link>
        </div>
      </div>
    </GstShell>
  )
}
