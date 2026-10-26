'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { Category } from '@/types'
import { useCatalogStore } from '@/store/catalog-store'
import { countProductsByCategory } from '@/lib/catalog'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { CategoryFormDialog } from '@/components/admin/category-form-dialog'
import { CategoryDeleteDialog } from '@/components/admin/category-delete-dialog'
import { ProductImage } from '@/components/products/product-image'
import { Stagger, staggerItem } from '@/components/shared/reveal'
import { Switch } from '@/components/ui/switch'

export function AdminCategories() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categories = useCatalogStore((s) => s.categories)
  const products = useCatalogStore((s) => s.products)
  const setCategoryActive = useCatalogStore((s) => s.setCategoryActive)

  const [editing, setEditing] = useState<Category | null>(null)
  const [creating, setCreating] = useState(searchParams.get('new') === '1')
  const [deleting, setDeleting] = useState<Category | null>(null)

  const counts = useMemo(() => countProductsByCategory(products), [products])
  const sorted = useMemo(() => [...categories].sort((a, b) => a.displayOrder - b.displayOrder), [categories])

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
    if (searchParams.get('new')) router.replace('/admin/categories')
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Categories"
        description="Inactive categories and their products are hidden from the storefront."
        actions={
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden="true" />
            New category
          </button>
        }
      />

      <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((category) => (
          <motion.li
            key={category.id}
            variants={staggerItem}
            layout
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="relative aspect-[16/9] bg-secondary">
              <ProductImage src={category.image} alt="" sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" />
              {!category.isActive && (
                <span className="absolute left-3 top-3 rounded-full bg-foreground/80 px-2.5 py-1 text-xs font-semibold text-background">
                  Inactive
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-lg font-bold">{category.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    /{category.slug} · Order {category.displayOrder} · {counts[category.id] ?? 0} products
                  </p>
                </div>
                <Switch
                  checked={category.isActive}
                  aria-label={`${category.isActive ? 'Deactivate' : 'Activate'} ${category.name}`}
                  onCheckedChange={(v) => {
                    setCategoryActive(category.id, !!v)
                    toast.success(`${category.name} ${v ? 'activated' : 'deactivated'}`)
                  }}
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{category.description}</p>
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(category)}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium hover:bg-secondary"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(category)}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  <span className="sr-only">Delete {category.name}</span>
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </Stagger>

      <CategoryFormDialog
        open={creating || !!editing}
        category={editing}
        onOpenChange={(open) => !open && closeForm()}
      />
      <CategoryDeleteDialog
        category={deleting}
        productCount={deleting ? counts[deleting.id] ?? 0 : 0}
        onOpenChange={(open) => !open && setDeleting(null)}
      />
    </div>
  )
}
