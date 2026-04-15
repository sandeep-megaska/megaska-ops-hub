import Link from 'next/link'
import { GstShell } from '@/components/gst/gst-shell'

export default function GstAdminPage() {
  return (
    <GstShell title="GST Test Console">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          This GST console is isolated for test-store validation. It does not attach
          GST generation to checkout, order creation, or refunds automatically.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/admin/gst/settings" className="rounded-2xl border p-4">
            <div className="font-semibold">Settings</div>
            <div className="mt-1 text-sm text-gray-600">Create the first GST settings record.</div>
          </Link>

          <Link href="/admin/gst/invoice-preview" className="rounded-2xl border p-4">
            <div className="font-semibold">Invoice Preview</div>
            <div className="mt-1 text-sm text-gray-600">Test draft invoice logic using payloads.</div>
          </Link>

          <Link href="/admin/gst/note-preview" className="rounded-2xl border p-4">
            <div className="font-semibold">Note Preview</div>
            <div className="mt-1 text-sm text-gray-600">Test draft note logic in isolation.</div>
          </Link>

          <Link href="/admin/gst/reconcile" className="rounded-2xl border p-4">
            <div className="font-semibold">Reconcile</div>
            <div className="mt-1 text-sm text-gray-600">Run debug reconciliation safely.</div>
          </Link>
        </div>
      </div>
    </GstShell>
  )
}
