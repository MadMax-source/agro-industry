'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'
import { formatNaira } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ProductImage } from '@/components/products/product-image'
import { QuantityStepper } from '@/components/products/quantity-stepper'
import { StockBadge } from '@/components/products/stock-badge'
import { ProceedToBuyButton } from '@/components/products/proceed-to-buy-button'

interface BuyDialogProps {
  product: Product
  className?: string
}

export function BuyDialog({ product, className }: BuyDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const outOfStock = product.stock <= 0
  const labelId = `buy-qty-${product.id}`

  if (outOfStock) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          'inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-lg bg-muted px-4 text-sm font-semibold text-muted-foreground',
          className,
        )}
      >
        Out of Stock
      </button>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setQuantity(1)
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className={cn(
              'group/buy inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              className,
            )}
          />
        }
      >
        <ShoppingBag className="size-4 transition-transform group-hover/buy:-rotate-6" aria-hidden="true" />
        Buy
        <span className="sr-only">{product.name}</span>
      </DialogTrigger>

      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="relative aspect-[16/9] bg-secondary">
          <ProductImage src={product.images[0]} alt={product.name} sizes="448px" />
          <div className="absolute left-3 top-3">
            <StockBadge stock={product.stock} showCount className="bg-card/95 backdrop-blur" />
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{product.brand}</p>
            <DialogTitle className="mt-1 font-heading text-2xl font-bold leading-tight">{product.name}</DialogTitle>
            <DialogDescription className="mt-1 line-clamp-2">{product.shortDescription}</DialogDescription>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">{formatNaira(product.price)}</p>
              <p className="text-xs text-muted-foreground">per {product.packSize}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span id={labelId} className="text-xs font-medium text-muted-foreground">
                Quantity
              </span>
              <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} labelledBy={labelId} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-secondary/70 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Estimated total</span>
            <span className="font-heading text-lg font-bold text-foreground">
              {formatNaira(product.price * quantity)}
            </span>
          </div>

          <ProceedToBuyButton product={product} quantity={quantity} onProceed={() => setOpen(false)} />

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            {'Our team confirms final price, payment, and delivery. '}
            <Link
              href={`/products/${product.slug}`}
              onClick={() => setOpen(false)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              View full details
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
