'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import type { CatalogFilters as Filters } from '@/types'
import { DEFAULT_FILTERS, filterProducts } from '@/lib/catalog'
import { useCategoryLookup, usePublicCategories, usePublicProducts } from '@/hooks/use-storefront'
import { CatalogFilters } from '@/components/products/catalog-filters'
import { ProductCard } from '@/components/products/product-card'
import { EmptyState } from '@/components/shared/empty-state'

interface ProductCatalogProps {
  initialQuery?: string
  initialCategoryId?: string
  /** Locks the catalogue to a single category (used on category pages). */
  lockedCategoryId?: string
}

export function ProductCatalog({ initialQuery = '', initialCategoryId, lockedCategoryId }: ProductCatalogProps) {
  const products = usePublicProducts()
  const categories = usePublicCategories()
  const categoryLookup = useCategoryLookup()

  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    query: initialQuery,
    categoryId: lockedCategoryId ?? initialCategoryId ?? 'all',
  })
  const deferredFilters = useDeferredValue(filters)

  const results = useMemo(() => filterProducts(products, deferredFilters), [products, deferredFilters])
  const isFiltered =
    filters.query !== '' ||
    filters.availability !== 'all' ||
    (!lockedCategoryId && filters.categoryId !== 'all')

  const resetFilters = () =>
    setFilters({ ...DEFAULT_FILTERS, categoryId: lockedCategoryId ?? 'all', sort: filters.sort })

  return (
    <div className="flex flex-col gap-6">
      <CatalogFilters
        filters={filters}
        categories={categories}
        hideCategory={!!lockedCategoryId}
        onChange={(next) => setFilters((current) => ({ ...current, ...next }))}
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">
          Showing <span className="font-semibold text-foreground">{results.length}</span>{' '}
          {results.length === 1 ? 'product' : 'products'}
        </p>
        {isFiltered && (
          <button type="button" onClick={resetFilters} className="font-semibold text-primary hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product, index) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                category={categoryLookup.get(product.categoryId)}
                priority={index < 2}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={isFiltered ? 'No products match your search' : 'No products available yet'}
          description={
            isFiltered
              ? 'Try a different product name, brand, or active ingredient, or clear your filters. You can also ask us on WhatsApp for what you need.'
              : 'We are updating this section. Please check back soon or contact us on WhatsApp for availability.'
          }
          action={
            isFiltered ? (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}
    </div>
  )
}
