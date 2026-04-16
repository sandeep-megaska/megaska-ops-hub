'use client'

import { useMemo, useState } from 'react'
import { getDocumentById, getPdfPayload, listDocuments } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

type DocumentRow = Record<string, unknown>

function badgeClasses(value: string) {
  const normalized = value.toUpperCase()

  if (normalized === 'DRAFT') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (normalized === 'FINALIZED' || normalized === 'ISSUED') {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
  if (normalized === 'CANCELLED' || normalized === 'VOID') {
    return 'bg-red-100 text-red-800 border-red-200'
  }
  if (normalized === 'TAX_INVOICE') return 'bg-blue-100 text-blue-800 border-blue-200'
  if (normalized === 'CREDIT_NOTE') return 'bg-violet-100 text-violet-800 border-violet-200'
  if (normalized === 'DEBIT_NOTE') return 'bg-orange-100 text-orange-800 border-orange-200'

  return 'bg-gray-100 text-gray-700 border-gray-200'
}

function Pill({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClasses(
        value
      )}`}
    >
      {value.replaceAll('_', ' ')}
    </span>
  )
}

function formatDate(value: unknown) {
  const raw = String(value || '')
  return raw ? raw.slice(0, 10) : '—'
}

function formatMoney(value: unknown) {
  if (value == null || value === '') return '—'
  return `₹ ${String(value)}`
}

export function GstDocumentViewer() {
  const [search, setSearch] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [status, setStatus] = useState('')
  const [documents, setDocuments] = useState<DocumentRow[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function runList() {
    setLoading(true)
    setError(undefined)
    const res = await listDocuments({
      documentType: documentType || undefined,
      status: status || undefined,
      search: search || undefined,
    })
    if (res.ok) {
      const rows = (res.data as { documents?: DocumentRow[] })?.documents || []
      setDocuments(rows)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function loadDetail(id: string) {
    setSelectedId(id)
    setLoading(true)
    setError(undefined)
    const res = await getDocumentById(id)
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  async function loadPdf(id: string) {
    setSelectedId(id)
    setLoading(true)
    setError(undefined)
    const res = await getPdfPayload(id)
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  const hasRows = documents.length > 0

  const stats = useMemo(() => {
    const total = documents.length
    const drafts = documents.filter((doc) => String(doc.status || '') === 'DRAFT').length
    const invoices = documents.filter((doc) => String(doc.documentType || '') === 'TAX_INVOICE').length
    const notes = documents.filter((doc) =>
      ['CREDIT_NOTE', 'DEBIT_NOTE'].includes(String(doc.documentType || ''))
    ).length

    return { total, drafts, invoices, notes }
  }, [documents])

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">GST Documents</h2>
              <p className="mt-1 text-sm text-gray-500">
                Search, filter, and inspect GST invoices and notes without exposing mutable internal
                data in editable fields.
              </p>
            </div>

            <button
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60"
              onClick={() => void runList()}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Search</div>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                placeholder="Number / order / reference"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Document Type</div>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="TAX_INVOICE">Tax Invoice</option>
                <option value="CREDIT_NOTE">Credit Note</option>
                <option value="DEBIT_NOTE">Debit Note</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Status</div>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="FINALIZED">Finalized</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="VOID">Void</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Total</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{stats.total}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Drafts</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{stats.drafts}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Invoices</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{stats.invoices}</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Notes</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{stats.notes}</div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Document List</h3>
          </div>

          {!hasRows ? (
            <div className="p-8 text-center">
              <div className="mx-auto max-w-md">
                <div className="text-base font-semibold text-gray-900">No documents loaded yet</div>
                <p className="mt-2 text-sm text-gray-500">
                  Refresh the list to fetch available GST documents. Use filters to narrow results by
                  type or status.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Number</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const id = String(doc.id || '')
                    const type = String(doc.documentType || '')
                    const state = String(doc.status || '')
                    return (
                      <tr key={id} className="border-t border-gray-100">
                        <td className="px-4 py-3">
                          {type ? <Pill value={type} /> : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {String(doc.documentNumber || '—')}
                        </td>
                        <td className="px-4 py-3">
                          {state ? <Pill value={state} /> : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(doc.documentDate)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatMoney(doc.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                              onClick={() => void loadDetail(id)}
                            >
                              Detail
                            </button>
                            <button
                              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                              onClick={() => void loadPdf(id)}
                            >
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <GstResponseViewer
        title={selectedId ? `Document Response (${selectedId})` : 'Document Response'}
        data={result}
        error={error}
      />
    </div>
  )
}
