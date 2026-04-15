'use client'

import { useEffect, useState } from 'react'
import { createOrUpdateGstSettings, getGstSettings } from '@/lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

const initialState = {
  legalName: 'Megaska Test Entity',
  tradeName: 'Megaska Test',
  gstin: '29ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  email: 'gst-test@megaska.com',
  phone: '9999999999',
  addressLine1: 'Test Address Line 1',
  addressLine2: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  stateCode: '29',
  postalCode: '560001',
  country: 'IN',
  invoicePrefix: 'GST',
  creditNotePrefix: 'CN',
  debitNotePrefix: 'DN',
  invoiceSequencePadding: 6,
  financialYearStartMonth: 4,
  defaultPlaceOfSupply: '29',
  defaultCurrency: 'INR',
}

export function GstSettingsForm() {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    let mounted = true
    async function load() {
      setFetching(true)
      const res = await getGstSettings()
      if (!mounted) return

      if (res.ok && res.data && typeof res.data === 'object') {
        const record = res.data as Record<string, unknown>
        setForm((prev) => ({
          ...prev,
          ...record,
        }))
        setResult(record)
        setError(undefined)
      } else if (!res.ok) {
        setError(res.error)
      }

      setFetching(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function onSubmit(e: React.FormEvent) {
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

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
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
                update(
                  key as keyof typeof form,
                  typeof value === 'number' ? Number(e.target.value) : e.target.value
                )
              }
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={loading || fetching}
          className="rounded-xl border px-4 py-2 font-medium"
        >
          {loading ? 'Saving...' : 'Save GST Settings'}
        </button>
      </form>

      <GstResponseViewer
        title="Settings Response"
        data={result}
        error={error}
      />
    </div>
  )
}
