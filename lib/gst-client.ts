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
export const createExport = (payload: Record<string, unknown>) => request<{ ok: boolean; export: Record<string, unknown> }>('/api/gst/exports', { method: 'POST', body: JSON.stringify(payload) })
export const listExports = () => request<{ ok: boolean; exports: Array<Record<string, unknown>> }>('/api/gst/exports')
export const getPdfPayload = (id: string) => request<{ ok: boolean; pdf: Record<string, unknown> }>(`/api/gst/documents/${id}/pdf`)
