import { GstReconcileForm } from '../../../../components/gst/gst-reconcile-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstReconcilePage() {
  return (
    <GstShell title="Reconcile" subtitle="Run reconciliation preview and persist runs with summaries.">
      <GstReconcileForm />
    </GstShell>
  )
}
