import { GstProductsAdmin } from '../../../../components/gst/gst-products-admin'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstProductsPage() {
  return (
    <GstShell title="GST Products" subtitle="Manage HSN codes, tax slabs, and product tax mappings.">
      <GstProductsAdmin />
    </GstShell>
  )
}
