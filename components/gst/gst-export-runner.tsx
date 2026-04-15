'use client'

import { useState } from 'react'
import { createExport, listExports } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstExportRunner() {
  const [payload, setPayload] = useState(
    JSON.stringify({ exportType: 'invoice_register', periodStart: `${new Date().getUTCFullYear()}-04-01T00:00:00.000Z`, periodEnd: new Date().toISOString(), filters: {} }, null, 2),
  )
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function runExport() {
    setError(undefined)
    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>
      const res = await createExport(parsed)
      if (res.ok) setResult(res.data)
      else setError(res.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  async function runList() {
    setError(undefined)
    const res = await listExports()
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <textarea className="min-h-[260px] w-full rounded-xl border p-3 font-mono text-xs" value={payload} onChange={(e) => setPayload(e.target.value)} />
        <div className="flex gap-2">
          <button className="rounded-xl border px-4 py-2" onClick={() => void runExport()}>Create Export</button>
          <button className="rounded-xl border px-4 py-2" onClick={() => void runList()}>List Exports</button>
        </div>
      </div>
      <GstResponseViewer title="Export Response" data={result} error={error} />
    </div>
  )
}
