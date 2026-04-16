import { GstOrdersAdmin } from '../../../../components/gst/gst-orders-admin'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstOrdersPage() {
  return (
    <GstShell title="GST Orders" subtitle="Review imported GST order readiness and import states.">
      <GstOrdersAdmin />
    </GstShell>
  )
}
