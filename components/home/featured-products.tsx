'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCategoryLookup, usePublicProducts } from '@/hooks/use-storefront'
import { ProductCard } from '@/components/products/product-card'
import { SectionHeading } from '@/components/shared/section-heading'

const MAX_FEATURED = 4

export function FeaturedProducts() {
  const products = usePublicProducts()
  const categoryLookup = useCategoryLookup()

  const featured = useMemo(() => {
    const picked = products.filter((p) => p.featured)
    const fallback = products.filter((p) => !p.featured)
    return [...picked, ...fallback].slice(0, MAX_FEATURED)
  }, [products])

  if (featured.length === 0) return null

  return (
    <section aria-labelledby="featured-title" className="bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          id="featured-title"
          eyebrow="Featured products"
          title="Trusted by farmers across Nigeria"
          description="A selection of our most requested inputs. Prices are per pack — message us for bulk and dealer pricing."
          action={
            <Link
              href="/products"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-primary/30 bg-card px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Browse catalogue
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} category={categoryLookup.get(product.categoryId)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
