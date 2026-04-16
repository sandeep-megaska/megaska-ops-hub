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
  const numberingHint = error?.toLowerCase().includes('number')
    ? 'Draft notes require active GST settings, configured note prefixes, and an initialized GST counter.'
    : undefined

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
    <div className="space-y-6">
  {/* Section Card */}
  <div className="rounded-xl border bg-white p-5">
    <h2 className="text-lg font-semibold">Order Details</h2>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {/* fields here */}
    </div>
  </div>

  <div className="rounded-xl border bg-white p-5">
    <h2 className="text-lg font-semibold">Buyer Details</h2>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {/* fields here */}
    </div>
  </div>

  <div className="rounded-xl border bg-white p-5">
    <h2 className="text-lg font-semibold">Line Item</h2>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {/* fields here */}
    </div>
  </div>
</div>  )
}
