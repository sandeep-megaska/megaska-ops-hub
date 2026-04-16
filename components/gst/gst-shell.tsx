'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/admin/gst', label: 'Overview' },
  { href: '/admin/gst/settings', label: 'Settings' },
  { href: '/admin/gst/invoice-preview', label: 'Invoice' },
  { href: '/admin/gst/note-preview', label: 'Notes' },
  { href: '/admin/gst/documents', label: 'Documents' },
  { href: '/admin/gst/exports', label: 'Exports' },
  { href: '/admin/gst/reconcile', label: 'Reconcile' },
]

function getModeLabel(mode: string): string {
  if (mode === 'true' || mode.toLowerCase() === 'test') return 'Test'
  if (mode.toLowerCase() === 'live') return 'Live'
  if (mode.toLowerCase() === 'disabled') return 'Disabled'
  return mode
}

export function GstShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const pathname = usePathname()
  const enabled = process.env.NEXT_PUBLIC_ENABLE_GST_UI === 'true'
  const mode = process.env.NEXT_PUBLIC_GST_UI_MODE || 'disabled'

  if (!enabled) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">GST admin disabled</h1>
        <p className="mt-2 text-sm text-gray-600">Enable NEXT_PUBLIC_ENABLE_GST_UI to access GST admin screens.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-6">
      <header className="rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-gray-600">{subtitle || 'Internal GST console. Business logic is enforced by backend APIs only.'}</p>
          </div>
          <div className="rounded-full border bg-gray-50 px-3 py-1 text-xs font-medium uppercase tracking-wide">Mode: {getModeLabel(mode)}</div>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-2xl border bg-white p-3">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-2 text-sm ${pathname === item.href ? 'bg-black text-white' : 'border'}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="rounded-2xl border bg-white p-5">{children}</section>
    </div>
  )
}
