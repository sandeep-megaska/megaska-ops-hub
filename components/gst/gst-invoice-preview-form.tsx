'use client'

import { useMemo, useState } from 'react'
import { createInvoiceDraft, invoicePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

type InvoiceFormState = {
  sourceOrderId: string
  sourceOrderNumber: string
  sourceReference: string
  billingStateCode: string
  shippingStateCode: string
  buyerLegalName: string
  buyerGstin: string
  buyerStateCode: string
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

const initialState: InvoiceFormState = {
  sourceOrderId: 'TEST-ORDER-1001',
  sourceOrderNumber: '1001',
  sourceReference: 'ADMIN-CONSOLE',
  billingStateCode: '29',
  shippingStateCode: '29',
  buyerLegalName: 'Test Customer Pvt Ltd',
  buyerGstin: '29ABCDE1234F1Z5',
  buyerStateCode: '29',
  description: 'Test line item',
  quantity: 1,
  unitPrice: 1000,
  taxRate: 12,
}

export function GstInvoicePreviewForm() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [showRaw, setShowRaw] = useState(false)
  const numberingHint = error?.toLowerCase().includes('number')
    ? 'Draft creation requires active GST settings, valid prefixes, and an initialized GST counter.'
    : undefined

  const payload = useMemo(() => ({
    sourceOrderId: form.sourceOrderId,
    sourceOrderNumber: form.sourceOrderNumber,
    sourceReference: form.sourceReference,
    billingStateCode: form.billingStateCode,
    shippingStateCode: form.shippingStateCode,
    buyer: {
      legalName: form.buyerLegalName,
      gstin: form.buyerGstin || null,
      stateCode: form.buyerStateCode || null,
    },
    lines: [{ description: form.description, quantity: Number(form.quantity), unitPrice: Number(form.unitPrice), taxRate: Number(form.taxRate), unit: 'PCS', discount: 0 }],
  }), [form])

  async function run(action: 'preview' | 'draft') {
    setLoading(true)
    setError(undefined)
    const res = action === 'preview' ? await invoicePreview(payload) : await createInvoiceDraft(payload)
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
</div>
  )
}
