'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Product, StockStatus } from '@/types'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'
import { formatNaira, getStockStatus } from '@/lib/catalog'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { SelectChevron, nativeSelectClass } from '@/components/admin/form-field'
import { ProductImage } from '@/components/products/product-image'
import { StockBadge } from '@/components/products/stock-badge'
import { Input } from '@/components/ui/input'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

type AdminSort = 'updated' | 'name' | 'price-asc' | 'price-desc' | 'stock-asc'

const dateFormatter = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

export function AdminProductList() {
  const { products, categories, deleteProduct } = useAdminCatalog()

  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('all')
  const [stock, setStock] = useState<'all' | StockStatus>('all')
  const [sort, setSort] = useState<AdminSort>('updated')
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)

  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = products.filter((p) => {
      if (categoryId !== 'all' && p.categoryId !== categoryId) return false
      if (stock !== 'all' && getStockStatus(p.stock) !== stock) return false
      if (!q) return true
      return [p.name, p.brand, p.activeIngredient ?? ''].some((v) => v.toLowerCase().includes(q))
    })
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'stock-asc':
          return a.stock - b.stock
        default:
          return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
      }
    })
  }, [products, query, categoryId, stock, sort])

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteProduct(pendingDelete.id)
      toast.success(`${pendingDelete.name} deleted`)
      setPendingDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete product.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your catalogue.`}
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add product
          </Link>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, brand, or ingredient"
            aria-label="Search products"
            className="pl-9"
          />
        </div>
        <FilterSelect label="Category" value={categoryId} onChange={setCategoryId}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
              {c.isActive ? '' : ' (inactive)'}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Stock status" value={stock} onChange={(v) => setStock(v as typeof stock)}>
          <option value="all">All stock</option>
          <option value="in-stock">In stock</option>
          <option value="low-stock">Low stock</option>
          <option value="out-of-stock">Out of stock</option>
        </FilterSelect>
        <FilterSelect label="Sort" value={sort} onChange={(v) => setSort(v as AdminSort)}>
          <option value="updated">Recently updated</option>
          <option value="name">Name A–Z</option>
          <option value="price-asc">Price low–high</option>
          <option value="price-desc">Price high–low</option>
          <option value="stock-asc">Stock low–high</option>
        </FilterSelect>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-heading text-lg font-bold">No products match</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or filter, or add a new product.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 text-right font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                          <ProductImage src={p.images[0]} alt="" sizes="40px" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{categoryNames.get(p.categoryId) ?? 'Unassigned'}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatNaira(p.price)}</td>
                    <td className="px-4 py-3">
                      <StockBadge stock={p.stock} showCount />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{dateFormatter.format(new Date(p.updatedAt))}</td>
                    <td className="px-4 py-3">
                      <RowActions product={p} onDelete={() => setPendingDelete(p)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="flex flex-col gap-3 md:hidden">
            {visible.map((p) => (
              <li key={p.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  <ProductImage src={p.images[0]} alt="" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryNames.get(p.categoryId) ?? 'Unassigned'} · {formatNaira(p.price)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StockBadge stock={p.stock} showCount />
                    <StatusPill status={p.status} />
                  </div>
                </div>
                <RowActions product={p} onDelete={() => setPendingDelete(p)} vertical />
              </li>
            ))}
          </ul>
        </>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be permanently removed from the catalogue and storefront. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="relative md:w-44">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={nativeSelectClass}>
        {children}
      </select>
      <SelectChevron />
    </div>
  )
}

function StatusPill({ status }: { status: Product['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
        status === 'published' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      )}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  )
}

function RowActions({ product, onDelete, vertical }: { product: Product; onDelete: () => void; vertical?: boolean }) {
  return (
    <div className={cn('flex justify-end gap-1', vertical && 'flex-col')}>
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Pencil className="size-4" aria-hidden="true" />
        <span className="sr-only">Edit {product.name}</span>
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        <span className="sr-only">Delete {product.name}</span>
      </button>
    </div>
  )
}
