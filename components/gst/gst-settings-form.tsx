'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { createOrUpdateGstSettings, getGstSettings } from '../../lib/gst-client'
import { GST_DEFAULT_NUMBERING_STRATEGY } from '../../services/gst/constants'
import { GstResponseViewer } from './gst-response-viewer'

const initialState = {
  legalName: 'Megaska Test Entity',
  tradeName: 'Megaska Test',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  stateCode: '29',
  invoicePrefix: 'GST',
  creditNotePrefix: 'CN',
  debitNotePrefix: 'DN',
  invoiceNumberStrategy: GST_DEFAULT_NUMBERING_STRATEGY,
  defaultCurrency: 'INR',
  einvoiceEnabled: false,
  isActive: true,
}

export function GstSettingsForm() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    void (async () => {
      const res = await getGstSettings()
      if (!res.ok) {
        setError(res.error)
        return
      }

      const record = (res.data as { settings?: Record<string, unknown> })?.settings
      if (record) {
        setForm((prev) => ({ ...prev, ...record }))
        setResult(record)
      }
    })()
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    const res = await createOrUpdateGstSettings(form)
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
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block">
            <div className="mb-1 text-sm font-medium">{key}</div>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={String(value ?? '')}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [key]: typeof value === 'boolean' ? e.target.value === 'true' : e.target.value }))
              }
            />
          </label>
        ))}

        <button type="submit" disabled={loading} className="rounded-xl border px-4 py-2 font-medium">
          {loading ? 'Saving...' : 'Save GST Settings'}
        </button>
      </form>

      <GstResponseViewer title="Settings Response" data={result} error={error} />
    </div>
  )
}
