'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, X } from 'lucide-react'
import { BrandLogo } from '@/components/layout/brand-logo'
import { usePublicCategories } from '@/hooks/use-storefront'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  pathname: string
}

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function MobileNav({ open, onClose, pathname }: MobileNavProps) {
  const categories = usePublicCategories()
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-background shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <BrandLogo />
              <button
                type="button"
                onClick={onClose}
                autoFocus
                className="flex size-10 items-center justify-center rounded-lg hover:bg-secondary"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {LINKS.slice(0, 2).map((link) => (
                  <MobileLink key={link.href} {...link} pathname={pathname} onClose={onClose} />
                ))}
                <li>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((value) => !value)}
                    aria-expanded={categoriesOpen}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  >
                    Categories
                    <ChevronDown
                      className={cn('size-4 transition-transform', categoriesOpen && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {categoriesOpen && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-3 overflow-hidden border-l border-border pl-3"
                      >
                        {categories.map((category) => (
                          <li key={category.id}>
                            <Link
                              href={`/categories/${category.slug}`}
                              onClick={onClose}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                {LINKS.slice(2).map((link) => (
                  <MobileLink key={link.href} {...link} pathname={pathname} onClose={onClose} />
                ))}
              </ul>
            </nav>

            <div className="border-t border-border p-4">
              <Link
                href="/products"
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Shop Products
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function MobileLink({
  href,
  label,
  pathname,
  onClose,
}: {
  href: string
  label: string
  pathname: string
  onClose: () => void
}) {
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <li>
      <Link
        href={href}
        onClick={onClose}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary',
          active ? 'bg-secondary text-primary' : 'text-foreground',
        )}
      >
        {label}
      </Link>
    </li>
  )
}
