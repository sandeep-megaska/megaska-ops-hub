import { GstOrdersAdmin } from '../../../../components/gst/gst-orders-admin'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstOrdersPage() {
  return (
    <GstShell title="GST Orders" subtitle="Dispatch workflow: sync by date, review readiness, generate invoices, and print batches.">
      <GstOrdersAdmin />
    </GstShell>
  )
}
