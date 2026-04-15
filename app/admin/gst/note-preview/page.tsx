import { GstNotePreviewForm } from '../../../../components/gst/gst-note-preview-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstNotePreviewPage() {
  return (
    <GstShell title="Note Preview">
      <GstNotePreviewForm />
    </GstShell>
  )
}
