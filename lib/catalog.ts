import type {
  CatalogFilters,
  Category,
  Product,
  SortOption,
  StockStatus,
} from '@/types'
import { LOW_STOCK_THRESHOLD } from '@/lib/config'

const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatNaira(amount: number): string {
  return nairaFormatter.format(Number.isFinite(amount) ? amount : 0)
}

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out-of-stock'
  if (stock <= LOW_STOCK_THRESHOLD) return 'low-stock'
  return 'in-stock'
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

export function getPublicCategories(categories: Category[]): Category[] {
  return categories
    .filter((category) => category.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
}

/** Public visitors only see published products whose category exists and is active. */
export function getPublicProducts(products: Product[], categories: Category[]): Product[] {
  const activeIds = new Set(categories.filter((c) => c.isActive).map((c) => c.id))
  return products.filter((p) => p.status === 'published' && activeIds.has(p.categoryId))
}

export function countProductsByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] ?? 0) + 1
    return acc
  }, {})
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Price Low–High' },
  { value: 'price-desc', label: 'Price High–Low' },
  { value: 'newest', label: 'Newest' },
]

export const DEFAULT_FILTERS: CatalogFilters = {
  query: '',
  categoryId: 'all',
  availability: 'all',
  sort: 'name-asc',
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    case 'name-asc':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const query = filters.query.trim().toLowerCase()

  const filtered = products.filter((product) => {
    if (filters.categoryId !== 'all' && product.categoryId !== filters.categoryId) return false

    const status = getStockStatus(product.stock)
    if (filters.availability === 'available' && status === 'out-of-stock') return false
    if (filters.availability === 'out-of-stock' && status !== 'out-of-stock') return false

    if (!query) return true
    return [product.name, product.brand, product.activeIngredient ?? '']
      .join(' ')
      .toLowerCase()
      .includes(query)
  })

  return sortProducts(filtered, filters.sort)
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
