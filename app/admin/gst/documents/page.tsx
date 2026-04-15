import { GstDocumentViewer } from '../../../../components/gst/gst-document-viewer'
import { GstShell } from '../../../../components/gst/gst-shell'

export default function GstDocumentViewerPage() {
  return (
    <GstShell title="GST Document Viewer">
      <GstDocumentViewer />
    </GstShell>
  )
}
