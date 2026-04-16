'use client'

import { useMemo, useState } from 'react'
import { createNoteDraft, notePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

export function GstNotePreviewForm() {
  const [noteType, setNoteType] = useState<'CREDIT_NOTE' | 'DEBIT_NOTE'>('CREDIT_NOTE')
  const [originalDocumentId, setOriginalDocumentId] = useState('')
  const [sourceOrderId, setSourceOrderId] = useState('TEST-ORDER-1001')
  const [billingStateCode, setBillingStateCode] = useState('29')
  const [shippingStateCode, setShippingStateCode] = useState('29')
  const [buyerLegalName, setBuyerLegalName] = useState('Test Customer Pvt Ltd')
  const [buyerGstin, setBuyerGstin] = useState('29ABCDE1234F1Z5')
  const [description, setDescription] = useState('Refund line item')
  const [amount, setAmount] = useState(500)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  const payload = useMemo(() => ({
    noteType,
    originalDocumentId: originalDocumentId || undefined,
    sourceOrderId,
    sourceReference: `ADMIN-${noteType}`,
    billingStateCode,
    shippingStateCode,
    buyer: {
      legalName: buyerLegalName,
      gstin: buyerGstin || null,
      stateCode: billingStateCode || null,
    },
    lines: [{ description, quantity: 1, unitPrice: Number(amount), taxRate: 12, unit: 'PCS', discount: 0 }],
  }), [amount, billingStateCode, buyerGstin, buyerLegalName, description, noteType, originalDocumentId, shippingStateCode, sourceOrderId])

  async function run(action: 'preview' | 'draft') {
    setLoading(true)
    setError(undefined)
    const res = action === 'preview' ? await notePreview(payload) : await createNoteDraft(payload)
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Credit / Debit Note Workflow</h2>
        <p className="text-sm text-gray-600">Use this flow to preview and create DRAFT notes. Numbering is reserved by backend using active GST settings prefixes.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Note Type
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={noteType} onChange={(e) => setNoteType(e.target.value as 'CREDIT_NOTE' | 'DEBIT_NOTE')}>
              <option value="CREDIT_NOTE">Credit Note</option>
              <option value="DEBIT_NOTE">Debit Note</option>
            </select>
          </label>
          <label className="text-sm">Original Document ID (optional)<input className="mt-1 w-full rounded-lg border px-3 py-2" value={originalDocumentId} onChange={(e) => setOriginalDocumentId(e.target.value)} /></label>
          <label className="text-sm">Source Order ID<input className="mt-1 w-full rounded-lg border px-3 py-2" value={sourceOrderId} onChange={(e) => setSourceOrderId(e.target.value)} /></label>
          <label className="text-sm">Billing State<input className="mt-1 w-full rounded-lg border px-3 py-2" value={billingStateCode} onChange={(e) => setBillingStateCode(e.target.value)} /></label>
          <label className="text-sm">Shipping State<input className="mt-1 w-full rounded-lg border px-3 py-2" value={shippingStateCode} onChange={(e) => setShippingStateCode(e.target.value)} /></label>
          <label className="text-sm">Buyer Legal Name<input className="mt-1 w-full rounded-lg border px-3 py-2" value={buyerLegalName} onChange={(e) => setBuyerLegalName(e.target.value)} /></label>
          <label className="text-sm">Buyer GSTIN<input className="mt-1 w-full rounded-lg border px-3 py-2" value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())} /></label>
          <label className="text-sm">Line Description<input className="mt-1 w-full rounded-lg border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} /></label>
          <label className="text-sm">Amount<input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button disabled={loading} className="rounded-lg border px-4 py-2" onClick={() => void run('preview')}>Preview Note</button>
          <button disabled={loading} className="rounded-lg bg-black px-4 py-2 text-white" onClick={() => void run('draft')}>Create Draft Note</button>
        </div>

        <pre className="overflow-x-auto rounded-xl border bg-gray-50 p-3 text-xs">{JSON.stringify(payload, null, 2)}</pre>
      </div>
      <GstResponseViewer title="Note Response" data={result} error={error} />
    </div>
  )
}
