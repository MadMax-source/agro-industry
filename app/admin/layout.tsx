import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/admin-shell'
import { AdminCatalogProvider } from '@/contexts/admin-catalog-context'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin · The Funalom Enterprise' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminCatalogProvider>
      <AdminShell>{children}</AdminShell>
    </AdminCatalogProvider>
  )
}
