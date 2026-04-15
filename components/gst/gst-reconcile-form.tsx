'use client'

import { useState, type FormEvent } from 'react'
import { reconcilePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

const defaultPayload = {
  runType: 'DEBUG',
  periodKey: '2026-04',
  source: 'TEST_STORE',
}

export function GstReconcileForm() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>
      const res = await reconcilePreview(parsed)

      if (res.ok) {
        setResult(res.data)
      } else {
        setError(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }

    setLoading(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <div className="mb-1 text-sm font-medium">Reconcile Payload</div>
          <textarea
            className="min-h-[320px] w-full rounded-xl border p-3 font-mono text-xs"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border px-4 py-2 font-medium"
        >
          {loading ? 'Running...' : 'Run Reconcile Debug'}
        </button>
      </form>

      <GstResponseViewer title="Reconcile Response" data={result} error={error} />
    </div>
  )
}
