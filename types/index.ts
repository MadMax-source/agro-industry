export type ProductStatus = 'published' | 'draft'

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type AvailabilityFilter = 'all' | 'available' | 'out-of-stock'

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest'

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  isActive: boolean
  displayOrder: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string
  description: string
  brand: string
  categoryId: string
  activeIngredient?: string
  formulation?: string
  manufacturer?: string
  packSize: string
  price: number
  stock: number
  sku?: string
  images: string[]
  video?: string
  usageInfo: string
  safetyInfo?: string
  storageInfo?: string
  featured: boolean
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export interface BusinessSettings {
  businessName: string
  tagline: string
  whatsappNumber: string
  contactPhone: string
  contactEmail: string
  location: string
  address: string
  businessHours: string
  footerDescription: string
  whatsappGreeting: string
  whatsappTemplate: string
}

export type CategoryDeletionStrategy =
  | { type: 'reassign'; targetCategoryId: string }
  | { type: 'unpublish' }

export interface CatalogFilters {
  query: string
  categoryId: string
  availability: AvailabilityFilter
  sort: SortOption
}
