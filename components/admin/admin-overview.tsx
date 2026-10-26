'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { AlertTriangle, Boxes, FolderTree, Package, PackageX, Plus } from 'lucide-react'
import { useCatalogStore } from '@/store/catalog-store'
import { formatNaira, getStockStatus } from '@/lib/catalog'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ProductImage } from '@/components/products/product-image'
import { StockBadge } from '@/components/products/stock-badge'
import { Stagger, staggerItem } from '@/components/shared/reveal'

const dateFormatter = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

export function AdminOverview() {
  const products = useCatalogStore((s) => s.products)
  const categories = useCatalogStore((s) => s.categories)

  const stats = useMemo(() => {
    const low = products.filter((p) => getStockStatus(p.stock) === 'low-stock')
    const out = products.filter((p) => p.stock <= 0)
    return {
      total: products.length,
      activeCategories: categories.filter((c) => c.isActive).length,
      units: products.reduce((sum, p) => sum + Math.max(0, p.stock), 0),
      low,
      out,
      recent: [...products].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
      distribution: categories
        .map((c) => ({ category: c, count: products.filter((p) => p.categoryId === c.id).length }))
        .sort((a, b) => b.count - a.count),
    }
  }, [products, categories])

  const maxCount = Math.max(1, ...stats.distribution.map((d) => d.count))

  const cards = [
    { label: 'Total products', value: stats.total, icon: Package },
    { label: 'Active categories', value: stats.activeCategories, icon: FolderTree },
    { label: 'Inventory units', value: stats.units.toLocaleString('en-NG'), icon: Boxes },
    { label: 'Low in stock', value: stats.low.length, icon: AlertTriangle },
    { label: 'Out of stock', value: stats.out.length, icon: PackageX },
  ]

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Overview"
        description="A live snapshot of your catalogue. Figures reflect the products and categories you manage here."
        actions={
          <>
            <Link
              href="/admin/products/new"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add product
            </Link>
            <Link
              href="/admin/categories?new=1"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold hover:bg-secondary"
            >
              <Plus className="size-4" aria-hidden="true" />
              New category
            </Link>
          </>
        }
      />

      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ label, value, icon: Icon }) => (
          <motion.li key={label} variants={staggerItem} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-4 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-3 font-heading text-3xl font-bold text-foreground">{value}</p>
          </motion.li>
        ))}
      </Stagger>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="rounded-xl border border-border bg-card lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-heading text-lg font-bold">Recently added</h2>
            <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {stats.recent.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/products/${p.id}/edit`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary/60">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    <ProductImage src={p.images[0]} alt="" sizes="44px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{dateFormatter.format(new Date(p.createdAt))}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatNaira(p.price)}</p>
                </Link>
              </li>
            ))}
            {stats.recent.length === 0 && <li className="p-5 text-sm text-muted-foreground">No products yet.</li>}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="border-b border-border p-5">
            <h2 className="font-heading text-lg font-bold">Category distribution</h2>
          </div>
          <ul className="flex flex-col gap-4 p-5">
            {stats.distribution.map(({ category, count }) => (
              <li key={category.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className={category.isActive ? 'text-foreground' : 'text-muted-foreground line-through'}>
                    {category.name}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="font-heading text-lg font-bold">Needs restocking</h2>
          <p className="mt-1 text-sm text-muted-foreground">Low-stock and out-of-stock products.</p>
        </div>
        <ul className="divide-y divide-border">
          {[...stats.out, ...stats.low].map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <Link href={`/admin/products/${p.id}/edit`} className="truncate text-sm font-medium hover:text-primary">
                {p.name}
              </Link>
              <StockBadge stock={p.stock} showCount />
            </li>
          ))}
          {stats.out.length + stats.low.length === 0 && (
            <li className="p-5 text-sm text-muted-foreground">All products are well stocked.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
