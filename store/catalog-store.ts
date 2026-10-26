'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { BusinessSettings, Category, Product } from '@/types'
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
  deleteCategory: (id: string) => void
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

/**
 * Single shared catalogue store for the storefront (and the Phase 2 admin).
 * The initial render always uses seed data so server and client markup match;
 * saved LocalStorage data is applied after mount by <StoreHydrator />.
 * Swap the persist storage for API calls when a backend is introduced.
 */
export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      ...seedData(),
      hasHydrated: false,
      upsertProduct: (product) => set((s) => ({ products: upsertById(s.products, product) })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      upsertCategory: (category) => set((s) => ({ categories: upsertById(s.categories, category) })),
      deleteCategory: (id) => set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
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
        const saved = (persisted ?? {}) as Partial<CatalogData> & { configWhatsappNumber?: string }
        const savedSettings =
          saved.settings && typeof saved.settings === 'object' ? { ...current.settings, ...saved.settings } : current.settings
        // If the number was never customised in-app, follow the value in lib/config.ts.
        if (saved.settings?.whatsappNumber === saved.configWhatsappNumber) {
          savedSettings.whatsappNumber = seedSettings.whatsappNumber
        }
        return {
          ...current,
          products: Array.isArray(saved.products) ? saved.products : current.products,
          categories: Array.isArray(saved.categories) ? saved.categories : current.categories,
          settings: savedSettings,
        }
      },
      onRehydrateStorage: () => () => {
        useCatalogStore.setState({ hasHydrated: true })
      },
    },
  ),
)
