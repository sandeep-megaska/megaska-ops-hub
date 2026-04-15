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
    const body = contentType.includes('application/json')
      ? await res.json()
      : await res.text()

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof body === 'string' ? body : body?.error || 'Request failed',
      }
    }

    return {
      ok: true,
      status: res.status,
      data: body as T,
    }
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getGstSettings() {
  return request('/api/gst/settings')
}

export async function createOrUpdateGstSettings(payload: Record<string, unknown>) {
  return request('/api/gst/settings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function invoicePreview(payload: Record<string, unknown>) {
  return request('/api/gst/debug/invoice-preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function notePreview(payload: Record<string, unknown>) {
  return request('/api/gst/debug/note-preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function reconcilePreview(payload: Record<string, unknown>) {
  return request('/api/gst/debug/reconcile', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
