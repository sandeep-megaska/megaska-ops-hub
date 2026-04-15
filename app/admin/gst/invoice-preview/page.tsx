import { GstShell } from '@/components/gst/gst-shell'
import { GstInvoicePreviewForm } from '@/components/gst/gst-invoice-preview-form'

export default function GstInvoicePreviewPage() {
  return (
    <GstShell title="Invoice Preview">
      <GstInvoicePreviewForm />
    </GstShell>
  )
}
