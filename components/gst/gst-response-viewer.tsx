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
        <div className="rounded-xl border p-4 text-sm">
          <div className="font-medium">Error</div>
          <div className="mt-2 whitespace-pre-wrap break-words">{error}</div>
        </div>
      ) : null}
      {data ? (
        <pre className="overflow-x-auto rounded-xl border p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
      ) : null}
    </div>
  )
}
