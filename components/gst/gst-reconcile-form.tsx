'use client'

import { useState, type FormEvent } from 'react'
import { reconcilePreview, runReconciliation } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

const defaultPayload = {
  periodStart: `${new Date().getUTCFullYear()}-04-01T00:00:00.000Z`,
  periodEnd: new Date().toISOString(),
  sourceSystem: 'TEST_STORE',
  sourceDocuments: [],
}

export function GstReconcileForm() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function run(action: 'debug' | 'persist') {
    setLoading(true)
    setError(undefined)

    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>
      const res = action === 'debug' ? await reconcilePreview(parsed) : await runReconciliation(parsed)
      if (res.ok) setResult(res.data)
      else setError(res.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }

    setLoading(false)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await run('debug')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <textarea className="min-h-[320px] w-full rounded-xl border p-3 font-mono text-xs" value={payload} onChange={(e) => setPayload(e.target.value)} />
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-xl border px-4 py-2 font-medium">Debug Reconcile</button>
          <button type="button" disabled={loading} onClick={() => void run('persist')} className="rounded-xl border px-4 py-2 font-medium">Create Run</button>
        </div>
      </form>
      <GstResponseViewer title="Reconcile Response" data={result} error={error} />
    </div>
  )
}
