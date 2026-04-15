import { GstSettingsForm } from '../../../../components/gst/gst-settings-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstSettingsPage() {
  return (
    <GstShell title="GST Settings">
      <GstSettingsForm />
    </GstShell>
  )
}
