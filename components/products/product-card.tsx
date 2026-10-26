'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import type { Category, Product } from '@/types'
import { formatNaira } from '@/lib/catalog'
import { ProductImage } from '@/components/products/product-image'
import { StockBadge } from '@/components/products/stock-badge'
import { BuyDialog } from '@/components/products/buy-dialog'

interface ProductCardProps {
  product: Product
  category?: Category
  priority?: boolean
}

export function ProductCard({ product, category, priority }: ProductCardProps) {
  const href = `/products/${product.slug}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
    >
      <Link href={href} className="relative block aspect-square overflow-hidden bg-secondary" tabIndex={-1} aria-hidden="true">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-deep/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div className="absolute left-3 top-3">
          <StockBadge stock={product.stock} className="bg-card/95 backdrop-blur" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="truncate font-semibold uppercase tracking-wide text-primary hover:underline"
            >
              {category.name}
            </Link>
          )}
          <span className="shrink-0 text-muted-foreground">{product.brand}</span>
        </div>

        <h3 className="font-heading text-lg font-bold leading-snug text-foreground">
          <Link href={href} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>

        {product.activeIngredient && (
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Active: </span>
            {product.activeIngredient}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
          <div>
            <p className="font-heading text-xl font-bold text-foreground">{formatNaira(product.price)}</p>
            <p className="text-xs text-muted-foreground">per {product.packSize}</p>
          </div>
          {product.formulation && (
            <span className="max-w-[50%] truncate rounded-md bg-muted px-2 py-1 text-[0.7rem] font-medium text-muted-foreground">
              {product.formulation}
            </span>
          )}
        </div>

        <BuyDialog product={product} />
      </div>
    </motion.article>
  )
}
