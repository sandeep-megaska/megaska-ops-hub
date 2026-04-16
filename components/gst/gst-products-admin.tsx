'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  assignSlabToHsn,
  deleteHsnCode,
  deleteTaxSlab,
  listHsnCodes,
  listProductTaxMappings,
  listTaxSlabs,
  listUnmappedProducts,
  upsertHsnCode,
  upsertProductTaxMapping,
  upsertTaxSlab,
} from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

type Row = Record<string, unknown>

const initialHsn = {
  id: '',
  hsnCode: '',
  description: '',
  isService: false,
  isActive: true,
}

const initialSlab = {
  id: '',
  slabCode: '',
  taxRate: '18',
  cessRate: '0',
  isActive: true,
}

const initialAssignment = {
  hsnId: '',
  slabId: '',
  priority: '0',
  effectiveFrom: '',
  effectiveTo: '',
}

const initialMapping = {
  id: '',
  shopifyProductId: '',
  shopifyVariantId: '',
  hsnId: '',
  slabId: '',
  status: 'ACTIVE',
  source: 'manual',
  effectiveFrom: '',
  effectiveTo: '',
}

function prettyDate(value: unknown) {
  const raw = String(value || '')
  return raw ? raw.slice(0, 10) : '—'
}

export function GstProductsAdmin() {
  const [hsnRows, setHsnRows] = useState<Row[]>([])
  const [slabRows, setSlabRows] = useState<Row[]>([])
  const [mappingRows, setMappingRows] = useState<Row[]>([])
  const [unmappedRows, setUnmappedRows] = useState<Row[]>([])
  const [unmappedSearch, setUnmappedSearch] = useState('')
  const [hsnForm, setHsnForm] = useState(initialHsn)
  const [slabForm, setSlabForm] = useState(initialSlab)
  const [assignmentForm, setAssignmentForm] = useState(initialAssignment)
  const [mappingForm, setMappingForm] = useState(initialMapping)
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function refreshAll() {
    setLoading(true)
    setError(undefined)
    const [hsnRes, slabRes, mapRes, unmappedRes] = await Promise.all([
      listHsnCodes(),
      listTaxSlabs(),
      listProductTaxMappings(),
      listUnmappedProducts({ search: unmappedSearch || undefined }),
    ])

    if (!hsnRes.ok) setError(hsnRes.error)
    if (!slabRes.ok) setError(slabRes.error)
    if (!mapRes.ok) setError(mapRes.error)
    if (!unmappedRes.ok) setError(unmappedRes.error)

    setHsnRows((hsnRes.data as { data?: Row[] })?.data || [])
    setSlabRows((slabRes.data as { data?: Row[] })?.data || [])
    setMappingRows((mapRes.data as { data?: Row[] })?.data || [])
    setUnmappedRows((unmappedRes.data as { data?: Row[] })?.data || [])

    setLoading(false)
  }

  useEffect(() => {
    void refreshAll()
  }, [])

  const stats = useMemo(
    () => ({
      hsnCount: hsnRows.length,
      slabCount: slabRows.length,
      mappedCount: mappingRows.length,
      unmappedCount: unmappedRows.length,
    }),
    [hsnRows, slabRows, mappingRows, unmappedRows]
  )

  async function onSubmitHsn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    const res = await upsertHsnCode(hsnForm)
    if (res.ok) {
      setResult(res.data)
      setHsnForm(initialHsn)
      await refreshAll()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onSubmitSlab(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    const res = await upsertTaxSlab({
      ...slabForm,
      taxRate: Number(slabForm.taxRate),
      cessRate: Number(slabForm.cessRate),
    })
    if (res.ok) {
      setResult(res.data)
      setSlabForm(initialSlab)
      await refreshAll()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onSubmitAssignment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    const res = await assignSlabToHsn({
      ...assignmentForm,
      effectiveFrom: assignmentForm.effectiveFrom || null,
      effectiveTo: assignmentForm.effectiveTo || null,
      priority: Number(assignmentForm.priority),
    })
    if (res.ok) {
      setResult(res.data)
      setAssignmentForm(initialAssignment)
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onSubmitMapping(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    const res = await upsertProductTaxMapping({
      ...mappingForm,
      shopifyVariantId: mappingForm.shopifyVariantId || null,
      effectiveFrom: mappingForm.effectiveFrom || null,
      effectiveTo: mappingForm.effectiveTo || null,
    })
    if (res.ok) {
      setResult(res.data)
      setMappingForm(initialMapping)
      await refreshAll()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onDeleteHsn(id: string) {
    setLoading(true)
    setError(undefined)
    const res = await deleteHsnCode(id)
    if (res.ok) {
      setResult(res.data)
      await refreshAll()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onDeleteSlab(id: string) {
    setLoading(true)
    setError(undefined)
    const res = await deleteTaxSlab(id)
    if (res.ok) {
      setResult(res.data)
      await refreshAll()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { label: 'HSN Codes', value: stats.hsnCount },
            { label: 'Tax Slabs', value: stats.slabCount },
            { label: 'Mappings', value: stats.mappedCount },
            { label: 'Unmapped', value: stats.unmappedCount },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{item.label}</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">HSN Codes</h2>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" onClick={() => void refreshAll()}>
              Refresh
            </button>
          </div>
          <form onSubmit={onSubmitHsn} className="grid gap-3 md:grid-cols-5">
            <input className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="HSN Code" value={hsnForm.hsnCode} onChange={(e) => setHsnForm((p) => ({ ...p, hsnCode: e.target.value }))} />
            <input className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm md:col-span-2" placeholder="Description" value={hsnForm.description} onChange={(e) => setHsnForm((p) => ({ ...p, description: e.target.value }))} />
            <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm">
              <input type="checkbox" checked={hsnForm.isService} onChange={(e) => setHsnForm((p) => ({ ...p, isService: e.target.checked }))} /> Service
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">{hsnForm.id ? 'Update' : 'Create'}</button>
              <button type="button" className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm" onClick={() => setHsnForm(initialHsn)}>Clear</button>
            </div>
          </form>

          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">HSN</th><th className="px-3 py-2">Description</th><th className="px-3 py-2">Service</th><th className="px-3 py-2">Active</th><th className="px-3 py-2">Actions</th></tr></thead>
              <tbody>
                {hsnRows.map((row) => {
                  const id = String(row.id || '')
                  return (
                    <tr key={id} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium">{String(row.hsnCode || '')}</td>
                      <td className="px-3 py-2">{String(row.description || '')}</td>
                      <td className="px-3 py-2">{Boolean(row.isService) ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2">{Boolean(row.isActive) ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2"><div className="flex gap-2"><button className="rounded-lg border border-gray-300 px-2.5 py-1" onClick={() => setHsnForm({ id, hsnCode: String(row.hsnCode || ''), description: String(row.description || ''), isService: Boolean(row.isService), isActive: Boolean(row.isActive) })}>Edit</button><button className="rounded-lg border border-red-200 px-2.5 py-1 text-red-700" onClick={() => void onDeleteHsn(id)}>Delete</button></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">GST Tax Slabs</h2>
          <form onSubmit={onSubmitSlab} className="mt-4 grid gap-3 md:grid-cols-5">
            <input className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Slab Code" value={slabForm.slabCode} onChange={(e) => setSlabForm((p) => ({ ...p, slabCode: e.target.value.toUpperCase() }))} />
            <input className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" type="number" step="0.01" placeholder="Tax Rate" value={slabForm.taxRate} onChange={(e) => setSlabForm((p) => ({ ...p, taxRate: e.target.value }))} />
            <input className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" type="number" step="0.01" placeholder="Cess Rate" value={slabForm.cessRate} onChange={(e) => setSlabForm((p) => ({ ...p, cessRate: e.target.value }))} />
            <label className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm"><input type="checkbox" checked={slabForm.isActive} onChange={(e) => setSlabForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active</label>
            <div className="flex gap-2"><button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">{slabForm.id ? 'Update' : 'Create'}</button><button type="button" className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm" onClick={() => setSlabForm(initialSlab)}>Clear</button></div>
          </form>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">Code</th><th className="px-3 py-2">Tax %</th><th className="px-3 py-2">Cess %</th><th className="px-3 py-2">Active</th><th className="px-3 py-2">Actions</th></tr></thead>
              <tbody>
                {slabRows.map((row) => {
                  const id = String(row.id || '')
                  return (
                    <tr key={id} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium">{String(row.slabCode || '')}</td>
                      <td className="px-3 py-2">{String(row.taxRate || '')}</td>
                      <td className="px-3 py-2">{String(row.cessRate || '')}</td>
                      <td className="px-3 py-2">{Boolean(row.isActive) ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2"><div className="flex gap-2"><button className="rounded-lg border border-gray-300 px-2.5 py-1" onClick={() => setSlabForm({ id, slabCode: String(row.slabCode || ''), taxRate: String(row.taxRate || ''), cessRate: String(row.cessRate || ''), isActive: Boolean(row.isActive) })}>Edit</button><button className="rounded-lg border border-red-200 px-2.5 py-1 text-red-700" onClick={() => void onDeleteSlab(id)}>Delete</button></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <form onSubmit={onSubmitAssignment} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Assign Slab to HSN</h2>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={assignmentForm.hsnId} onChange={(e) => setAssignmentForm((p) => ({ ...p, hsnId: e.target.value }))}>
              <option value="">Select HSN</option>
              {hsnRows.map((row) => (<option key={String(row.id)} value={String(row.id)}>{String(row.hsnCode)} - {String(row.description)}</option>))}
            </select>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={assignmentForm.slabId} onChange={(e) => setAssignmentForm((p) => ({ ...p, slabId: e.target.value }))}>
              <option value="">Select Slab</option>
              {slabRows.map((row) => (<option key={String(row.id)} value={String(row.id)}>{String(row.slabCode)} ({String(row.taxRate)}%)</option>))}
            </select>
            <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" type="number" placeholder="Priority" value={assignmentForm.priority} onChange={(e) => setAssignmentForm((p) => ({ ...p, priority: e.target.value }))} />
            <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">Assign</button>
          </form>

          <form onSubmit={onSubmitMapping} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Product / Variant Mapping</h2>
            <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Shopify Product ID" value={mappingForm.shopifyProductId} onChange={(e) => setMappingForm((p) => ({ ...p, shopifyProductId: e.target.value }))} />
            <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Shopify Variant ID (optional)" value={mappingForm.shopifyVariantId} onChange={(e) => setMappingForm((p) => ({ ...p, shopifyVariantId: e.target.value }))} />
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={mappingForm.hsnId} onChange={(e) => setMappingForm((p) => ({ ...p, hsnId: e.target.value }))}>
              <option value="">Select HSN</option>
              {hsnRows.map((row) => (<option key={String(row.id)} value={String(row.id)}>{String(row.hsnCode)}</option>))}
            </select>
            <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={mappingForm.slabId} onChange={(e) => setMappingForm((p) => ({ ...p, slabId: e.target.value }))}>
              <option value="">Select Slab</option>
              {slabRows.map((row) => (<option key={String(row.id)} value={String(row.id)}>{String(row.slabCode)}</option>))}
            </select>
            <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">Save Mapping</button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">Unmapped Products</h2>
            <div className="flex gap-2">
              <input className="rounded-xl border border-gray-300 px-3 py-2 text-sm" placeholder="Search" value={unmappedSearch} onChange={(e) => setUnmappedSearch(e.target.value)} />
              <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm" onClick={() => void refreshAll()}>Refresh</button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">Product ID</th><th className="px-3 py-2">Variant ID</th><th className="px-3 py-2">Title</th><th className="px-3 py-2">SKU</th></tr></thead>
              <tbody>
                {unmappedRows.map((row, idx) => (
                  <tr key={`${String(row.shopifyProductId || '')}-${idx}`} className="border-t border-gray-100">
                    <td className="px-3 py-2">{String(row.shopifyProductId || '')}</td>
                    <td className="px-3 py-2">{String(row.shopifyVariantId || '—')}</td>
                    <td className="px-3 py-2">{String(row.title || '')}</td>
                    <td className="px-3 py-2">{String(row.sku || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Existing Product Tax Mappings</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">Product ID</th><th className="px-3 py-2">Variant ID</th><th className="px-3 py-2">HSN</th><th className="px-3 py-2">Slab</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Validated</th></tr></thead>
              <tbody>
                {mappingRows.map((row) => (
                  <tr key={String(row.id || '')} className="border-t border-gray-100">
                    <td className="px-3 py-2">{String(row.shopifyProductId || '')}</td>
                    <td className="px-3 py-2">{String(row.shopifyVariantId || '—')}</td>
                    <td className="px-3 py-2">{String(row.hsnId || '')}</td>
                    <td className="px-3 py-2">{String(row.slabId || '')}</td>
                    <td className="px-3 py-2">{String(row.status || '')}</td>
                    <td className="px-3 py-2">{prettyDate(row.lastValidatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <GstResponseViewer title="Products API Response" data={result} error={error} />
    </div>
  )
}
