'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createOrUpdateGstSettings, getGstSettings } from '../../lib/gst-client'
import { GST_DEFAULT_NUMBERING_STRATEGY } from '../../services/gst/constants'
import { GstResponseViewer } from './gst-response-viewer'

type SettingsFormState = {
  legalName: string
  tradeName: string
  gstin: string
  pan: string
  stateCode: string
  invoicePrefix: string
  creditNotePrefix: string
  debitNotePrefix: string
  invoiceNumberStrategy: string
  defaultCurrency: string
  einvoiceEnabled: boolean
  isActive: boolean
}

const initialState: SettingsFormState = {
  legalName: '',
  tradeName: '',
  gstin: '',
  pan: '',
  stateCode: '',
  invoicePrefix: 'INV',
  creditNotePrefix: 'CN',
  debitNotePrefix: 'DN',
  invoiceNumberStrategy: GST_DEFAULT_NUMBERING_STRATEGY,
  defaultCurrency: 'INR',
  einvoiceEnabled: false,
  isActive: true,
}

export function GstSettingsForm() {
  const [form, setForm] = useState<SettingsFormState>(initialState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    void (async () => {
      const res = await getGstSettings()
      if (!res.ok) return
      const record = (res.data as { settings?: Partial<SettingsFormState> })?.settings
      if (!record) return
      setForm((prev) => ({ ...prev, ...record, tradeName: record.tradeName || '', pan: record.pan || '' }))
      setResult(record)
    })()
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    const res = await createOrUpdateGstSettings({
      ...form,
      tradeName: form.tradeName || null,
      pan: form.pan || null,
    })

    if (res.ok) {
      setResult(res.data)
    } else {
      setError(res.error)
    }

    setLoading(false)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Registration & Numbering</h2>
        <p className="text-sm text-gray-600">Configure active GST registration. Seller state and numbering prefixes are sourced from these settings during document creation.</p>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm">Legal Name<input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.legalName} onChange={(e) => setForm((p) => ({ ...p, legalName: e.target.value }))} /></label>
          <label className="text-sm">Trade Name<input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.tradeName} onChange={(e) => setForm((p) => ({ ...p, tradeName: e.target.value }))} /></label>
          <label className="text-sm">GSTIN<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.gstin} onChange={(e) => setForm((p) => ({ ...p, gstin: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">PAN<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.pan} onChange={(e) => setForm((p) => ({ ...p, pan: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">State Code<input className="mt-1 w-full rounded-lg border px-3 py-2" value={form.stateCode} onChange={(e) => setForm((p) => ({ ...p, stateCode: e.target.value }))} /></label>
          <label className="text-sm">Default Currency<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.defaultCurrency} onChange={(e) => setForm((p) => ({ ...p, defaultCurrency: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">Invoice Prefix<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.invoicePrefix} onChange={(e) => setForm((p) => ({ ...p, invoicePrefix: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">Credit Note Prefix<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.creditNotePrefix} onChange={(e) => setForm((p) => ({ ...p, creditNotePrefix: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">Debit Note Prefix<input className="mt-1 w-full rounded-lg border px-3 py-2 uppercase" value={form.debitNotePrefix} onChange={(e) => setForm((p) => ({ ...p, debitNotePrefix: e.target.value.toUpperCase() }))} /></label>
          <label className="text-sm">Numbering Strategy
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={form.invoiceNumberStrategy} onChange={(e) => setForm((p) => ({ ...p, invoiceNumberStrategy: e.target.value }))}>
              <option value="FINANCIAL_YEAR_SEQUENCE">Financial Year Sequence</option>
              <option value="CALENDAR_YEAR_SEQUENCE">Calendar Year Sequence</option>
              <option value="MONTHLY_SEQUENCE">Monthly Sequence</option>
              <option value="MANUAL">Manual</option>
            </select>
          </label>
        </div>

        <div className="flex gap-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.einvoiceEnabled} onChange={(e) => setForm((p) => ({ ...p, einvoiceEnabled: e.target.checked }))} />E-invoice enabled</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />Active settings</label>
        </div>

        <button type="submit" disabled={loading} className="rounded-lg bg-black px-4 py-2 text-white">{loading ? 'Saving...' : 'Save GST Settings'}</button>
      </form>

      <GstResponseViewer title="Settings API Response" data={result} error={error} />
    </div>
  )
}
