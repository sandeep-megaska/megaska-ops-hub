'use client'

import { useState } from 'react'
import { getInvoiceById, getNoteById, getPdfPayload } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstDocumentViewer() {
  const [id, setId] = useState('')
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function fetchDoc(kind: 'invoice' | 'note' | 'pdf') {
    setError(undefined)
    const cleaned = id.trim()
    if (!cleaned) {
      setError('Enter a GST document id')
      return
    }

    const res = kind === 'invoice' ? await getInvoiceById(cleaned) : kind === 'note' ? await getNoteById(cleaned) : await getPdfPayload(cleaned)
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <input className="w-full rounded-xl border px-3 py-2" value={id} onChange={(e) => setId(e.target.value)} placeholder="GST document id" />
        <div className="flex gap-2">
          <button className="rounded-xl border px-4 py-2" onClick={() => void fetchDoc('invoice')}>Fetch Invoice</button>
          <button className="rounded-xl border px-4 py-2" onClick={() => void fetchDoc('note')}>Fetch Note</button>
          <button className="rounded-xl border px-4 py-2" onClick={() => void fetchDoc('pdf')}>PDF Payload</button>
        </div>
      </div>
      <GstResponseViewer title="Document Response" data={result} error={error} />
    </div>
  )
}
