import { GstShell } from '@/components/gst/gst-shell'
import { GstReconcileForm } from '@/components/gst/gst-reconcile-form'

export default function GstReconcilePage() {
  return (
    <GstShell title="Reconciliation Debug">
      <GstReconcileForm />
    </GstShell>
  )
}
