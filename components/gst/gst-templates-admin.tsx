'use client'

import { useState, type FormEvent } from 'react'
import {
  createTemplate,
  listTemplates,
  previewTemplate,
  setDefaultTemplate,
  updateTemplate,
} from '../../lib/gst-client'
import { GstResponseViewer } from './gst-response-viewer'

type Row = Record<string, unknown>

const initialTemplate = {
  id: '',
  templateName: '',
  isDefault: false,
  isActive: true,
  headerText: '',
  footerText: '',
  declarationText: '',
  notesText: '',
  logoFileUrl: '',
  themeConfigText: '{}',
}

export function GstTemplatesAdmin() {
  const [rows, setRows] = useState<Row[]>([])
  const [gstSettingsId, setGstSettingsId] = useState('')
  const [templateForm, setTemplateForm] = useState(initialTemplate)
  const [previewTemplateId, setPreviewTemplateId] = useState('')
  const [previewOrderImportId, setPreviewOrderImportId] = useState('')
  const [previewOverridesText, setPreviewOverridesText] = useState('{}')
  const [result, setResult] = useState<unknown>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  async function runList() {
    setLoading(true)
    setError(undefined)
    const res = await listTemplates({ gstSettingsId: gstSettingsId || undefined })
    if (res.ok) {
      const nextRows = (res.data as { templates?: Row[] })?.templates || []
      setRows(nextRows)
      setResult(res.data)
      if (nextRows.length > 0 && !previewTemplateId) {
        setPreviewTemplateId(String(nextRows[0].id || ''))
      }
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onSubmitTemplate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    let themeConfig: Record<string, unknown> | null = null
    if (templateForm.themeConfigText.trim()) {
      try {
        themeConfig = JSON.parse(templateForm.themeConfigText) as Record<string, unknown>
      } catch {
        setError('theme config must be valid JSON')
        setLoading(false)
        return
      }
    }

    const payload = {
      gstSettingsId: gstSettingsId || undefined,
      templateName: templateForm.templateName,
      isDefault: templateForm.isDefault,
      isActive: templateForm.isActive,
      headerText: templateForm.headerText || null,
      footerText: templateForm.footerText || null,
      declarationText: templateForm.declarationText || null,
      notesText: templateForm.notesText || null,
      logoFileUrl: templateForm.logoFileUrl || null,
      themeConfig,
    }

    const res = templateForm.id
      ? await updateTemplate(templateForm.id, payload)
      : await createTemplate(payload)

    if (res.ok) {
      setResult(res.data)
      setTemplateForm(initialTemplate)
      await runList()
    } else {
      setError(res.error)
    }

    setLoading(false)
  }

  async function onSetDefault(id: string) {
    setLoading(true)
    setError(undefined)
    const res = await setDefaultTemplate(id)
    if (res.ok) {
      setResult(res.data)
      await runList()
    } else {
      setError(res.error)
    }
    setLoading(false)
  }

  async function onPreview(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(undefined)

    let overrides: Record<string, unknown> | undefined
    if (previewOverridesText.trim()) {
      try {
        overrides = JSON.parse(previewOverridesText) as Record<string, unknown>
      } catch {
        setError('preview overrides must be valid JSON')
        setLoading(false)
        return
      }
    }

    const res = await previewTemplate(previewTemplateId, {
      orderImportId: previewOrderImportId || undefined,
      payloadOverrides: overrides,
    })

    if (res.ok) {
      setResult(res.data)
    } else {
      setError(res.error)
    }

    setLoading(false)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">Template List</h2>
            <button type="button" className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white" onClick={() => void runList()}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="mb-4">
            <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="GST Settings ID (optional)" value={gstSettingsId} onChange={(e) => setGstSettingsId(e.target.value)} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600"><tr><th className="px-3 py-2">Name</th><th className="px-3 py-2">Default</th><th className="px-3 py-2">Active</th><th className="px-3 py-2">Version</th><th className="px-3 py-2">Actions</th></tr></thead>
              <tbody>
                {rows.map((row) => {
                  const id = String(row.id || '')
                  return (
                    <tr key={id} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-medium text-gray-900">{String(row.templateName || '')}</td>
                      <td className="px-3 py-2">{Boolean(row.isDefault) ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2">{Boolean(row.isActive) ? 'Yes' : 'No'}</td>
                      <td className="px-3 py-2">{String(row.version || '')}</td>
                      <td className="px-3 py-2"><div className="flex gap-2"><button type="button" className="rounded-lg border border-gray-300 px-2.5 py-1" onClick={() => setTemplateForm({ id, templateName: String(row.templateName || ''), isDefault: Boolean(row.isDefault), isActive: Boolean(row.isActive), headerText: String(row.headerText || ''), footerText: String(row.footerText || ''), declarationText: String(row.declarationText || ''), notesText: String(row.notesText || ''), logoFileUrl: String(row.logoFileUrl || ''), themeConfigText: JSON.stringify(row.themeConfig || {}, null, 2) })}>Edit</button><button type="button" className="rounded-lg border border-gray-300 px-2.5 py-1" onClick={() => void onSetDefault(id)}>Set Default</button><button type="button" className="rounded-lg border border-gray-300 px-2.5 py-1" onClick={() => setPreviewTemplateId(id)}>Preview Target</button></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={onSubmitTemplate} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">{templateForm.id ? 'Edit Template' : 'Create Template'}</h2>
          <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Template Name" value={templateForm.templateName} onChange={(e) => setTemplateForm((p) => ({ ...p, templateName: e.target.value }))} />
          <textarea className="h-20 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Header Text" value={templateForm.headerText} onChange={(e) => setTemplateForm((p) => ({ ...p, headerText: e.target.value }))} />
          <textarea className="h-20 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Footer Text" value={templateForm.footerText} onChange={(e) => setTemplateForm((p) => ({ ...p, footerText: e.target.value }))} />
          <textarea className="h-20 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Declaration Text" value={templateForm.declarationText} onChange={(e) => setTemplateForm((p) => ({ ...p, declarationText: e.target.value }))} />
          <textarea className="h-20 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Notes Text" value={templateForm.notesText} onChange={(e) => setTemplateForm((p) => ({ ...p, notesText: e.target.value }))} />
          <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Logo URL" value={templateForm.logoFileUrl} onChange={(e) => setTemplateForm((p) => ({ ...p, logoFileUrl: e.target.value }))} />
          <textarea className="h-40 w-full rounded-xl border border-gray-300 px-3 py-2.5 font-mono text-xs" placeholder="Theme Config JSON" value={templateForm.themeConfigText} onChange={(e) => setTemplateForm((p) => ({ ...p, themeConfigText: e.target.value }))} />
          <div className="flex gap-5">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={templateForm.isDefault} onChange={(e) => setTemplateForm((p) => ({ ...p, isDefault: e.target.checked }))} /> Default</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={templateForm.isActive} onChange={(e) => setTemplateForm((p) => ({ ...p, isActive: e.target.checked }))} /> Active</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">{templateForm.id ? 'Update Template' : 'Create Template'}</button>
            <button type="button" className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm" onClick={() => setTemplateForm(initialTemplate)}>Clear</button>
          </div>
        </form>

        <form onSubmit={onPreview} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Template Preview Payload</h2>
          <select className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" value={previewTemplateId} onChange={(e) => setPreviewTemplateId(e.target.value)}>
            <option value="">Select Template ID</option>
            {rows.map((row) => (<option key={String(row.id || '')} value={String(row.id || '')}>{String(row.templateName || row.id || '')}</option>))}
          </select>
          <input className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" placeholder="Order Import ID (optional)" value={previewOrderImportId} onChange={(e) => setPreviewOrderImportId(e.target.value)} />
          <textarea className="h-32 w-full rounded-xl border border-gray-300 px-3 py-2.5 font-mono text-xs" placeholder="Payload Overrides JSON" value={previewOverridesText} onChange={(e) => setPreviewOverridesText(e.target.value)} />
          <button type="submit" className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white">Preview Template</button>
        </form>
      </div>

      <GstResponseViewer title="Templates API Response" data={result} error={error} />
    </div>
  )
}
