import { GstInvoicePreviewForm } from '../../../../components/gst/gst-invoice-preview-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstInvoicePreviewPage() {
  return (
    <GstShell title="Invoice Operations" subtitle="Preview tax calculation and create draft invoices with reserved numbers.">
      <GstInvoicePreviewForm />
    </GstShell>
  )
}
