import { GstDocumentViewer } from '../../../../components/gst/gst-document-viewer'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstDocumentViewerPage() {
  return (
    <GstShell title="Documents" subtitle="List and inspect GST documents and PDF payloads.">
      <GstDocumentViewer />
    </GstShell>
  )
}
