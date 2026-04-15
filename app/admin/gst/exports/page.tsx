import { GstExportRunner } from '../../../../components/gst/gst-export-runner'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstExportPage() {
  return (
    <GstShell title="GST Exports">
      <GstExportRunner />
    </GstShell>
  )
}
