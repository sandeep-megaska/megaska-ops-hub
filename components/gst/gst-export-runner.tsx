'use client'

import { useState } from 'react'
import { createExport, listExports } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-gray-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-gray-500">{hint}</div> : null}
    </div>
  )
}

export function GstExportRunner() {
  const [exportType, setExportType] = useState<'invoice_register' | 'notes_register'>(
    'invoice_register'
  )
  const [periodStart, setPeriodStart] = useState(`${new Date().getUTCFullYear()}-04-01`)
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().slice(0, 10))
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function runExport() {
    setLoading(true)
    setError(undefined)
    const res = await createExport({
      exportType,
      periodStart: `${periodStart}T00:00:00.000Z`,
      periodEnd: `${periodEnd}T23:59:59.999Z`,
      filters: {},
    })
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  async function runList() {
    setLoading(true)
    setError(undefined)
    const res = await listExports()
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  const exportHint = error?.toLowerCase().includes('prepare gst export batch')
    ? 'Export batching usually needs matching GST documents in the selected period and a valid export preparation path on the backend.'
    : undefined

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Export Batches</h2>
          <p className="mt-1 text-sm text-gray-500">
            Generate GST exports for invoices or notes and review historical batches without leaving
            the admin console.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Export Mode"
              value={exportType === 'invoice_register' ? 'Invoice Register' : 'Notes Register'}
              hint="Switch target register before generating."
            />
            <StatCard label="Period Start" value={periodStart} />
            <StatCard label="Period End" value={periodEnd} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Export Type</div>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={exportType}
                onChange={(e) =>
                  setExportType(e.target.value as 'invoice_register' | 'notes_register')
                }
              >
                <option value="invoice_register">Invoice Register</option>
                <option value="notes_register">Notes Register</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Period Start</div>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </label>

            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Period End</div>
              <input
                type="date"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60"
              onClick={() => void runExport()}
              disabled={loading}
            >
              {loading ? 'Working...' : 'Run Export'}
            </button>
            <button
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
              onClick={() => void runList()}
              disabled={loading}
            >
              {loading ? 'Working...' : 'Load Export History'}
            </button>
          </div>

          {exportHint ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {exportHint}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Export generation typically requires at least one matching GST document within the
              selected date range.
            </p>
          )}
        </div>
      </div>

      <GstResponseViewer title="Export Response" data={result} error={error} />
    </div>
  )
}
