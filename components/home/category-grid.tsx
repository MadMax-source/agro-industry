'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useCategoryProductCounts, usePublicCategories } from '@/hooks/use-storefront'
import { ProductImage } from '@/components/products/product-image'
import { SectionHeading } from '@/components/shared/section-heading'

export function CategoryGrid() {
  const categories = usePublicCategories()
  const counts = useCategoryProductCounts()

  if (categories.length === 0) return null

  return (
    <section aria-labelledby="categories-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        id="categories-title"
        eyebrow="Shop by category"
        title="Everything your farm needs"
        description="From soil preparation to harvest, find the right inputs for every stage of the growing season."
        action={
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            View all products
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        }
      />

      <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => {
          const count = counts[category.id] ?? 0
          return (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl bg-secondary p-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:aspect-[4/3] sm:p-5"
              >
                <ProductImage
                  src={category.image}
                  alt=""
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative">
                  <h3 className="font-heading text-base font-bold leading-tight text-background sm:text-lg">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-background/80 sm:text-sm">
                    {count} {count === 1 ? 'product' : 'products'}
                  </p>
                </div>
                <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
