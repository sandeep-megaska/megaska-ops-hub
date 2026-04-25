import { GstOrdersAdmin } from '../../../components/gst/gst-orders-admin'
import { GstShell } from '../../../components/gst/gst-shell'

export default function GstAdminPage() {
  return (
    <GstShell
      title="GST Operations"
      subtitle="Sync Shopify orders → Generate invoices → Print shipment copies → Export CA registers"
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Step 1</div>
          <div className="font-semibold">Sync Orders</div>
          <p className="text-sm text-gray-600">Pull Shopify orders by date range.</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Step 2</div>
          <div className="font-semibold">Generate GST Invoices</div>
          <p className="text-sm text-gray-600">Use batch generation for shipment-ready orders.</p>
        </div>
        <div className="rounded-xl border p-4">
          <div className="text-xs text-gray-500">Step 3</div>
          <div className="font-semibold">Print & Export</div>
          <p className="text-sm text-gray-600">Download invoice copies and CA CSV exports.</p>
        </div>
      </div>

      <GstOrdersAdmin />
    </GstShell>
  )
}
