'use client'

export function GstResponseViewer({
  title,
  data,
  error,
}: {
  title: string
  data?: unknown
  error?: string
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="font-medium">Request failed</div>
          <div className="mt-2 whitespace-pre-wrap break-words">{error}</div>
        </div>
      ) : null}
      {data ? (
        <div className="space-y-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Success</div>
          <pre className="overflow-x-auto rounded-xl border bg-gray-50 p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : null}
      {!error && !data ? <p className="text-sm text-gray-500">No response yet.</p> : null}
    </div>
  )
}
