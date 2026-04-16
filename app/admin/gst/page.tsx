import Link from 'next/link'
import { GstShell } from '../../../components/gst/gst-shell'

const cards = [
  { href: '/admin/gst/settings', title: 'Settings', description: 'Manage active GST registration and numbering prefixes.' },
  { href: '/admin/gst/invoice-preview', title: 'Invoice', description: 'Preview and create draft tax invoices.' },
  { href: '/admin/gst/note-preview', title: 'Notes', description: 'Preview and create draft credit/debit notes.' },
  { href: '/admin/gst/documents', title: 'Documents', description: 'Browse GST documents and open full document details.' },
  { href: '/admin/gst/products', title: 'Products', description: 'Manage HSN, GST slabs, assignments, and product mappings.' },
  { href: '/admin/gst/orders', title: 'Orders', description: 'List imported GST orders and inspect readiness status.' },
  { href: '/admin/gst/templates', title: 'Templates', description: 'Manage GST invoice templates and preview payloads.' },
  { href: '/admin/gst/exports', title: 'Exports', description: 'Generate GST export batches and review history.' },
  { href: '/admin/gst/reconcile', title: 'Reconcile', description: 'Run reconciliation and inspect run summaries.' },
]

export default function GstAdminPage() {
  return (
    <GstShell title="GST Operations Console" subtitle="Production-oriented internal GST operations dashboard.">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">GST module is isolated and additive. This console orchestrates GST APIs only and does not alter non-GST order, checkout, wallet, or exchange flows.</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-xl border p-4 hover:bg-gray-50">
              <h2 className="font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </GstShell>
  )
}
