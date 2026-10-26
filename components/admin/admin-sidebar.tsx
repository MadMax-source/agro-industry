'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ExternalLink, FolderTree, LayoutDashboard, LogOut, Package, Settings } from 'lucide-react'
import { demoAuthProvider, useAdminAuth } from '@/lib/admin-auth'
import { BrandLogo } from '@/components/layout/brand-logo'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar({ pathname }: { pathname: string }) {
  const router = useRouter()
  const { session, setSession } = useAdminAuth()

  const handleSignOut = async () => {
    await demoAuthProvider.signOut()
    setSession(null)
    router.replace('/admin/login')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <BrandLogo />
      </div>

      <nav aria-label="Admin" className="flex-1 px-3 py-5">
        <p className="px-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Manage</p>
        <ul className="mt-3 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active ? 'text-primary' : 'text-foreground/75 hover:bg-secondary hover:text-foreground',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-nav-active"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon className="relative size-4" aria-hidden="true" />
                  <span className="relative">{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <Link
          href="/"
          target="_blank"
          className="mt-6 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          View storefront
        </Link>
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-xs text-muted-foreground">Signed in as</p>
        <p className="truncate text-sm font-medium text-foreground">{session?.email}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  )
}
