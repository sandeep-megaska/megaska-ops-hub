'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/admin/gst', label: 'Overview' },
  { href: '/admin/gst/settings', label: 'Settings' },
  { href: '/admin/gst/invoice-preview', label: 'Invoice Preview' },
  { href: '/admin/gst/note-preview', label: 'Note Preview' },
  { href: '/admin/gst/reconcile', label: 'Reconcile' },
]

export function GstShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const enabled = process.env.NEXT_PUBLIC_ENABLE_GST_UI === 'true'
  const mode = process.env.NEXT_PUBLIC_GST_UI_MODE || 'disabled'

  if (!enabled) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">GST UI disabled</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enable NEXT_PUBLIC_ENABLE_GST_UI to access test-only GST screens.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Test-only GST console. No auto order hooks. No live-store dependency.
            </p>
          </div>
          <div className="rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Mode: {mode}
          </div>
        </div>
      </div>

      <nav className="flex flex-wrap gap-2">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl border px-4 py-2 text-sm ${
                active ? 'font-semibold' : ''
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="rounded-2xl border p-5">{children}</div>
    </div>
  )
}
