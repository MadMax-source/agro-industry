'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BusinessSettings, Category, CategoryDeletionStrategy, Product } from '@/types'
import { seedCategories, seedProducts, seedSettings } from '@/lib/data/seed'
import { STORAGE_KEY, STORAGE_VERSION } from '@/lib/config'

interface CatalogData {
  products: Product[]
  categories: Category[]
  settings: BusinessSettings
}

interface CatalogState extends CatalogData {
  hasHydrated: boolean
  upsertProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  upsertCategory: (category: Category) => void
  setCategoryActive: (id: string, isActive: boolean) => void
  deleteCategory: (id: string, strategy?: CategoryDeletionStrategy) => void
  updateSettings: (settings: Partial<BusinessSettings>) => void
  resetToDemoData: () => void
}

const seedData = (): CatalogData => ({
  products: structuredClone(seedProducts),
  categories: structuredClone(seedCategories),
  settings: { ...seedSettings },
})

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const exists = items.some((existing) => existing.id === item.id)
  return exists ? items.map((existing) => (existing.id === item.id ? item : existing)) : [...items, item]
}

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object'

function sanitizeProducts(value: unknown): Product[] | null {
  if (!Array.isArray(value)) return null
  return value.filter(
    (p): p is Product =>
      isRecord(p) && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.slug === 'string',
  ).map((p) => ({ ...p, images: Array.isArray(p.images) ? p.images : [], price: Number(p.price) || 0, stock: Number(p.stock) || 0 }))
}

function sanitizeCategories(value: unknown): Category[] | null {
  if (!Array.isArray(value)) return null
  return value.filter(
    (c): c is Category =>
      isRecord(c) && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.slug === 'string',
  )
}

/**
 * Single shared catalogue store used by both the storefront and the admin dashboard.
 * The initial render always uses seed data so server and client markup match;
 * saved LocalStorage data is applied after mount (see components/providers.tsx).
 * To move to a backend, replace these actions with API calls and keep the same shape.
 */
export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      ...seedData(),
      hasHydrated: false,
      upsertProduct: (product) => set((s) => ({ products: upsertById(s.products, product) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upsertCategory: (category) => set((s) => ({ categories: upsertById(s.categories, category) })),
      setCategoryActive: (id, isActive) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, isActive, updatedAt: new Date().toISOString() } : c,
          ),
        })),
      deleteCategory: (id, strategy = { type: 'unpublish' }) =>
        set((s) => {
          const now = new Date().toISOString()
          const products = s.products.map((product) => {
            if (product.categoryId !== id) return product
            if (strategy.type === 'reassign') {
              return { ...product, categoryId: strategy.targetCategoryId, updatedAt: now }
            }
            // Never delete products: detach them and hide them from the public storefront.
            return { ...product, categoryId: '', status: 'draft' as const, updatedAt: now }
          })
          return { products, categories: s.categories.filter((c) => c.id !== id) }
        }),
      updateSettings: (settings) => set((s) => ({ settings: { ...s.settings, ...settings } })),
      resetToDemoData: () => set(seedData()),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ products, categories, settings }) => ({
        products,
        categories,
        settings,
        configWhatsappNumber: seedSettings.whatsappNumber,
      }),
      merge: (persisted, current) => {
        const saved = (isRecord(persisted) ? persisted : {}) as Partial<CatalogData> & {
          configWhatsappNumber?: string
        }
        const savedSettings = isRecord(saved.settings)
          ? { ...current.settings, ...saved.settings }
          : current.settings
        // If the number was never customised in-app, follow the value in lib/config.ts.
        if (saved.settings?.whatsappNumber === saved.configWhatsappNumber) {
          savedSettings.whatsappNumber = seedSettings.whatsappNumber
        }
        return {
          ...current,
          products: sanitizeProducts(saved.products) ?? current.products,
          categories: sanitizeCategories(saved.categories) ?? current.categories,
          settings: savedSettings,
        }
      },
      onRehydrateStorage: () => () => {
        useCatalogStore.setState({ hasHydrated: true })
      },
    },
  ),
)
