'use client'

import { useState } from 'react'
import { createExport, listExports } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstExportRunner() {
  const [exportType, setExportType] = useState<'invoice_register' | 'notes_register'>('invoice_register')
  const [periodStart, setPeriodStart] = useState(`${new Date().getUTCFullYear()}-04-01`)
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().slice(0, 10))
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function runExport() {
    setError(undefined)
    const res = await createExport({ exportType, periodStart: `${periodStart}T00:00:00.000Z`, periodEnd: `${periodEnd}T23:59:59.999Z`, filters: {} })
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  async function runList() {
    setError(undefined)
    const res = await listExports()
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Export Batches</h2>
        <p className="text-sm text-gray-600">Generate export batches for invoices or notes and then inspect historical runs.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Export Type<select className="mt-1 w-full rounded-lg border px-3 py-2" value={exportType} onChange={(e) => setExportType(e.target.value as 'invoice_register' | 'notes_register')}><option value="invoice_register">Invoice Register</option><option value="notes_register">Notes Register</option></select></label>
          <label className="text-sm">Period Start<input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} /></label>
          <label className="text-sm">Period End<input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} /></label>
        </div>
        <div className="flex gap-2">
         <div className="flex gap-3">
  <button className="rounded-lg bg-black px-5 py-2 text-white shadow">
    Run Export
  </button>
  <button className="rounded-lg border px-5 py-2 hover:bg-gray-100">
    <p className="text-xs text-gray-500">
  Export requires at least one GST document in selected period.
</p>
    View History
  </button>
</div>
        </div>
      </div>
      <GstResponseViewer title="Export Response" data={result} error={error} />
    </div>
  )
}
