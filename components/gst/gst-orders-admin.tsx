'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { getImportedOrderById, importOrder, listImportedOrders } from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

type Row = Record<string, unknown>

const samplePayload = JSON.stringify(
  {
    shopifyOrderName: '#1001',
    orderCreatedAt: new Date().toISOString(),
    orderCurrency: 'INR',
    orderSubtotal: 1000,
    orderTaxTotal: 180,
    orderGrandTotal: 1180,
    shippingStateCode: 'KA',
    billingStateCode: 'KA',
    lines: [],
  },
  null,
  2
)

export function GstOrdersAdmin() {
  const [importStatus, setImportStatus] = useState('')
  const [eligibilityStatus, setEligibilityStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [rows, setRows] = useState<Row[]>([])

  const [shopifyOrderId, setShopifyOrderId] = useState('')
  const [payloadText, setPayloadText] = useState(samplePayload)

  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function runList() {
    setLoading(true)
    setError(undefined)
    const res = await listImportedOrders({
      importStatus: importStatus || undefined,
      eligibilityStatus: eligibilityStatus || undefined,
      from: from || undefined,
      to: to || undefined,
    })
    if (res.ok) {
      setRows((res.data as { data?: Row[] })?.data || [])
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onImportOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    let parsedPayload: Record<string, unknown>
    try {
      parsedPayload = JSON.parse(payloadText) as Record<string, unknown>
    } catch {
      setLoading(false)
      setError('order payload must be valid JSON')
      return
    }

    const res = await importOrder({
      shopifyOrderId,
      order: parsedPayload,
    })

    if (res.ok) {
      setResult(res.data)
      await runList()
    } else {
      setError(res.error)
    }

    setLoading(false)
  }

  async function onFetchDetail(id: string) {
    setLoading(true)
    setError(undefined)
    const res = await getImportedOrderById(id)
    if (res.ok) {
      setResult(res.data)
      setOrderId(id)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  const stats = useMemo(() => {
    const total = rows.length
    const invoiceReady = rows.filter((r) => String(r.importStatus || '') === 'INVOICE_READY').length
    const reviewRequired = rows.filter((r) => String(r.eligibilityStatus || '') === 'REVIEW_REQUIRED').length
    const avgCompleteness =
      total === 0
        ? 0
        : Math.round(
            rows.reduce((sum, row) => sum + Number(row.mappingCompleteness || 0), 0) / total
          )

    return { total, invoiceReady, reviewRequired, avgCompleteness }
  }, [rows])

  const detail = ((result as { data?: Row })?.data || {}) as Row
  const readinessErrors = Array.isArray(detail.readinessErrors) ? detail.readinessErrors : []

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { label: 'Imported Orders', value: stats.total },
            { label: 'Invoice Ready', value: stats.invoiceReady },
            { label: 'Review Required', value: stats.reviewRequired },
            { label: 'Avg Mapping %', value: stats.avgCompleteness },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.label}</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Imported Orders</h2>
              <p className="mt-1 text-sm text-gray-500">Filter import records and inspect GST readiness indicators.</p>
            </div>
            <button type="button" className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white" onClick={() => void runList()}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <select className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={importStatus} onChange={(e) => setImportStatus(e.target.value)}>
              <option value="">All Import Status</option>
              <option value="IMPORTED">Imported</option>
              <option value="INVOICE_READY">Invoice Ready</option>
            </select>
            <select className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={eligibilityStatus} onChange={(e) => setEligibilityStatus(e.target.value)}>
              <option value="">All Eligibility</option>
              <option value="ELIGIBLE">Eligible</option>
              <option value="REVIEW_REQUIRED">Review Required</option>
              <option value="NOT_ELIGIBLE">Not Eligible</option>
            </select>
            <input type="date" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={from} onChange={(e) => setFrom(e.target.value)} />
            <input type="date" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">Order</th><th className="px-3 py-2">Created</th><th className="px-3 py-2">Eligibility</th><th className="px-3 py-2">Import Status</th><th className="px-3 py-2">Mapping %</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {rows.map((row) => {
                  const id = String(row.id || '')
                  return (
                    <tr key={id} className="border-t border-gray-100">
                      <td className="px-3 py-2"><div className="font-medium text-gray-900">{String(row.shopifyOrderName || row.shopifyOrderId || '')}</div><div className="text-xs text-gray-500">{String(row.shopifyOrderId || '')}</div></td>
                      <td className="px-3 py-2">{String(row.orderCreatedAt || '').slice(0, 10)}</td>
                      <td className="px-3 py-2">{String(row.eligibilityStatus || '')}</td>
                      <td className="px-3 py-2">{String(row.importStatus || '')}</td>
                      <td className="px-3 py-2">{String(row.mappingCompleteness || 0)}%</td>
                      <td className="px-3 py-2"><button type="button" className="rounded-lg border border-gray-300 px-3 py-1.5" onClick={() => void onFetchDetail(id)}>Details</button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={onImportOrder} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Import Shopify Order</h2>
          <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Shopify Order ID" value={shopifyOrderId} onChange={(e) => setShopifyOrderId(e.target.value)} />
          <textarea className="h-48 w-full rounded-xl border border-gray-300 px-3 py-2.5 font-mono text-xs" value={payloadText} onChange={(e) => setPayloadText(e.target.value)} />
          <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">{loading ? 'Importing...' : 'Import Order'}</button>
        </form>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Order Detail Snapshot</h2>
          {!orderId ? (
            <p className="mt-2 text-sm text-gray-500">Fetch any order by clicking "Details" in the table.</p>
          ) : (
            <div className="mt-3 space-y-3">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3"><div className="text-xs text-gray-500">Order ID</div><div className="text-sm font-medium">{orderId}</div></div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3"><div className="text-xs text-gray-500">Eligibility</div><div className="text-sm font-medium">{String(detail.eligibilityStatus || '—')}</div></div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3"><div className="text-xs text-gray-500">Import Status</div><div className="text-sm font-medium">{String(detail.importStatus || '—')}</div></div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3"><div className="text-xs text-gray-500">Mapping Completeness</div><div className="text-sm font-medium">{String(detail.mappingCompleteness || 0)}%</div></div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">Readiness Errors</div>
                {readinessErrors.length === 0 ? (
                  <p className="mt-2 text-sm text-emerald-700">No readiness errors reported.</p>
                ) : (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
                    {readinessErrors.map((item, idx) => (
                      <li key={`${String(item)}-${idx}`}>{String(item)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <GstResponseViewer title="Orders API Response" data={result} error={error} />
    </div>
  )
}
