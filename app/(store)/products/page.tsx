import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/page-header'
import { ProductCatalog } from '@/components/products/product-catalog'
import { seedCategories } from '@/lib/data/seed'

export const metadata: Metadata = {
  title: 'All Products',
  description:
    'Browse fertilizers, herbicides, pesticides, fungicides, seeds, and farm essentials. Filter by category and availability, then order on WhatsApp.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>
}) {
  const params = await searchParams
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.slice(0, 100) ?? ''
  const categorySlug = Array.isArray(params.category) ? params.category[0] : params.category
  const categoryId = seedCategories.find((c) => c.slug === categorySlug)?.id

  return (
    <>
      <PageHeader
        title="All Products"
        description="Quality agricultural inputs for every stage of the growing season. Search, filter, and order directly on WhatsApp."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductCatalog key={`${query}|${categoryId ?? ''}`} initialQuery={query} initialCategoryId={categoryId} />
      </div>
    </>
  )
}
