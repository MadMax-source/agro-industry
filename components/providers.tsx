'use client'

import { useEffect, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from '@/components/ui/sonner'
import { useCatalogStore } from '@/store/catalog-store'

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCatalogStore.persist.rehydrate()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <Toaster position="top-center" richColors />
    </MotionConfig>
  )
}
