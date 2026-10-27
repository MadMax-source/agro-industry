'use client'

import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useAdminCatalog } from '@/contexts/admin-catalog-context'
import { ProductForm } from '@/components/admin/product-form'

export function EditProduct({ id }: { id: string }) {
  const { products, loading } = useAdminCatalog()
  const product = products.find((p) => p.id === id)

  if (loading) {
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
