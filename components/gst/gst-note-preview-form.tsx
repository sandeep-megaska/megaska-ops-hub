'use client'

import { useMemo, useState } from 'react'
import { createNoteDraft, notePreview } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

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
  const [showRaw, setShowRaw] = useState(false)

  const numberingHint = error?.toLowerCase().includes('number')
    ? 'Draft notes require active GST settings, note prefixes, and a working GST counter initialization.'
    : undefined

  const payload = useMemo(
    () => ({
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
      lines: [
        {
          description,
          quantity: 1,
          unitPrice: Number(amount),
          taxRate: 12,
          unit: 'PCS',
          discount: 0,
        },
      ],
    }),
    [amount, billingStateCode, buyerGstin, buyerLegalName, description, noteType, originalDocumentId, shippingStateCode, sourceOrderId]
  )

  async function run(action: 'preview' | 'draft') {
    setLoading(true)
    setError(undefined)
    const res = action === 'preview' ? await notePreview(payload) : await createNoteDraft(payload)
    if (res.ok) setResult(res.data)
    else setError(res.error)
    setLoading(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <Card
          title="Credit / Debit Note Workflow"
          subtitle="Preview computes tax and reconciliation impact. Create Draft reserves numbering and stores the draft note."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-1.5 text-sm font-medium text-gray-700">Note Type</div>
              <select
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as 'CREDIT_NOTE' | 'DEBIT_NOTE')}
              >
                <option value="CREDIT_NOTE">Credit Note</option>
                <option value="DEBIT_NOTE">Debit Note</option>
              </select>
            </label>

            <TextInput
              label="Original Document ID (optional)"
              value={originalDocumentId}
              onChange={setOriginalDocumentId}
            />

            <TextInput label="Source Order ID" value={sourceOrderId} onChange={setSourceOrderId} />
          </div>
        </Card>

        <Card title="Buyer & Supply Details" subtitle="Buyer identity and state information guide note classification and tax treatment.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Billing State Code"
              value={billingStateCode}
              onChange={setBillingStateCode}
            />
            <TextInput
              label="Shipping State Code"
              value={shippingStateCode}
              onChange={setShippingStateCode}
            />
            <TextInput
              label="Buyer Legal Name"
              value={buyerLegalName}
              onChange={setBuyerLegalName}
            />
            <TextInput
              label="Buyer GSTIN"
              value={buyerGstin}
              onChange={(value) => setBuyerGstin(value.toUpperCase())}
            />
          </div>
        </Card>

        <Card title="Adjustment Line" subtitle="Use the note line to preview refund or debit impact before reserving document numbering.">
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Line Description" value={description} onChange={setDescription} />
            <TextInput
              label="Amount"
              value={amount}
              onChange={(value) => setAmount(Number(value))}
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
              {loading ? 'Working...' : 'Preview Note'}
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void run('draft')}
            >
              {loading ? 'Working...' : 'Create Draft Note'}
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
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              Preview avoids numbering. Draft creation uses backend numbering with the active GST settings profile.
            </p>
          )}
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

      <GstResponseViewer title="Note Response" data={result} error={error} />
    </div>
  )
}
