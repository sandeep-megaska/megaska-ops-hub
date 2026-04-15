'use client'

import { useState, type FormEvent } from 'react'
import { notePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

const defaultPayload = {
  documentType: 'CREDIT_NOTE',
  sourceReference: 'TEST-CN-001',
  issueDate: new Date().toISOString(),
  reason: 'Test refund adjustment',
  placeOfSupply: '29',
  customer: {
    name: 'Test Customer Pvt Ltd',
    gstin: '29ABCDE1234F1Z5',
    email: 'buyer@test.com',
    phone: '9999999999',
    addressLine1: 'Customer Address 1',
    addressLine2: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    stateCode: '29',
    postalCode: '560001',
    country: 'IN',
  },
  lines: [
    {
      lineNumber: 1,
      sku: 'SKU-001',
      hsnOrSac: '61091000',
      description: 'Refund line',
      quantity: 1,
      unit: 'PCS',
      unitPrice: 500,
      grossAmount: 500,
      discountAmount: 0,
      taxRateType: 'GST_012',
      taxRatePercent: 12,
    },
  ],
}

export function GstNotePreviewForm() {
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
      const res = await notePreview(parsed)

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
          <div className="mb-1 text-sm font-medium">Note Preview Payload</div>
          <textarea
            className="min-h-[520px] w-full rounded-xl border p-3 font-mono text-xs"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border px-4 py-2 font-medium"
        >
          {loading ? 'Generating...' : 'Run Note Preview'}
        </button>
      </form>

      <GstResponseViewer title="Note Preview Response" data={result} error={error} />
    </div>
  )
}
