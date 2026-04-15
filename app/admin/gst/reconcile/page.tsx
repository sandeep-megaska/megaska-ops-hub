import { GstReconcileForm } from '../../../../components/gst/gst-reconcile-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstReconcilePage() {
  return (
    <GstShell title="Reconciliation Debug">
      <GstReconcileForm />
    </GstShell>
  )
}
