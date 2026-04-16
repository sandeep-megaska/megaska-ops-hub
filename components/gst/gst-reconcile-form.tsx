'use client'

import { useState } from 'react'
import { listReconciliationRuns, reconcilePreview, runReconciliation } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstReconcileForm() {
  const [periodStart, setPeriodStart] = useState(`${new Date().getUTCFullYear()}-04-01`)
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().slice(0, 10))
  const [sourceSystem, setSourceSystem] = useState('GST_PORTAL')
  const [sourceDocumentsJson, setSourceDocumentsJson] = useState('[]')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function run(action: 'debug' | 'persist') {
    setLoading(true)
    setError(undefined)

    try {
      const sourceDocuments = JSON.parse(sourceDocumentsJson)
      const payload = {
        periodStart: `${periodStart}T00:00:00.000Z`,
        periodEnd: `${periodEnd}T23:59:59.999Z`,
        sourceSystem,
        sourceDocuments,
      }
      const res = action === 'debug' ? await reconcilePreview(payload) : await runReconciliation(payload)
      if (res.ok) setResult(res.data)
      else setError(res.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid source documents JSON')
    }

    setLoading(false)
  }

  async function loadHistory() {
    const res = await listReconciliationRuns()
    if (res.ok) setResult(res.data)
    else setError(res.error)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Reconciliation Runs</h2>
        <p className="text-sm text-gray-600">Preview compares data without persistence. Create Run stores summary and mismatch counts.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Period Start<input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} /></label>
          <label className="text-sm">Period End<input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} /></label>
          <label className="text-sm md:col-span-2">Source System<input className="mt-1 w-full rounded-lg border px-3 py-2" value={sourceSystem} onChange={(e) => setSourceSystem(e.target.value)} /></label>
        </div>
        <label className="block text-sm">Source Documents JSON
          <textarea className="mt-1 min-h-[180px] w-full rounded-lg border p-3 font-mono text-xs" value={sourceDocumentsJson} onChange={(e) => setSourceDocumentsJson(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2">
          <button disabled={loading} className="rounded-lg border px-4 py-2" onClick={() => void run('debug')}>Preview Reconcile</button>
          <button disabled={loading} className="rounded-lg bg-black px-4 py-2 text-white" onClick={() => void run('persist')}>Create Reconcile Run</button>
          <button className="rounded-lg border px-4 py-2" onClick={() => void loadHistory()}>Load Run History</button>
        </div>
      </div>
      <GstResponseViewer title="Reconcile Response" data={result} error={error} />
    </div>
  )
}
