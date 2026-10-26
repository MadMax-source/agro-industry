'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Search, X } from 'lucide-react'
import { BrandLogo } from '@/components/layout/brand-logo'
import { CategoriesMenu } from '@/components/layout/categories-menu'
import { HeaderSearch } from '@/components/layout/header-search'
import { MobileNav } from '@/components/layout/mobile-nav'
import { WhatsAppChatButton } from '@/components/shared/whatsapp-chat-button'
import { cn } from '@/lib/utils'

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSearchOpen(false)
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-shadow',
        scrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:h-18 lg:px-8">
        <BrandLogo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <NavItem href="/" label="Home" active={isActivePath(pathname, '/')} />
          <NavItem href="/products" label="Products" active={isActivePath(pathname, '/products')} />
          <CategoriesMenu active={pathname.startsWith('/categories')} />
          <NavItem href="/about" label="About" active={isActivePath(pathname, '/about')} />
          <NavItem href="/contact" label="Contact" active={isActivePath(pathname, '/contact')} />
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            className="flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
          >
            {searchOpen ? <X className="size-5" aria-hidden="true" /> : <Search className="size-5" aria-hidden="true" />}
            <span className="sr-only">{searchOpen ? 'Close search' : 'Search products'}</span>
          </button>

          <WhatsAppChatButton className="hidden h-10 bg-primary px-4 text-sm text-primary-foreground hover:bg-primary/90 sm:inline-flex" />

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            id="header-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border bg-background"
          >
            <HeaderSearch onSubmitted={() => setSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </header>
  )
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
        active ? 'text-primary' : 'text-foreground/80',
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-underline"
          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
