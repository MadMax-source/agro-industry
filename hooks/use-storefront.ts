'use client'

import { useMemo } from 'react'
import { useCatalogStore } from '@/store/catalog-store'
import { countProductsByCategory, getPublicCategories, getPublicProducts } from '@/lib/catalog'

export function usePublicCategories() {
  const categories = useCatalogStore((s) => s.categories)
  return useMemo(() => getPublicCategories(categories), [categories])
}

export function usePublicProducts() {
  const products = useCatalogStore((s) => s.products)
  const categories = useCatalogStore((s) => s.categories)
  return useMemo(() => getPublicProducts(products, categories), [products, categories])
}

export function useCategoryProductCounts() {
  const products = usePublicProducts()
  return useMemo(() => countProductsByCategory(products), [products])
}

export function useCategoryLookup() {
  const categories = usePublicCategories()
  return useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
}

export function useSettings() {
  return useCatalogStore((s) => s.settings)
}

export function useHasHydrated() {
  return useCatalogStore((s) => s.hasHydrated)
}
