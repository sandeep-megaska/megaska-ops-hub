import { GstProductsAdmin } from '../../../../components/gst/gst-products-admin'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstProductsPage() {
  return (
    <GstShell title="GST Products" subtitle="SKU-first HSN operations: maintain masters, resolve unmapped SKUs, and bulk apply mappings.">
      <GstProductsAdmin />
    </GstShell>
  )
}
