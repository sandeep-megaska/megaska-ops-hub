import { GstShell } from '@/components/gst/gst-shell'
import { GstSettingsForm } from '@/components/gst/gst-settings-form'

export default function GstSettingsPage() {
  return (
    <GstShell title="GST Settings">
      <GstSettingsForm />
    </GstShell>
  )
}
