import { GstNotePreviewForm } from '../../../../components/gst/gst-note-preview-form'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstNotePreviewPage() {
  return (
    <GstShell title="Notes Operations" subtitle="Preview and create credit/debit note drafts with backend numbering.">
      <GstNotePreviewForm />
    </GstShell>
  )
}
