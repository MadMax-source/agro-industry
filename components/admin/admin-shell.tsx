'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Loader2, Menu } from 'lucide-react'
import { useAdminAuth } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { BrandLogo } from '@/components/layout/brand-logo'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { status, load } = useAdminAuth()
  const { loading: catalogLoading, error: catalogError, refresh } = useAdminCatalog()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isLogin = pathname === '/admin/login'

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (status === 'anonymous' && !isLogin) router.replace('/admin/login')
  }, [status, isLogin, router])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  if (isLogin) return <>{children}</>

  if (status !== 'authenticated') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Loading admin" />
      </div>
    )
  }

  if (catalogLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/40">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Loading catalogue" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh bg-muted/40">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-card lg:block">
        <AdminSidebar pathname={pathname} />
      </aside>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar pathname={pathname} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex size-10 items-center justify-center rounded-lg hover:bg-secondary"
          >
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Open admin menu</span>
          </button>
          <BrandLogo />
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">
            {catalogError ? (
              <div role="alert" className="flex items-center justify-between gap-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
                <p className="text-destructive">{catalogError}</p>
                <button type="button" onClick={() => void refresh()} className="shrink-0 font-semibold underline">
                  Retry
                </button>
              </div>
            ) : null}
            {!catalogError && (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
