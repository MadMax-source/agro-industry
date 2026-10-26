'use client'

import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useCatalogStore } from '@/store/catalog-store'
import { ProductForm } from '@/components/admin/product-form'

export function EditProduct({ id }: { id: string }) {
  const product = useCatalogStore((s) => s.products.find((p) => p.id === id))
  const hasHydrated = useCatalogStore((s) => s.hasHydrated)

  if (!hasHydrated) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-primary" aria-label="Loading product" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <p className="font-heading text-lg font-bold">Product not found</p>
        <p className="mt-1 text-sm text-muted-foreground">It may have been deleted.</p>
        <Link href="/admin/products" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  return <ProductForm key={product.id} product={product} />
}
