'use client'

import { useState } from 'react'
import { getDocumentById, getPdfPayload, listDocuments } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstDocumentViewer() {
  const [search, setSearch] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [status, setStatus] = useState('')
  const [documents, setDocuments] = useState<Array<Record<string, unknown>>>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function runList() {
    setError(undefined)
    const res = await listDocuments({ documentType: documentType || undefined, status: status || undefined, search: search || undefined })
    if (res.ok) {
      const rows = (res.data as { documents?: Array<Record<string, unknown>> })?.documents || []
      setDocuments(rows)
    } else setError(res.error)
  }

  async function loadDetail(id: string) {
    setSelectedId(id)
    const res = await getDocumentById(id)
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  async function loadPdf(id: string) {
    setSelectedId(id)
    const res = await getPdfPayload(id)
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">GST Documents</h2>
      <p className="text-sm text-gray-600">List documents by type/status and open details without exposing mutable internal identifiers as editable form fields.</p>

      <div className="grid gap-3 md:grid-cols-4">
        <input className="rounded-lg border px-3 py-2" placeholder="Search number/order/reference" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-lg border px-3 py-2" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          <option value="">All Types</option><option value="TAX_INVOICE">Tax Invoice</option><option value="CREDIT_NOTE">Credit Note</option><option value="DEBIT_NOTE">Debit Note</option>
        </select>
        <input className="rounded-lg border px-3 py-2" placeholder="Status (DRAFT/ISSUED...)" value={status} onChange={(e) => setStatus(e.target.value)} />
        <button className="rounded-lg bg-black px-4 py-2 text-white" onClick={() => void runList()}>Refresh List</button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-2 text-left">Type</th><th className="p-2 text-left">Number</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Total</th><th className="p-2 text-left">Actions</th></tr></thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={String(doc.id)} className="border-t">
                <td className="p-2">{String(doc.documentType || '')}</td>
                <td className="p-2">{String(doc.documentNumber || '')}</td>
                <td className="p-2">{String(doc.status || '')}</td>
                <td className="p-2">{String(doc.documentDate || '').slice(0, 10)}</td>
                <td className="p-2">{String(doc.totalAmount || '')}</td>
                <td className="p-2 space-x-2">
                  <button className="rounded border px-2 py-1" onClick={() => void loadDetail(String(doc.id))}>Detail</button>
                  <button className="rounded border px-2 py-1" onClick={() => void loadPdf(String(doc.id))}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GstResponseViewer title={selectedId ? `Document Response (${selectedId})` : 'Document Response'} data={result} error={error} />
    </div>
  )
}
