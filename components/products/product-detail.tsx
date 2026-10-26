'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useCategoryLookup, useHasHydrated, usePublicProducts } from '@/hooks/use-storefront'
import { formatNaira } from '@/lib/catalog'
import { Breadcrumbs } from '@/components/layout/page-header'
import { NotFoundState } from '@/components/shared/not-found-state'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { ProductGallery } from '@/components/products/product-gallery'
import { ProductInfoTabs } from '@/components/products/product-info-tabs'
import { QuantityStepper } from '@/components/products/quantity-stepper'
import { StockBadge } from '@/components/products/stock-badge'
import { WhatsAppOrderButton } from '@/components/products/whatsapp-order-button'
import { ProductCard } from '@/components/products/product-card'
import { SectionHeading } from '@/components/shared/section-heading'

export function ProductDetail({ slug }: { slug: string }) {
  const products = usePublicProducts()
  const categoryLookup = useCategoryLookup()
  const hasHydrated = useHasHydrated()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.slug === slug)
  const related = useMemo(
    () => (product ? products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4) : []),
    [products, product],
  )

  if (!product) {
    if (!hasHydrated) return <PageSkeleton />
    return (
      <NotFoundState
        title="Product not found"
        description="This product may have been removed or is temporarily unavailable. Browse our catalogue for alternatives."
        action={{ href: '/products', label: 'Browse products' }}
      />
    )
  }

  const category = categoryLookup.get(product.categoryId)
  const outOfStock = product.stock <= 0
  const specs = [
    { label: 'Brand', value: product.brand },
    { label: 'Active ingredient', value: product.activeIngredient },
    { label: 'Formulation', value: product.formulation },
    { label: 'Manufacturer', value: product.manufacturer },
    { label: 'Pack size', value: product.packSize },
    { label: 'SKU', value: product.sku },
  ].filter((spec): spec is { label: string; value: string } => !!spec.value)

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:underline"
                >
                  {category.name}
                </Link>
              )}
              <StockBadge stock={product.stock} showCount />
            </div>

            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-balance text-foreground md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-pretty text-muted-foreground">{product.shortDescription}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <p className="font-heading text-4xl font-extrabold text-foreground">{formatNaira(product.price)}</p>
              <p className="text-sm text-muted-foreground">per {product.packSize}</p>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-card p-4">
                  <dt className="text-xs font-medium text-muted-foreground">{spec.label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-secondary/50 p-5">
              {!outOfStock && (
                <div className="flex items-center justify-between gap-4">
                  <span id="quantity-label" className="text-sm font-semibold text-foreground">
                    Quantity
                  </span>
                  <QuantityStepper
                    value={quantity}
                    max={product.stock}
                    onChange={setQuantity}
                    labelledBy="quantity-label"
                  />
                </div>
              )}
              {!outOfStock && quantity > 1 && (
                <p className="flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-heading text-lg font-bold text-foreground">
                    {formatNaira(product.price * quantity)}
                  </span>
                </p>
              )}
              <WhatsAppOrderButton product={product} quantity={quantity} size="lg" />
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                {outOfStock
                  ? 'This product is currently out of stock. Message us on WhatsApp to be notified when it returns.'
                  : 'Your order opens in WhatsApp, pre-filled and ready to send. Final price and delivery are confirmed by our team.'}
              </p>
            </div>
          </div>
        </div>

        <ProductInfoTabs product={product} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-border bg-secondary/60">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading id="related-title" eyebrow="You may also need" title="Related products" />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <li key={item.id}>
                  <ProductCard product={item} category={category} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
