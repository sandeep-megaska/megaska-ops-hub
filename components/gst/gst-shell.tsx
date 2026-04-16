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

export function GstShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            TEST MODE
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-white px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm transition ${
                pathname === item.href
                  ? 'bg-black text-white'
                  : 'border bg-white hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mx-auto max-w-6xl space-y-6">{children}</div>
      </div>
    </div>
  )
}
