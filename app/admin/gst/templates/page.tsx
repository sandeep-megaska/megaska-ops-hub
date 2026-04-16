import { GstTemplatesAdmin } from '../../../../components/gst/gst-templates-admin'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstTemplatesPage() {
  return (
    <GstShell title="GST Templates" subtitle="Manage invoice templates, defaults, and previews.">
      <GstTemplatesAdmin />
    </GstShell>
  )
}
