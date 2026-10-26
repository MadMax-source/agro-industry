'use client'

import Link from 'next/link'
import { useHasHydrated, usePublicCategories } from '@/hooks/use-storefront'
import { PageHeader } from '@/components/layout/page-header'
import { ProductCatalog } from '@/components/products/product-catalog'
import { NotFoundState } from '@/components/shared/not-found-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'

export function CategoryView({ slug }: { slug: string }) {
  const categories = usePublicCategories()
  const hasHydrated = useHasHydrated()
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    if (!hasHydrated) return <PageSkeleton />
    return (
      <NotFoundState
        title="Category not found"
        description="This category may have been renamed or is no longer available."
        action={{ href: '/products', label: 'Browse all products' }}
      />
    )
  }

  return (
    <>
      <PageHeader
        title={category.name}
        description={category.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Other categories" className="-mx-4 mb-6 overflow-x-auto px-4 pb-1">
          <ul className="flex w-max gap-2">
            {categories.map((c) => {
              const active = c.id === category.id
              return (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={
                      active
                        ? 'inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground'
                        : 'inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary'
                    }
                  >
                    {c.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <ProductCatalog key={category.id} lockedCategoryId={category.id} />
      </div>
    </>
  )
}
