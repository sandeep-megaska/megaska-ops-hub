import { GstExportRunner } from '../../../../components/gst/gst-export-runner'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstExportPage() {
  return (
    <GstShell title="Exports" subtitle="Generate exports and inspect historical export batches.">
      <GstExportRunner />
    </GstShell>
  )
}
