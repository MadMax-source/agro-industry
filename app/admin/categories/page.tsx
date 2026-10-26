import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AdminCategories } from '@/components/admin/admin-categories'

export const metadata: Metadata = { title: 'Categories' }

export default function AdminCategoriesPage() {
  return (
    <Suspense>
      <AdminCategories />
    </Suspense>
  )
}
