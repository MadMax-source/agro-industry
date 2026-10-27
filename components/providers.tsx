'use client'

import { useEffect, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { useCatalogStore } from '@/store/catalog-store'
import type { BusinessSettings, Category, Product } from '@/types'
import { toast } from 'sonner'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCatalogStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    let active = true

    const loadCatalog = async () => {
      try {
        const response = await fetch('/api/catalog', { cache: 'no-store' })
        const body: unknown = await response.json()
        if (!response.ok) {
          const message =
            body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
              ? body.error
              : `Catalog request failed with status ${response.status}.`
          throw new Error(message)
        }
        if (
          !body ||
          typeof body !== 'object' ||
          !('products' in body) ||
          !('categories' in body) ||
          !('settings' in body)
        ) {
          throw new Error('The catalog response is incomplete.')
        }

        const catalog = body as { products: Product[]; categories: Category[]; settings: BusinessSettings }
        if (!active) return
        useCatalogStore.setState({
          products: catalog.products,
          categories: catalog.categories,
          settings: catalog.settings,
        })
      } catch (error) {
        if (!active) return
        console.error('Unable to load the live catalog:', error)
        toast.error('The live catalogue is unavailable. Showing the demo catalogue for now.')
      }
    }

    void loadCatalog()
    return () => {
      active = false
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster position="top-center" richColors />
    </MotionConfig>
  )
}
