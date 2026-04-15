'use client'

import { useState, type FormEvent } from 'react'
import { createInvoiceDraft, invoicePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

const defaultPayload = {
  sourceOrderId: 'TEST-ORDER-1001',
  sourceOrderNumber: '1001',
  sourceReference: 'MANUAL-TEST',
  billingStateCode: '29',
  shippingStateCode: '29',
  buyer: { legalName: 'Test Customer Pvt Ltd', gstin: '29ABCDE1234F1Z5', stateCode: '29' },
  lines: [{ description: 'Test T-Shirt', quantity: 1, unitPrice: 1000, taxRate: 12, hsnOrSac: '61091000', unit: 'PCS', discount: 0 }],
}

export function GstInvoicePreviewForm() {
  const [payload, setPayload] = useState(JSON.stringify(defaultPayload, null, 2))
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  async function run(action: 'preview' | 'draft') {
    setLoading(true)
    setError(undefined)
    try {
      const parsed = JSON.parse(payload) as Record<string, unknown>
      const res = action === 'preview' ? await invoicePreview(parsed) : await createInvoiceDraft(parsed)
      if (res.ok) setResult(res.data)
      else setError(res.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
    }
    setLoading(false)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await run('preview')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <textarea className="min-h-[520px] w-full rounded-xl border p-3 font-mono text-xs" value={payload} onChange={(e) => setPayload(e.target.value)} />
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-xl border px-4 py-2 font-medium">Preview</button>
          <button type="button" disabled={loading} onClick={() => void run('draft')} className="rounded-xl border px-4 py-2 font-medium">Create Draft</button>
        </div>
      </form>
      <GstResponseViewer title="Invoice Response" data={result} error={error} />
    </div>
  )
}
