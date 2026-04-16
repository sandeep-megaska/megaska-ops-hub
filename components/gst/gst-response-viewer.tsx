'use client'

import { useState } from 'react'

export function GstResponseViewer({
  title,
  data,
  error,
}: {
  title: string
  data?: any
  error?: string
}) {
  const [tab, setTab] = useState<'summary' | 'json'>('summary')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <div className="font-semibold">Request Failed</div>
          <div className="mt-2 text-sm">{error}</div>
        </div>
      )}

      {/* Success */}
      {data && (
        <div className="space-y-3">
          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-green-800">
            Success
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              className={`rounded px-3 py-1 text-sm ${
                tab === 'summary' ? 'bg-black text-white' : 'border'
              }`}
              onClick={() => setTab('summary')}
            >
              Summary
            </button>
            <button
              className={`rounded px-3 py-1 text-sm ${
                tab === 'json' ? 'bg-black text-white' : 'border'
              }`}
              onClick={() => setTab('json')}
            >
              JSON
            </button>
          </div>

          {/* Summary */}
          {tab === 'summary' && (
            <div className="rounded-xl border bg-white p-4 text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {/* JSON */}
          {tab === 'json' && (
            <pre className="overflow-x-auto rounded-xl border bg-gray-50 p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </div>
      )}

      {!error && !data && (
        <p className="text-sm text-gray-500">No response yet.</p>
      )}
    </div>
  )
}
