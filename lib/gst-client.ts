export type ApiResult<T> = {
  ok: boolean
  status: number
  data?: T
  error?: string
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    })

    const contentType = res.headers.get('content-type') || ''
    const body = contentType.includes('application/json') ? await res.json() : await res.text()

    if (!res.ok) {
      return { ok: false, status: res.status, error: typeof body === 'string' ? body : body?.error || 'Request failed' }
    }

    return { ok: true, status: res.status, data: body as T }
  } catch (error) {
    return { ok: false, status: 500, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const getGstSettings = () => request<{ ok: boolean; settings: Record<string, unknown> }>('/api/gst/settings')
export const createOrUpdateGstSettings = (payload: Record<string, unknown>) => request<{ ok: boolean; settings: Record<string, unknown> }>('/api/gst/settings', { method: 'POST', body: JSON.stringify(payload) })

export const createInvoiceDraft = (payload: Record<string, unknown>) => request<{ ok: boolean; invoice: Record<string, unknown> }>('/api/gst/invoices/draft', { method: 'POST', body: JSON.stringify(payload) })
export const getInvoiceById = (id: string) => request<{ ok: boolean; invoice: Record<string, unknown> }>(`/api/gst/invoices/${id}`)

export const createNoteDraft = (payload: Record<string, unknown>) => request<{ ok: boolean; note: Record<string, unknown> }>('/api/gst/notes/draft', { method: 'POST', body: JSON.stringify(payload) })
export const getNoteById = (id: string) => request<{ ok: boolean; note: Record<string, unknown> }>(`/api/gst/notes/${id}`)

export const invoicePreview = (payload: Record<string, unknown>) => request<{ ok: boolean; preview: Record<string, unknown> }>('/api/gst/debug/invoice-preview', { method: 'POST', body: JSON.stringify(payload) })
export const notePreview = (payload: Record<string, unknown>) => request<{ ok: boolean; preview: Record<string, unknown> }>('/api/gst/debug/note-preview', { method: 'POST', body: JSON.stringify(payload) })
export const reconcilePreview = (payload: Record<string, unknown>) => request<{ ok: boolean; comparison: Record<string, unknown> }>('/api/gst/debug/reconcile', { method: 'POST', body: JSON.stringify(payload) })

export const runReconciliation = (payload: Record<string, unknown>) => request<{ ok: boolean; reconciliation: Record<string, unknown> }>('/api/gst/reconciliation/runs', { method: 'POST', body: JSON.stringify(payload) })
export const listReconciliationRuns = () => request<{ ok: boolean; runs: Array<Record<string, unknown>> }>('/api/gst/reconciliation/runs')
export const createExport = (payload: Record<string, unknown>) => request<{ ok: boolean; export: Record<string, unknown> }>('/api/gst/exports', { method: 'POST', body: JSON.stringify(payload) })
export const listExports = () => request<{ ok: boolean; exports: Array<Record<string, unknown>> }>('/api/gst/exports')
export const listDocuments = (query: { documentType?: string; status?: string; search?: string } = {}) => {
  const params = new URLSearchParams()
  if (query.documentType) params.set('documentType', query.documentType)
  if (query.status) params.set('status', query.status)
  if (query.search) params.set('search', query.search)
  const search = params.toString()
  return request<{ ok: boolean; documents: Array<Record<string, unknown>> }>(`/api/gst/documents${search ? `?${search}` : ''}`)
}
export const getDocumentById = (id: string) => request<{ ok: boolean; document: Record<string, unknown> }>(`/api/gst/documents/${id}`)
export const getPdfPayload = (id: string) => request<{ ok: boolean; pdf: Record<string, unknown> }>(`/api/gst/documents/${id}/pdf`)

export const createReportRun = (payload: Record<string, unknown>) => request<{ ok: boolean; run: Record<string, unknown> }>('/api/gst/reports/runs', { method: 'POST', body: JSON.stringify(payload) })
export const listReportRuns = (query: { reportType?: string; status?: string } = {}) => {
  const search = new URLSearchParams()
  if (query.reportType) search.set('reportType', query.reportType)
  if (query.status) search.set('status', query.status)
  const suffix = search.toString() ? `?${search.toString()}` : ''
  return request<{ ok: boolean; runs: Array<Record<string, unknown>> }>(`/api/gst/reports/runs${suffix}`)
}
export const downloadReportRunFile = (id: string) => request<{ ok: boolean; fileUrl: string | null }>(`/api/gst/reports/runs/${id}/download`)
