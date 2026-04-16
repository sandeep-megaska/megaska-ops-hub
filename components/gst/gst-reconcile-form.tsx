'use client'

import { useState } from 'react'
import { listReconciliationRuns, reconcilePreview, runReconciliation } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

function SummaryCard({
  title,
  value,
  hint,
}: {
  title: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</div>
      <div className="mt-1 text-base font-semibold text-gray-900">{value}</div>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  )
}

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
    setLoading(true)
    setError(undefined)
    const res = await listReconciliationRuns()
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Reconciliation Runs</h2>
          <p className="mt-1 text-sm text-gray-500">
            Preview compares source data without persistence. Create Run stores a reconciliation record
            with summary output.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SummaryCard title="Period Start" value={periodStart} />
            <SummaryCard title="Period End" value={periodEnd} />
            <SummaryCard title="Source System" value={sourceSystem} hint="Portal, ERP, or imported data source" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
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

            <label className="block md:col-span-2">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Source System</div>
              <input
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={sourceSystem}
                onChange={(e) => setSourceSystem(e.target.value)}
              />
            </label>
          </div>

          <label className="mt-5 block">
            <div className="mb-1.5 text-sm font-medium text-gray-700">Source Documents JSON</div>
            <textarea
              className="min-h-[220px] w-full rounded-2xl border border-gray-300 bg-white p-4 font-mono text-xs text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              value={sourceDocumentsJson}
              onChange={(e) => setSourceDocumentsJson(e.target.value)}
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
              onClick={() => void run('debug')}
            >
              {loading ? 'Working...' : 'Preview Reconcile'}
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-60"
              onClick={() => void run('persist')}
            >
              {loading ? 'Working...' : 'Create Reconcile Run'}
            </button>

            <button
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:opacity-60"
              onClick={() => void loadHistory()}
              disabled={loading}
            >
              {loading ? 'Working...' : 'Load Run History'}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Preview is safe for validation. Persisting a run should only be used when you want an audit
            trail and stored reconciliation summary.
          </p>
        </div>
      </div>

      <GstResponseViewer title="Reconcile Response" data={result} error={error} />
    </div>
  )
}
