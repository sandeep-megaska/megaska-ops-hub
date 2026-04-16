'use client'

import { useMemo, useState } from 'react'

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function getSummary(data: any): Array<{ label: string; value: string }> {
  if (!data || typeof data !== 'object') return []

  const summary: Array<{ label: string; value: string }> = []

  if (data?.preview?.documentType) {
    summary.push({ label: 'Document Type', value: String(data.preview.documentType) })
  }
  if (data?.preview?.supplyType) {
    summary.push({ label: 'Supply Type', value: String(data.preview.supplyType) })
  }
  if (typeof data?.preview?.isInterstate === 'boolean') {
    summary.push({
      label: 'Supply Nature',
      value: data.preview.isInterstate ? 'Inter-state' : 'Intra-state',
    })
  }
  if (data?.preview?.totals?.totalAmount != null) {
    summary.push({
      label: 'Total Amount',
      value: `₹ ${String(data.preview.totals.totalAmount)}`,
    })
  }
  if (data?.preview?.totals?.taxableAmount != null) {
    summary.push({
      label: 'Taxable Amount',
      value: `₹ ${String(data.preview.totals.taxableAmount)}`,
    })
  }
  if (data?.data?.documentNumber) {
    summary.push({ label: 'Document Number', value: String(data.data.documentNumber) })
  }
  if (data?.documentNumber) {
    summary.push({ label: 'Document Number', value: String(data.documentNumber) })
  }
  if (data?.status) {
    summary.push({ label: 'Status', value: String(data.status) })
  }
  if (data?.settings?.gstin) {
    summary.push({ label: 'GSTIN', value: String(data.settings.gstin) })
  }
  if (data?.settings?.invoiceNumberStrategy) {
    summary.push({
      label: 'Numbering Strategy',
      value: String(data.settings.invoiceNumberStrategy),
    })
  }

  return summary
}

export function GstResponseViewer({
  title,
  data,
  error,
}: {
  title: string
  data?: unknown
  error?: string
}) {
  const [tab, setTab] = useState<'summary' | 'json'>('summary')
  const summary = useMemo(() => getSummary(data), [data])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Review API responses, validation output, and operational status.
          </p>
        </div>

        {(data || error) && (
          <div className="flex gap-2">
            <button
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === 'summary'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTab('summary')}
            >
              Summary
            </button>
            <button
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === 'json'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setTab('json')}
            >
              JSON
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                Failed
              </div>
              <div className="text-sm font-medium text-red-900">Request could not be completed</div>
            </div>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm text-red-800">{error}</p>
          </div>
        ) : null}

        {!error && data ? (
          <>
            {tab === 'summary' ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
                      Success
                    </div>
                    <div className="text-sm font-medium text-emerald-900">
                      Operation completed successfully
                    </div>
                  </div>
                </div>

                {summary.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {summary.map((item) => (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {item.label}
                        </div>
                        <div className="mt-2 text-sm font-semibold text-gray-900">{item.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                    Structured summary is not available for this response yet. Switch to JSON to inspect
                    the full payload.
                  </div>
                )}

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-gray-800">Response Snapshot</div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-700">
                    {pretty(data)}
                  </pre>
                </div>
              </div>
            ) : (
              <pre className="overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800">
                {pretty(data)}
              </pre>
            )}
          </>
        ) : null}

        {!error && !data ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-500">
            No response yet. Run a GST action to inspect the result here.
          </div>
        ) : null}
      </div>
    </div>
  )
}
