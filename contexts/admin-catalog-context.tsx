'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import type { BusinessSettings, Category, CategoryDeletionStrategy, Product } from '@/types'

interface CatalogResponse {
  products: Product[]
  categories: Category[]
  settings: BusinessSettings | null
}

interface AdminCatalogContextValue extends CatalogResponse {
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  saveProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  saveCategory: (category: Category) => Promise<void>
  setCategoryActive: (id: string, isActive: boolean) => Promise<void>
  deleteCategory: (id: string, strategy?: CategoryDeletionStrategy) => Promise<void>
  updateSettings: (settings: Partial<BusinessSettings>) => Promise<void>
  uploadMedia: (file: File, folder: 'products' | 'categories', mediaType?: 'image' | 'video') => Promise<string>
}

const AdminCatalogContext = createContext<AdminCatalogContextValue | null>(null)

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const result: unknown = await response.json()

  if (!response.ok) {
    const message =
      result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
        ? result.error
        : `Request failed with status ${response.status}.`
    throw new Error(message)
  }

  return result as T
}

export function AdminCatalogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(pathname !== '/admin/login')
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const catalog = await requestJson<CatalogResponse>('/api/admin/bootstrap', { cache: 'no-store' })
      setProducts(catalog.products)
      setCategories(catalog.categories)
      setSettings(catalog.settings)
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unable to load the admin catalogue.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false)
      return
    }
    void refresh()
  }, [pathname, refresh])

  const saveProduct = useCallback(async (product: Product) => {
    const exists = products.some((item) => item.id === product.id)
    const result = await requestJson<{ product: Product }>(
      exists ? `/api/admin/products/${encodeURIComponent(product.id)}` : '/api/admin/products',
      {
        method: exists ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      },
    )
    setProducts((current) => {
      const remaining = current.filter((item) => item.id !== result.product.id)
      return [...remaining, result.product]
    })
  }, [products])

  const deleteProduct = useCallback(async (id: string) => {
    await requestJson<{ success: true }>(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
    setProducts((current) => current.filter((product) => product.id !== id))
  }, [])

  const saveCategory = useCallback(async (category: Category) => {
    const exists = categories.some((item) => item.id === category.id)
    const result = await requestJson<{ category: Category }>(
      exists ? `/api/admin/categories/${encodeURIComponent(category.id)}` : '/api/admin/categories',
      {
        method: exists ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      },
    )
    setCategories((current) => {
      const remaining = current.filter((item) => item.id !== result.category.id)
      return [...remaining, result.category].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      )
    })
  }, [categories])

  const setCategoryActive = useCallback(async (id: string, isActive: boolean) => {
    const category = categories.find((item) => item.id === id)
    if (!category) throw new Error('Category not found.')
    await saveCategory({ ...category, isActive, updatedAt: new Date().toISOString() })
  }, [categories, saveCategory])

  const deleteCategory = useCallback(async (id: string, strategy: CategoryDeletionStrategy = { type: 'unpublish' }) => {
    await requestJson<{ success: true }>(`/api/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategy }),
    })
    const updatedAt = new Date().toISOString()
    setCategories((current) => current.filter((category) => category.id !== id))
    setProducts((current) => current.map((product) => {
      if (product.categoryId !== id) return product
      return strategy.type === 'reassign'
        ? { ...product, categoryId: strategy.targetCategoryId, updatedAt }
        : { ...product, categoryId: '', status: 'draft', updatedAt }
    }))
  }, [])

  const updateSettings = useCallback(async (update: Partial<BusinessSettings>) => {
    const result = await requestJson<{ settings: BusinessSettings }>('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    setSettings(result.settings)
  }, [])

  const uploadMedia = useCallback(async (
    file: File,
    folder: 'products' | 'categories',
    mediaType: 'image' | 'video' = 'image',
  ) => {
    const formData = new FormData()
    formData.set('file', file)
    formData.set('folder', folder)
    formData.set('mediaType', mediaType)
    const result = await requestJson<{ url: string }>('/api/upload', { method: 'POST', body: formData })
    return result.url
  }, [])

  const value = useMemo<AdminCatalogContextValue>(() => ({
    products,
    categories,
    settings,
    loading,
    error,
    refresh,
    saveProduct,
    deleteProduct,
    saveCategory,
    setCategoryActive,
    deleteCategory,
    updateSettings,
    uploadMedia,
  }), [
    products, categories, settings, loading, error, refresh, saveProduct, deleteProduct,
    saveCategory, setCategoryActive, deleteCategory, updateSettings, uploadMedia,
  ])

  return <AdminCatalogContext.Provider value={value}>{children}</AdminCatalogContext.Provider>
}

export function useAdminCatalog() {
  const context = useContext(AdminCatalogContext)
  if (!context) throw new Error('useAdminCatalog must be used within an AdminCatalogProvider.')
  return context
}
