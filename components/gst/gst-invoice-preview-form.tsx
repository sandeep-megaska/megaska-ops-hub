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

function Card({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  )
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-gray-700">{label}</div>
      <input
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function GstInvoicePreviewForm() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [showRaw, setShowRaw] = useState(false)

  const numberingHint = error?.toLowerCase().includes('number')
    ? 'Draft creation requires active GST settings, valid numbering prefixes, and an initialized GST counter.'
    : undefined

  const payload = useMemo(
    () => ({
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
      lines: [
        {
          description: form.description,
          quantity: Number(form.quantity),
          unitPrice: Number(form.unitPrice),
          taxRate: Number(form.taxRate),
          unit: 'PCS',
          discount: 0,
        },
      ],
    }),
    [form]
  )

  async function run(action: 'preview' | 'draft') {
    setLoading(true)
    setError(undefined)
    const res = action === 'preview' ? await invoicePreview(payload) : await createInvoiceDraft(payload)
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <Card
          title="Invoice Draft Workflow"
          subtitle="Preview validates classification and totals. Create Draft reserves a GST number and persists a DRAFT document."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput
              label="Source Order ID"
              value={form.sourceOrderId}
              onChange={(value) => setForm((p) => ({ ...p, sourceOrderId: value }))}
            />
            <TextInput
              label="Order Number"
              value={form.sourceOrderNumber}
              onChange={(value) => setForm((p) => ({ ...p, sourceOrderNumber: value }))}
            />
            <TextInput
              label="Reference"
              value={form.sourceReference}
              onChange={(value) => setForm((p) => ({ ...p, sourceReference: value }))}
            />
          </div>
        </Card>

        <Card title="Buyer & Supply Details" subtitle="These values drive supply classification and tax split.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Billing State Code"
              value={form.billingStateCode}
              onChange={(value) => setForm((p) => ({ ...p, billingStateCode: value }))}
            />
            <TextInput
              label="Shipping State Code"
              value={form.shippingStateCode}
              onChange={(value) => setForm((p) => ({ ...p, shippingStateCode: value }))}
            />
            <TextInput
              label="Buyer Legal Name"
              value={form.buyerLegalName}
              onChange={(value) => setForm((p) => ({ ...p, buyerLegalName: value }))}
            />
            <TextInput
              label="Buyer GSTIN"
              value={form.buyerGstin}
              onChange={(value) => setForm((p) => ({ ...p, buyerGstin: value.toUpperCase() }))}
            />
            <TextInput
              label="Buyer State Code"
              value={form.buyerStateCode}
              onChange={(value) => setForm((p) => ({ ...p, buyerStateCode: value }))}
            />
          </div>
        </Card>

        <Card title="Line Item" subtitle="Use a representative item to validate the tax engine and draft creation path.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Description"
              value={form.description}
              onChange={(value) => setForm((p) => ({ ...p, description: value }))}
            />
            <TextInput
              label="Quantity"
              value={form.quantity}
              onChange={(value) => setForm((p) => ({ ...p, quantity: Number(value) }))}
            />
            <TextInput
              label="Unit Price"
              value={form.unitPrice}
              onChange={(value) => setForm((p) => ({ ...p, unitPrice: Number(value) }))}
            />
            <TextInput
              label="Tax Rate %"
              value={form.taxRate}
              onChange={(value) => setForm((p) => ({ ...p, taxRate: Number(value) }))}
            />
          </div>
        </Card>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void run('preview')}
            >
              {loading ? 'Working...' : 'Preview Invoice'}
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void run('draft')}
            >
              {loading ? 'Working...' : 'Create Draft Invoice'}
            </button>

            <button
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
              onClick={() => setShowRaw((v) => !v)}
            >
              {showRaw ? 'Hide Raw Payload' : 'Show Raw Payload'}
            </button>
          </div>

          {numberingHint ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {numberingHint}
            </div>
          ) : null}

          {!numberingHint ? (
            <p className="mt-4 text-sm text-gray-500">
              Preview should succeed before draft creation. Draft creation additionally reserves a GST document number.
            </p>
          ) : null}
        </div>

        {showRaw ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-800">Raw Payload</div>
            <pre className="overflow-x-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-700">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        ) : null}
      </div>

      <GstResponseViewer title="Invoice Response" data={result} error={error} />
    </div>
  )
}
