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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Invoice Draft Workflow</h2>
        <p className="text-sm text-gray-600">Preview validates classification and tax calculation. Create Draft reserves a GST number and stores a DRAFT document.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ['Source Order ID', 'sourceOrderId'],
            ['Order Number', 'sourceOrderNumber'],
            ['Reference', 'sourceReference'],
            ['Billing State', 'billingStateCode'],
            ['Shipping State', 'shippingStateCode'],
            ['Buyer Legal Name', 'buyerLegalName'],
            ['Buyer GSTIN', 'buyerGstin'],
            ['Buyer State', 'buyerStateCode'],
            ['Item Description', 'description'],
          ].map(([label, key]) => (
            <label key={key} className="text-sm">{label}<input className="mt-1 w-full rounded-lg border px-3 py-2" value={String(form[key as keyof InvoiceFormState])} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} /></label>
          ))}
          <label className="text-sm">Quantity<input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: Number(e.target.value) }))} /></label>
          <label className="text-sm">Unit Price<input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.unitPrice} onChange={(e) => setForm((p) => ({ ...p, unitPrice: Number(e.target.value) }))} /></label>
          <label className="text-sm">Tax Rate %<input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={form.taxRate} onChange={(e) => setForm((p) => ({ ...p, taxRate: Number(e.target.value) }))} /></label>
        </div>

        <div className="flex flex-wrap gap-2">
          <button disabled={loading} className="rounded-lg border px-4 py-2" onClick={() => void run('preview')}>Preview Invoice</button>
          <button disabled={loading} className="rounded-lg bg-black px-4 py-2 text-white" onClick={() => void run('draft')}>Create Draft Invoice</button>
          <button className="rounded-lg border px-4 py-2" onClick={() => setShowRaw((v) => !v)}>{showRaw ? 'Hide' : 'Show'} Raw Payload</button>
        </div>

        {showRaw ? <pre className="overflow-x-auto rounded-xl border bg-gray-50 p-3 text-xs">{JSON.stringify(payload, null, 2)}</pre> : null}
      </div>
      <GstResponseViewer title="Invoice Response" data={result} error={error} />
    </div>
  )
}
